<?php
// API d'authentification EcoRide
// Gestion des connexions, inscriptions et sessions

require_once 'config.php';
require_once 'mongodb.php';

class AuthAPI {
    private $conn;
    
    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
    }
    
    // Inscription d'un nouvel utilisateur
    public function register($data) {
        $errors = validateInput($data, ['pseudo', 'email', 'password']);
        
        if (!empty($errors)) {
            sendResponse(['success' => false, 'errors' => $errors], 400);
        }
        
        $pseudo = sanitizeInput($data['pseudo']);
        $email = sanitizeInput($data['email']);
        $password = $data['password'];
        
        // Vérifier la sécurité du mot de passe
        if (!$this->isPasswordSecure($password)) {
            sendResponse([
                'success' => false, 
                'message' => 'Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre'
            ], 400);
        }
        
        // Vérifier si le pseudo ou email existe déjà
        $stmt = $this->conn->prepare("SELECT id FROM users WHERE pseudo = ? OR email = ?");
        $stmt->execute([$pseudo, $email]);
        
        if ($stmt->rowCount() > 0) {
            sendResponse([
                'success' => false, 
                'message' => 'Ce pseudo ou email est déjà utilisé'
            ], 400);
        }
        
        // Créer le compte
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
        
        $stmt = $this->conn->prepare("
            INSERT INTO users (pseudo, email, password, credits, role, type) 
            VALUES (?, ?, ?, 20, 'user', 'passager')
        ");
        
        if ($stmt->execute([$pseudo, $email, $hashedPassword])) {
            $user_id = $this->conn->lastInsertId();
            
            // Créer une transaction pour les crédits initiaux
            $this->createTransaction($user_id, 'credit', 20, 'Crédits offerts à l\'inscription');
            
            sendResponse([
                'success' => true,
                'message' => 'Compte créé avec succès',
                'user' => [
                    'id' => $user_id,
                    'pseudo' => $pseudo,
                    'email' => $email,
                    'credits' => 20,
                    'role' => 'user',
                    'type' => 'passager'
                ]
            ]);
        } else {
            sendResponse(['success' => false, 'message' => 'Erreur lors de la création du compte'], 500);
        }
    }
    
    // Connexion utilisateur
    public function login($data) {
        $errors = validateInput($data, ['pseudo', 'password']);
        
        if (!empty($errors)) {
            sendResponse(['success' => false, 'errors' => $errors], 400);
        }
        
        $pseudo = sanitizeInput($data['pseudo']);
        $password = $data['password'];
        
        // Chercher dans les utilisateurs
        $stmt = $this->conn->prepare("
            SELECT id, pseudo, email, password, credits, role, type, preferences_fumeur, preferences_animaux, preferences_autres
            FROM users WHERE pseudo = ?
        ");
        $stmt->execute([$pseudo]);
        $user = $stmt->fetch();
        
        if ($user && password_verify($password, $user['password'])) {
            $token = generateToken($user['id']);
            
            // Stocker le token en session (ou en base si nécessaire)
            session_start();
            $_SESSION['user_token'] = $token;
            $_SESSION['user_id'] = $user['id'];
            
            // Stocker la session dans MongoDB
            global $mongodbService;
            if ($mongodbService->isEnabled()) {
                $mongodbService->storeSession($token, $user, 86400);
                $mongodbService->logActivity($user['id'], 'login', ['ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown']);
            }
            
            unset($user['password']); // Ne pas renvoyer le mot de passe
            
            sendResponse([
                'success' => true,
                'message' => 'Connexion réussie',
                'token' => $token,
                'user' => $user
            ]);
        }
        
        // Chercher dans les employés
        $stmt = $this->conn->prepare("SELECT id, pseudo, email, password, role FROM employees WHERE pseudo = ?");
        $stmt->execute([$pseudo]);
        $employee = $stmt->fetch();
        
        if ($employee && password_verify($password, $employee['password'])) {
            $token = generateToken($employee['id']);
            
            session_start();
            $_SESSION['user_token'] = $token;
            $_SESSION['user_id'] = $employee['id'];
            
            unset($employee['password']);
            
            sendResponse([
                'success' => true,
                'message' => 'Connexion employé réussie',
                'token' => $token,
                'user' => $employee
            ]);
        }
        
        // Chercher dans les administrateurs
        $stmt = $this->conn->prepare("SELECT id, pseudo, email, password, role FROM admins WHERE pseudo = ?");
        $stmt->execute([$pseudo]);
        $admin = $stmt->fetch();
        
        if ($admin && password_verify($password, $admin['password'])) {
            $token = generateToken($admin['id']);
            
            session_start();
            $_SESSION['user_token'] = $token;
            $_SESSION['user_id'] = $admin['id'];
            
            unset($admin['password']);
            
            sendResponse([
                'success' => true,
                'message' => 'Connexion administrateur réussie',
                'token' => $token,
                'user' => $admin
            ]);
        }
        
        sendResponse(['success' => false, 'message' => 'Identifiants incorrects'], 401);
    }
    
    // Déconnexion
    public function logout() {
        session_start();
        session_destroy();
        sendResponse(['success' => true, 'message' => 'Déconnexion réussie']);
    }
    
    // Vérifier la session
    public function checkSession() {
        session_start();
        
        if (!isset($_SESSION['user_token'])) {
            sendResponse(['success' => false, 'message' => 'Non connecté'], 401);
        }
        
        $user_id = verifyToken($_SESSION['user_token']);
        
        if (!$user_id) {
            session_destroy();
            sendResponse(['success' => false, 'message' => 'Session expirée'], 401);
        }
        
        // Récupérer les informations utilisateur
        $stmt = $this->conn->prepare("
            SELECT id, pseudo, email, credits, role, type, preferences_fumeur, preferences_animaux, preferences_autres
            FROM users WHERE id = ?
        ");
        $stmt->execute([$user_id]);
        $user = $stmt->fetch();
        
        if (!$user) {
            // Vérifier dans les employés
            $stmt = $this->conn->prepare("SELECT id, pseudo, email, role FROM employees WHERE id = ?");
            $stmt->execute([$user_id]);
            $user = $stmt->fetch();
            
            if (!$user) {
                // Vérifier dans les admins
                $stmt = $this->conn->prepare("SELECT id, pseudo, email, role FROM admins WHERE id = ?");
                $stmt->execute([$user_id]);
                $user = $stmt->fetch();
            }
        }
        
        if ($user) {
            sendResponse(['success' => true, 'user' => $user]);
        } else {
            session_destroy();
            sendResponse(['success' => false, 'message' => 'Utilisateur introuvable'], 401);
        }
    }
    
    // Mettre à jour le profil utilisateur
    public function updateProfile($data) {
        session_start();
        
        if (!isset($_SESSION['user_token'])) {
            sendResponse(['success' => false, 'message' => 'Non connecté'], 401);
        }
        
        $user_id = verifyToken($_SESSION['user_token']);
        
        if (!$user_id) {
            sendResponse(['success' => false, 'message' => 'Session expirée'], 401);
        }
        
        $updates = [];
        $params = [];
        
        if (isset($data['type'])) {
            $updates[] = "type = ?";
            $params[] = sanitizeInput($data['type']);
        }
        
        if (isset($data['preferences_fumeur'])) {
            $updates[] = "preferences_fumeur = ?";
            $params[] = $data['preferences_fumeur'] ? 1 : 0;
        }
        
        if (isset($data['preferences_animaux'])) {
            $updates[] = "preferences_animaux = ?";
            $params[] = $data['preferences_animaux'] ? 1 : 0;
        }
        
        if (isset($data['preferences_autres'])) {
            $updates[] = "preferences_autres = ?";
            $params[] = sanitizeInput($data['preferences_autres']);
        }
        
        if (empty($updates)) {
            sendResponse(['success' => false, 'message' => 'Aucune donnée à mettre à jour'], 400);
        }
        
        $params[] = $user_id;
        
        $stmt = $this->conn->prepare("
            UPDATE users SET " . implode(', ', $updates) . " WHERE id = ?
        ");
        
        if ($stmt->execute($params)) {
            sendResponse(['success' => true, 'message' => 'Profil mis à jour avec succès']);
        } else {
            sendResponse(['success' => false, 'message' => 'Erreur lors de la mise à jour'], 500);
        }
    }
    
    // Vérifier la sécurité du mot de passe
    private function isPasswordSecure($password) {
        return strlen($password) >= 8 && 
               preg_match('/[A-Z]/', $password) && 
               preg_match('/[a-z]/', $password) && 
               preg_match('/\d/', $password);
    }
    
    // Créer une transaction
    private function createTransaction($user_id, $type, $montant, $description, $trip_id = null) {
        $stmt = $this->conn->prepare("
            INSERT INTO transactions (user_id, type, montant, description, trip_id) 
            VALUES (?, ?, ?, ?, ?)
        ");
        $stmt->execute([$user_id, $type, $montant, $description, $trip_id]);
    }
}

// Gestion des requêtes
$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

$authAPI = new AuthAPI();

switch ($method) {
    case 'POST':
        $input = json_decode(file_get_contents('php://input'), true);
        
        switch ($action) {
            case 'register':
                $authAPI->register($input);
                break;
            case 'login':
                $authAPI->login($input);
                break;
            case 'logout':
                $authAPI->logout();
                break;
            case 'update-profile':
                $authAPI->updateProfile($input);
                break;
            default:
                sendResponse(['success' => false, 'message' => 'Action non trouvée'], 404);
        }
        break;
        
    case 'GET':
        switch ($action) {
            case 'check-session':
                $authAPI->checkSession();
                break;
            default:
                sendResponse(['success' => false, 'message' => 'Action non trouvée'], 404);
        }
        break;
        
    default:
        sendResponse(['success' => false, 'message' => 'Méthode non autorisée'], 405);
}
?>

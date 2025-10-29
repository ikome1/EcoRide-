<?php
// Configuration de la base de données EcoRide
// Fichier de configuration pour la connexion MySQL

class Database {
    private $host = 'localhost';
    private $db_name = 'ecoride';
    private $username = 'root';
    private $password = '';
    private $conn;

    public function getConnection() {
        $this->conn = null;
        
        try {
            $this->conn = new PDO(
                "mysql:host=" . $this->host . ";dbname=" . $this->db_name . ";charset=utf8mb4",
                $this->username,
                $this->password,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::ATTR_EMULATE_PREPARES => false
                ]
            );
        } catch(PDOException $exception) {
            echo "Erreur de connexion: " . $exception->getMessage();
        }
        
        return $this->conn;
    }
}

// Fonction utilitaire pour les réponses JSON
function sendResponse($data, $status = 200) {
    http_response_code($status);
    header('Content-Type: application/json; charset=utf-8');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

// Fonction pour valider les données d'entrée
function validateInput($data, $required_fields) {
    $errors = [];
    
    foreach ($required_fields as $field) {
        if (!isset($data[$field]) || empty(trim($data[$field]))) {
            $errors[] = "Le champ '$field' est requis";
        }
    }
    
    return $errors;
}

// Fonction pour sécuriser les données
function sanitizeInput($data) {
    if (is_array($data)) {
        return array_map('sanitizeInput', $data);
    }
    return htmlspecialchars(strip_tags(trim($data)), ENT_QUOTES, 'UTF-8');
}

// Fonction pour générer un token de session
function generateToken($user_id) {
    return base64_encode($user_id . ':' . time() . ':' . bin2hex(random_bytes(16)));
}

// Fonction pour vérifier le token de session
function verifyToken($token) {
    $decoded = base64_decode($token);
    $parts = explode(':', $decoded);
    
    if (count($parts) !== 3) {
        return false;
    }
    
    $user_id = $parts[0];
    $timestamp = $parts[1];
    
    // Token valide pendant 24h
    if (time() - $timestamp > 86400) {
        return false;
    }
    
    return $user_id;
}

// Gestion des erreurs CORS pour les requêtes OPTIONS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    sendResponse(['message' => 'OK']);
}
?>

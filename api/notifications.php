<?php
// API de notifications EcoRide
// Utilise MongoDB pour stocker les notifications

require_once 'config.php';
require_once 'mongodb.php';

class NotificationsAPI {
    private $conn;
    private $mongodb;
    
    public function __construct() {
        $database = new Database();
        $this->conn = $database->getConnection();
        global $mongodbService;
        $this->mongodb = $mongodbService;
    }
    
    // Obtenir les notifications d'un utilisateur
    public function getUserNotifications() {
        session_start();
        
        if (!isset($_SESSION['user_token'])) {
            sendResponse(['success' => false, 'message' => 'Non connecté'], 401);
        }
        
        $user_id = verifyToken($_SESSION['user_token']);
        
        if (!$user_id) {
            sendResponse(['success' => false, 'message' => 'Session expirée'], 401);
        }
        
        $notifications = $this->mongodb->getUserNotifications($user_id, 20);
        
        sendResponse([
            'success' => true,
            'notifications' => $notifications,
            'count' => count($notifications)
        ]);
    }
    
    // Marquer une notification comme lue
    public function markAsRead($data) {
        session_start();
        
        if (!isset($_SESSION['user_token'])) {
            sendResponse(['success' => false, 'message' => 'Non connecté'], 401);
        }
        
        $user_id = verifyToken($_SESSION['user_token']);
        
        if (!$user_id) {
            sendResponse(['success' => false, 'message' => 'Session expirée'], 401);
        }
        
        if (!isset($data['notification_id'])) {
            sendResponse(['success' => false, 'message' => 'ID de notification requis'], 400);
        }
        
        $success = $this->mongodb->markNotificationAsRead($data['notification_id']);
        
        if ($success) {
            sendResponse(['success' => true, 'message' => 'Notification marquée comme lue']);
        } else {
            sendResponse(['success' => false, 'message' => 'Erreur lors de la mise à jour'], 500);
        }
    }
}

// Gestion des requêtes
$method = $_SERVER['REQUEST_METHOD'];
$action = $_GET['action'] ?? '';

$notificationsAPI = new NotificationsAPI();

switch ($method) {
    case 'GET':
        switch ($action) {
            case 'list':
                $notificationsAPI->getUserNotifications();
                break;
            default:
                sendResponse(['success' => false, 'message' => 'Action non trouvée'], 404);
        }
        break;
        
    case 'POST':
        $input = json_decode(file_get_contents('php://input'), true);
        
        switch ($action) {
            case 'read':
                $notificationsAPI->markAsRead($input);
                break;
            default:
                sendResponse(['success' => false, 'message' => 'Action non trouvée'], 404);
        }
        break;
        
    default:
        sendResponse(['success' => false, 'message' => 'Méthode non autorisée'], 405);
}
?>


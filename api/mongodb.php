<?php
// API MongoDB pour EcoRide
// Composant d'accès aux données NoSQL (MongoDB)

require_once 'config.php';

class MongoDBService {
    private $client;
    private $db;
    private $enabled;
    
    public function __construct() {
        // Vérifier si l'extension MongoDB est disponible
        $this->enabled = extension_loaded('mongodb');
        
        if ($this->enabled) {
            try {
                // Connexion à MongoDB (vérifier variable d'environnement ou utiliser localhost)
                $mongodb_uri = $_ENV['MONGODB_URI'] ?? 'mongodb://localhost:27017';
                $this->client = new MongoDB\Client($mongodb_uri);
                $this->db = $this->client->selectDatabase('ecoride');
            } catch (Exception $e) {
                $this->enabled = false;
                error_log('Erreur MongoDB: ' . $e->getMessage());
            }
        }
    }
    
    // Enregistrer les logs d'activité
    public function logActivity($user_id, $action, $details = []) {
        if (!$this->enabled) {
            return false;
        }
        
        try {
            $collection = $this->db->selectCollection('activity_logs');
            
            $document = [
                'user_id' => (int)$user_id,
                'action' => $action,
                'details' => $details,
                'timestamp' => new MongoDB\BSON\UTCDateTime(),
                'ip_address' => $_SERVER['REMOTE_ADDR'] ?? 'unknown'
            ];
            
            $result = $collection->insertOne($document);
            return $result->getInsertedId();
        } catch (Exception $e) {
            error_log('Erreur MongoDB logActivity: ' . $e->getMessage());
            return false;
        }
    }
    
    // Stocker les sessions utilisateur
    public function storeSession($session_id, $user_data, $ttl = 3600) {
        if (!$this->enabled) {
            return false;
        }
        
        try {
            $collection = $this->db->selectCollection('sessions');
            
            $document = [
                'session_id' => $session_id,
                'user_data' => $user_data,
                'created_at' => new MongoDB\BSON\UTCDateTime(),
                'expires_at' => new MongoDB\BSON\UTCDateTime((time() + $ttl) * 1000)
            ];
            
            $result = $collection->replaceOne(
                ['session_id' => $session_id],
                $document,
                ['upsert' => true]
            );
            
            return $result->getModifiedCount() > 0 || $result->getUpsertedCount() > 0;
        } catch (Exception $e) {
            error_log('Erreur MongoDB storeSession: ' . $e->getMessage());
            return false;
        }
    }
    
    // Récupérer une session
    public function getSession($session_id) {
        if (!$this->enabled) {
            return false;
        }
        
        try {
            $collection = $this->db->selectCollection('sessions');
            
            $session = $collection->findOne([
                'session_id' => $session_id,
                'expires_at' => ['$gt' => new MongoDB\BSON\UTCDateTime()]
            ]);
            
            if ($session) {
                return [
                    'session_id' => $session['session_id'],
                    'user_data' => $session['user_data']->toArray(),
                    'created_at' => $session['created_at']->toDateTime()->format('Y-m-d H:i:s')
                ];
            }
            
            return false;
        } catch (Exception $e) {
            error_log('Erreur MongoDB getSession: ' . $e->getMessage());
            return false;
        }
    }
    
    // Stocker les notifications
    public function storeNotification($user_id, $type, $message, $data = []) {
        if (!$this->enabled) {
            return false;
        }
        
        try {
            $collection = $this->db->selectCollection('notifications');
            
            $document = [
                'user_id' => (int)$user_id,
                'type' => $type,
                'message' => $message,
                'data' => $data,
                'read' => false,
                'created_at' => new MongoDB\BSON\UTCDateTime()
            ];
            
            $result = $collection->insertOne($document);
            return $result->getInsertedId();
        } catch (Exception $e) {
            error_log('Erreur MongoDB storeNotification: ' . $e->getMessage());
            return false;
        }
    }
    
    // Récupérer les notifications d'un utilisateur
    public function getUserNotifications($user_id, $limit = 10) {
        if (!$this->enabled) {
            return [];
        }
        
        try {
            $collection = $this->db->selectCollection('notifications');
            
            $notifications = $collection->find(
                ['user_id' => (int)$user_id],
                [
                    'sort' => ['created_at' => -1],
                    'limit' => $limit
                ]
            );
            
            $result = [];
            foreach ($notifications as $notification) {
                $result[] = [
                    'id' => (string)$notification['_id'],
                    'type' => $notification['type'],
                    'message' => $notification['message'],
                    'data' => $notification['data']->toArray(),
                    'read' => $notification['read'],
                    'created_at' => $notification['created_at']->toDateTime()->format('Y-m-d H:i:s')
                ];
            }
            
            return $result;
        } catch (Exception $e) {
            error_log('Erreur MongoDB getUserNotifications: ' . $e->getMessage());
            return [];
        }
    }
    
    // Marquer une notification comme lue
    public function markNotificationAsRead($notification_id) {
        if (!$this->enabled) {
            return false;
        }
        
        try {
            $collection = $this->db->selectCollection('notifications');
            
            $result = $collection->updateOne(
                ['_id' => new MongoDB\BSON\ObjectId($notification_id)],
                ['$set' => ['read' => true]]
            );
            
            return $result->getModifiedCount() > 0;
        } catch (Exception $e) {
            error_log('Erreur MongoDB markNotificationAsRead: ' . $e->getMessage());
            return false;
        }
    }
    
    // Stocker les recherches fréquentes
    public function storeSearchQuery($query, $results_count) {
        if (!$this->enabled) {
            return false;
        }
        
        try {
            $collection = $this->db->selectCollection('search_queries');
            
            $document = [
                'query' => $query,
                'results_count' => $results_count,
                'timestamp' => new MongoDB\BSON\UTCDateTime()
            ];
            
            $result = $collection->insertOne($document);
            return $result->getInsertedId();
        } catch (Exception $e) {
            error_log('Erreur MongoDB storeSearchQuery: ' . $e->getMessage());
            return false;
        }
    }
    
    // Obtenir les recherches les plus fréquentes
    public function getPopularSearches($limit = 10) {
        if (!$this->enabled) {
            return [];
        }
        
        try {
            $collection = $this->db->selectCollection('search_queries');
            
            $pipeline = [
                ['$group' => [
                    '_id' => '$query',
                    'count' => ['$sum' => 1],
                    'avg_results' => ['$avg' => '$results_count']
                ]],
                ['$sort' => ['count' => -1]],
                ['$limit' => $limit]
            ];
            
            $results = $collection->aggregate($pipeline);
            
            $popular = [];
            foreach ($results as $result) {
                $popular[] = [
                    'query' => $result['_id'],
                    'count' => $result['count'],
                    'avg_results' => round($result['avg_results'], 1)
                ];
            }
            
            return $popular;
        } catch (Exception $e) {
            error_log('Erreur MongoDB getPopularSearches: ' . $e->getMessage());
            return [];
        }
    }
    
    // Vérifier si MongoDB est activé
    public function isEnabled() {
        return $this->enabled;
    }
}

// Instance globale du service MongoDB
$mongodbService = new MongoDBService();

// Fonctions utilitaires
function mongodb_logActivity($user_id, $action, $details = []) {
    global $mongodbService;
    return $mongodbService->logActivity($user_id, $action, $details);
}

function mongodb_storeNotification($user_id, $type, $message, $data = []) {
    global $mongodbService;
    return $mongodbService->storeNotification($user_id, $type, $message, $data);
}

function mongodb_getUserNotifications($user_id, $limit = 10) {
    global $mongodbService;
    return $mongodbService->getUserNotifications($user_id, $limit);
}
?>


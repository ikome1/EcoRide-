<?php
// API de cache avec Redis (NoSQL)
// Composant d'accès aux données NoSQL pour optimiser les performances

require_once 'config.php';

class CacheService {
    private $redis;
    private $enabled;
    
    public function __construct() {
        // Vérifier si Redis est disponible
        $this->enabled = extension_loaded('redis');
        
        if ($this->enabled) {
            try {
                $this->redis = new Redis();
                // Tenter de se connecter à Redis (localhost par défaut)
                $connected = @$this->redis->connect('127.0.0.1', 6379);
                
                if (!$connected) {
                    $this->enabled = false;
                    error_log('Redis non disponible, utilisation du cache en mémoire');
                }
            } catch (Exception $e) {
                $this->enabled = false;
                error_log('Erreur Redis: ' . $e->getMessage());
            }
        }
    }
    
    // Obtenir une valeur du cache
    public function get($key) {
        if (!$this->enabled) {
            return false;
        }
        
        try {
            $value = $this->redis->get($key);
            return $value !== false ? json_decode($value, true) : false;
        } catch (Exception $e) {
            error_log('Erreur Redis get: ' . $e->getMessage());
            return false;
        }
    }
    
    // Stocker une valeur dans le cache
    public function set($key, $value, $ttl = 3600) {
        if (!$this->enabled) {
            return false;
        }
        
        try {
            return $this->redis->setex($key, $ttl, json_encode($value));
        } catch (Exception $e) {
            error_log('Erreur Redis set: ' . $e->getMessage());
            return false;
        }
    }
    
    // Supprimer une clé du cache
    public function delete($key) {
        if (!$this->enabled) {
            return false;
        }
        
        try {
            return $this->redis->del($key);
        } catch (Exception $e) {
            error_log('Erreur Redis delete: ' . $e->getMessage());
            return false;
        }
    }
    
    // Supprimer toutes les clés correspondant à un pattern
    public function deletePattern($pattern) {
        if (!$this->enabled) {
            return false;
        }
        
        try {
            $keys = $this->redis->keys($pattern);
            if (!empty($keys)) {
                return $this->redis->del($keys);
            }
            return true;
        } catch (Exception $e) {
            error_log('Erreur Redis deletePattern: ' . $e->getMessage());
            return false;
        }
    }
    
    // Vérifier si une clé existe
    public function exists($key) {
        if (!$this->enabled) {
            return false;
        }
        
        try {
            return $this->redis->exists($key);
        } catch (Exception $e) {
            error_log('Erreur Redis exists: ' . $e->getMessage());
            return false;
        }
    }
    
    // Incrémenter une valeur
    public function increment($key, $value = 1) {
        if (!$this->enabled) {
            return false;
        }
        
        try {
            return $this->redis->incrBy($key, $value);
        } catch (Exception $e) {
            error_log('Erreur Redis increment: ' . $e->getMessage());
            return false;
        }
    }
    
    // Obtenir le TTL d'une clé
    public function getTTL($key) {
        if (!$this->enabled) {
            return false;
        }
        
        try {
            return $this->redis->ttl($key);
        } catch (Exception $e) {
            error_log('Erreur Redis TTL: ' . $e->getMessage());
            return false;
        }
    }
    
    // Cache avec fallback vers base de données
    public function remember($key, $callback, $ttl = 3600) {
        $cached = $this->get($key);
        
        if ($cached !== false) {
            return $cached;
        }
        
        $value = $callback();
        $this->set($key, $value, $ttl);
        
        return $value;
    }
    
    // Vérifier si Redis est activé
    public function isEnabled() {
        return $this->enabled;
    }
}

// Instance globale du service de cache
$cacheService = new CacheService();

// Fonctions utilitaires pour le cache
function cache_get($key) {
    global $cacheService;
    return $cacheService->get($key);
}

function cache_set($key, $value, $ttl = 3600) {
    global $cacheService;
    return $cacheService->set($key, $value, $ttl);
}

function cache_delete($key) {
    global $cacheService;
    return $cacheService->delete($key);
}

function cache_remember($key, $callback, $ttl = 3600) {
    global $cacheService;
    return $cacheService->remember($key, $callback, $ttl);
}

// Clés de cache standardisées
class CacheKeys {
    const USER_PROFILE = 'user:profile:%d';
    const USER_STATS = 'user:stats:%d';
    const TRIPS_SEARCH = 'trips:search:%s';
    const PLATFORM_STATS = 'platform:stats';
    const USER_VEHICLES = 'user:vehicles:%d';
    const USER_TRIPS = 'user:trips:%d';
    const PENDING_REVIEWS = 'reviews:pending';
    
    public static function userProfile($user_id) {
        return sprintf(self::USER_PROFILE, $user_id);
    }
    
    public static function userStats($user_id) {
        return sprintf(self::USER_STATS, $user_id);
    }
    
    public static function tripsSearch($query_hash) {
        return sprintf(self::TRIPS_SEARCH, $query_hash);
    }
    
    public static function userVehicles($user_id) {
        return sprintf(self::USER_VEHICLES, $user_id);
    }
    
    public static function userTrips($user_id) {
        return sprintf(self::USER_TRIPS, $user_id);
    }
}
?>


<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Inclure config.php depuis le dossier api
require_once __DIR__ . '/../api/config.php';

// Créer la connexion
$db = new Database();
$conn = $db->getConnection();

if ($conn) {
    echo "Connexion réussie !";
} else {
    echo "Échec de la connexion.";
}
?>

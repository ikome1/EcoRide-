# Guide d'installation EcoRide avec XAMPP

## 🚀 Installation rapide

### 1. **Installer XAMPP**
- Téléchargez XAMPP depuis https://www.apachefriends.org/
- Installez-le dans `C:\xampp\` (Windows) ou `/Applications/XAMPP/` (Mac)
- Démarrez Apache et MySQL dans le panneau de contrôle XAMPP

### 2. **Configurer la base de données**
```bash
# Ouvrir phpMyAdmin (http://localhost/phpmyadmin)
# Créer une nouvelle base de données "ecoride"
# Importer le fichier database/ecoride.sql
```

### 3. **Placer les fichiers**
```bash
# Copier tout le dossier EcoRide dans :
C:\xampp\htdocs\ecoride\
# Ou
/Applications/XAMPP/htdocs/ecoride/
```

### 4. **Accéder à l'application**
```
http://localhost/ecoride/
```

## 🔧 Configuration de la base de données

### Fichier de configuration
Modifiez `api/config.php` si nécessaire :
```php
private $host = 'localhost';
private $db_name = 'ecoride';
private $username = 'root';
private $password = ''; // Mot de passe MySQL si défini
```

## 🧪 Tests recommandés

### 1. **Test de connexion**
- Aller sur `http://localhost/ecoride/login.html`
- Utiliser les comptes de test :
  - **Utilisateur** : `user` / `user123`
  - **Employés** : `employe1` à `employe5` / `employe123`
  - **Admin** : `admin` / `admin123`

### 2. **Test d'inscription**
- Aller sur `http://localhost/ecoride/register.html`
- Créer un nouveau compte
- Vérifier que 20 crédits sont attribués

### 3. **Test de recherche**
- Aller sur `http://localhost/ecoride/home.html`
- Rechercher : "Paris" + "2025-10-20"
- Vérifier l'affichage des covoiturages

### 4. **Test de participation**
- Se connecter avec un compte utilisateur
- Cliquer sur "Participer" sur un covoiturage
- Vérifier la déduction des crédits

## 📊 Structure de la base de données

### Tables principales :
- `users` - Utilisateurs avec crédits
- `vehicles` - Véhicules des utilisateurs
- `trips` - Voyages créés
- `reservations` - Réservations des passagers
- `transactions` - Historique des crédits
- `platform_stats` - Statistiques de la plateforme

### Données de test incluses :
- Utilisateur de test
- 2 véhicules (1 électrique, 1 essence)
- 2 voyages Paris → Lyon
- 5 comptes employés (employe1 à employe5)
- 1 compte administrateur

## 🐛 Résolution des problèmes

### Erreur de connexion à la base
```bash
# Vérifier que MySQL est démarré dans XAMPP
# Vérifier les paramètres dans api/config.php
# Vérifier que la base "ecoride" existe
```

### Erreur 500 (serveur)
```bash
# Vérifier les logs Apache dans XAMPP
# Vérifier les permissions des fichiers
# Vérifier la syntaxe PHP
```

### Erreur CORS
```bash
# Les en-têtes CORS sont déjà configurés dans config.php
# Vérifier que les requêtes sont bien en POST/GET
```

## 🔒 Sécurité

### Mots de passe
- Les mots de passe sont hashés avec `password_hash()`
- Validation côté client ET serveur
- Sessions sécurisées

### Protection SQL
- Requêtes préparées (PDO)
- Échappement des données
- Validation des entrées

## 📈 Fonctionnalités implémentées

### ✅ Authentification complète
- Inscription avec validation
- Connexion multi-rôles
- Sessions sécurisées
- Déconnexion

### ✅ Gestion des covoiturages
- Recherche par ville + date
- Participation avec vérifications
- Gestion des crédits automatique
- Historique des voyages

### ✅ Système de crédits
- 20 crédits à l'inscription
- Déduction automatique
- Gains pour les chauffeurs
- 2 crédits pour la plateforme

### ✅ Interface utilisateur
- Design responsive
- Messages d'erreur/succès
- Navigation intuitive
- Compatible mobile

## 🚀 Prochaines étapes

Pour compléter le projet, il reste à implémenter :
- Espace employé (validation des avis)
- Espace administrateur (statistiques)
- Gestion démarrage/arrêt des voyages
- Système d'avis et de notes

## 📞 Support

En cas de problème :
1. Vérifier les logs XAMPP
2. Tester la connexion à la base
3. Vérifier les permissions des fichiers
4. Consulter la console du navigateur (F12)

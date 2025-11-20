# Guide d'installation EcoRide

## 👨‍🏫 Pour le professeur / Correcteur ou par n'import qui

Salut ! 👋 c'est un guide complet que j'ai crée pour vous faciliter la tache mais pour les gens qui voudront du projet debutant ou expert

**Docker n'est pas obligatoire !** Le projet fonctionne très bien avec deux méthodes différentes :

### Option 1 : Docker (le plus rapide)
Si vous avez Docker installé sur votre PC, c'est la méthode la plus simple :
```bash
docker-compose up -d
```
Ensuite, ouvrez votre navigateur sur `http://localhost:8080` et c'est bon !

**Avantages** : Tout est automatique, la base de données se crée toute seule, pas besoin de configurer quoi que ce soit.

### Option 2 : XAMPP (l'alternative classique)
Si vous préférez XAMPP ou si vous l'avez déjà installé, ça marche aussi très bien. Il faut juste :
1. Installer XAMPP (avec PHP 8.1 minimum)
2. Créer la base de données manuellement
3. Importer le fichier SQL

**Les deux méthodes fonctionnent parfaitement.** Choisissez celle que vous préférez ! 😊

---

## 📋 Ce qu'il faut avoir sur son PC

### Versions nécessaires

Pour faire tourner le projet, il vous faut :
- **PHP** : version 8.1 ou plus récente (8.2, 8.3, ça marche aussi) moi j'utilise PHP 8.1
- **MySQL** : version 5.7 minimum, mais 8.0 c'est mieux
- **MongoDB** : version 7.0 ou plus (OBLIGATOIRE pour le NoSQL)
- **Apache** : version 2.4 ou plus récente
- **Redis** : version 6.0 ou plus (optionnel, mais ça améliore les performances)

### Extensions PHP à avoir

Le projet utilise ces extensions PHP :
- `pdo` et `pdo_mysql` - Pour parler à MySQL (base de données SQL)
- `mongodb` - Pour parler à MongoDB (base de données NoSQL - OBLIGATOIRE)
- `json` - Pour gérer les données JSON (généralement déjà là)
- `mbstring` - Pour les caractères spéciaux
- `openssl` - Pour la sécurité
- `redis` - Pour le cache (optionnel, mais sympa à avoir)

### Comment vérifier ce que vous avez ?

Ouvrez un terminal et tapez :
```bash
# Voir votre version de PHP
php -v

# Voir toutes les extensions installées
php -m

# Voir votre version de MySQL
mysql --version

# Voir si Redis est là (optionnel)
redis-cli --version
```

Si vous utilisez XAMPP, vous pouvez aussi créer un fichier `phpinfo.php` dans `htdocs/` avec juste `<?php phpinfo(); ?>` dedans, puis ouvrir `http://localhost/phpinfo.php` dans votre navigateur pour voir tout ce qui est installé.

---

## 🚀 Installation avec XAMPP

### Étape 1 : Installer XAMPP

1. Téléchargez XAMPP depuis https://www.apachefriends.org/
2. **Important** : Prenez une version qui a PHP 8.1 ou plus récent
   - Pour Windows : Version avec PHP 8.1+
   - Pour Mac : Version avec PHP 8.1+
   - Pour Linux : Version avec PHP 8.1+
3. Installez-le (par défaut dans `C:\xampp\` sur Windows ou `/Applications/XAMPP/` sur Mac)
4. Démarrez Apache et MySQL dans le panneau de contrôle XAMPP
5. Pour vérifier que PHP 8.1+ est bien là, ouvrez un terminal et tapez `php -v`

### Étape 2 : Créer la base de données

1. Ouvrez phpMyAdmin : `http://localhost/phpmyadmin`
2. Créez une nouvelle base de données appelée `ecoride`
3. Importez le fichier `database/ecoride.sql` qui est dans le projet

### Étape 3 : Mettre les fichiers au bon endroit

Copiez tout le dossier du projet dans :
- Windows : `C:\xampp\htdocs\ecoride\`
- Mac : `/Applications/XAMPP/htdocs/ecoride/`

### Étape 4 : C'est parti !

Ouvrez votre navigateur et allez sur :
```
http://localhost/ecoride/
```

---

## 🐳 Installation avec Docker

### Étape 1 : Installer Docker

Si vous n'avez pas Docker, téléchargez Docker Desktop depuis https://www.docker.com/products/docker-desktop

Une fois installé, vérifiez que ça marche :
```bash
docker --version
docker-compose --version
```

### Étape 2 : Lancer le projet

Ouvrez un terminal dans le dossier du projet et tapez :
```bash
docker-compose up -d
```

Attendez environ 30 secondes que tout démarre (la première fois, ça peut prendre un peu plus de temps car Docker télécharge les images).

### Étape 3 : C'est prêt !

Ouvrez votre navigateur sur :
```
http://localhost:8080
```

**C'est tout !** La base de données se crée toute seule, le schéma SQL est importé automatiquement, et les comptes de test sont déjà là.

### Commandes utiles pour Docker

```bash
# Voir si tout tourne bien
docker-compose ps

# Voir les logs (pour débugger si besoin)
docker-compose logs -f

# Arrêter l'application
docker-compose down

# Tout réinitialiser (base de données incluse)
docker-compose down -v
```

---

## 🔧 Configuration de la base de données

### Si vous utilisez XAMPP

Modifiez le fichier `api/config.php` si besoin :
```php
private $host = 'localhost';
private $db_name = 'ecoride';
private $username = 'root';
private $password = ''; // Mettez votre mot de passe MySQL si vous en avez un
```

### Infos sur MySQL

- **Version** : MySQL 5.7 minimum, mais 8.0 c'est mieux
- **Charset** : utf8mb4 (déjà configuré dans le fichier SQL)
- **Port** : 3306 par défaut

### Redis (optionnel mais recommandé)

Redis permet de mettre en cache les requêtes fréquentes, ce qui rend l'application plus rapide.

#### Sur Windows (avec XAMPP)
C'est un peu plus compliqué sur Windows. Vous pouvez :
- Télécharger Redis pour Windows depuis https://github.com/microsoftarchive/redis/releases
- Ou utiliser WSL (Windows Subsystem for Linux)

#### Sur Mac
```bash
# Installer avec Homebrew
brew install redis

# Démarrer Redis
brew services start redis
```

#### Sur Linux
```bash
# Installer Redis
sudo apt-get update
sudo apt-get install redis-server

# Démarrer Redis
sudo systemctl start redis-server
sudo systemctl enable redis-server
```

#### Vérifier que Redis fonctionne
```bash
redis-cli ping
```
Si ça répond "PONG", c'est bon ! 👍

#### Installer l'extension PHP Redis
```bash
pecl install redis
```

Puis ajoutez `extension=redis.so` dans votre fichier `php.ini`.

**Note importante** : Si Redis n'est pas installé, l'application fonctionne quand même ! Elle sera juste un peu moins rapide sur certaines pages.

---

## 🧪 Tester que tout fonctionne

### Test 1 : Se connecter
1. Allez sur `http://localhost/ecoride/login.html` (ou `http://localhost:8080/login.html` avec Docker)
2. Utilisez un des comptes de test :
   - **Utilisateur** : `user` / `user123`
   - **Admin** : `admin` / `admin123`
   - **Employés** : `employe1` à `employe5` / `employe123`

### Test 2 : Créer un compte
1. Allez sur la page d'inscription
2. Créez un nouveau compte
3. Vérifiez que vous avez bien 20 crédits au départ

### Test 3 : Chercher un covoiturage
1. Sur la page d'accueil, cherchez "Paris" avec la date "2025-10-20"
2. Vous devriez voir des covoiturages s'afficher

### Test 4 : Réserver un trajet
1. Connectez-vous avec un compte utilisateur
2. Cliquez sur "Participer" sur un covoiturage
3. Vérifiez que vos crédits sont bien déduits

---

## 🐛 Si ça ne marche pas...

### Erreur : "Version PHP trop ancienne"
Votre PHP est peut-être trop vieux. Vérifiez avec `php -v`. Il faut PHP 8.1 minimum.

**Solution** : Mettez à jour XAMPP ou installez une version plus récente de PHP.

### Erreur : "Extension PHP manquante"
Il manque peut-être une extension. Vérifiez avec `php -m | grep pdo_mysql`.

**Solution** : 
1. Ouvrez le fichier `php.ini` de XAMPP (généralement dans `C:\xampp\php\php.ini`)
2. Cherchez la ligne avec `extension=pdo_mysql` et enlevez le `;` devant
3. Redémarrez Apache

### Erreur : "Impossible de se connecter à la base de données"
Plusieurs choses à vérifier :
- MySQL est bien démarré dans XAMPP ?
- Les paramètres dans `api/config.php` sont corrects ?
- La base de données `ecoride` existe bien ?
- Votre version de MySQL est compatible ?

### Erreur 500 (erreur serveur)
Regardez les logs Apache dans XAMPP pour voir ce qui ne va pas. Ça peut être :
- Un problème de permissions sur les fichiers
- Une erreur de syntaxe PHP
- Une extension manquante

### Erreur CORS
Normalement, les en-têtes CORS sont déjà configurés dans `config.php`. Si vous avez une erreur :
- Vérifiez la console du navigateur (F12)
- Vérifiez que les requêtes sont bien en POST ou GET

### Erreur Redis (si vous l'avez installé)
Vérifiez que Redis tourne bien :
```bash
redis-cli ping
```

Si ça ne répond pas "PONG", Redis n'est pas démarré. Démarrez-le et réessayez.

---

## 📊 Structure de la base de données

Le projet utilise plusieurs tables :
- `users` - Les utilisateurs avec leurs crédits
- `vehicles` - Les véhicules des utilisateurs
- `trips` - Les voyages créés
- `reservations` - Les réservations des passagers
- `transactions` - L'historique des crédits
- `platform_stats` - Les statistiques de la plateforme
- `reviews` - Les avis laissés par les utilisateurs

Des données de test sont déjà incluses dans le fichier SQL :
- Un utilisateur de test
- 2 véhicules (un électrique, un essence)
- 2 voyages Paris → Lyon
- 5 comptes employés
- 1 compte administrateur

---

## 🔒 Sécurité

### Mots de passe
Les mots de passe sont hashés avec `password_hash()` de PHP, donc même si quelqu'un accède à la base de données, il ne peut pas voir les mots de passe en clair.

### Protection SQL
Toutes les requêtes utilisent des requêtes préparées (PDO), ce qui empêche les injections SQL.

### Validation
Les données sont validées à la fois côté client (JavaScript) et côté serveur (PHP).

---

## 📈 Ce qui est implémenté

### ✅ Authentification
- Inscription avec validation
- Connexion pour différents rôles (utilisateur, employé, admin)
- Sessions sécurisées
- Déconnexion

### ✅ Gestion des covoiturages
- Recherche par ville et date
- Réservation avec vérifications
- Gestion automatique des crédits
- Historique des voyages

### ✅ Système de crédits
- 20 crédits offerts à l'inscription
- Déduction automatique lors d'une réservation
- Gains pour les chauffeurs
- 2 crédits pour la plateforme par réservation

### ✅ Interface
- Design responsive (ça marche sur mobile)
- Messages d'erreur et de succès
- Navigation intuitive
- Compatible avec tous les navigateurs modernes

---

## 📊 Infos techniques

### Versions testées et qui fonctionnent
- ✅ PHP 8.1.0 - Fonctionne parfaitement
- ✅ PHP 8.2.0 - Fonctionne parfaitement
- ✅ MySQL 8.0 - Fonctionne parfaitement
- ✅ MySQL 5.7 - Fonctionne aussi
- ✅ Redis 7.0 - Fonctionne (optionnel)

### Configuration Apache recommandée
Activez `mod_rewrite` et mettez `AllowOverride All` dans votre configuration Apache.

### Configuration PHP recommandée
Dans votre `php.ini`, vous pouvez mettre :
```ini
memory_limit = 256M
upload_max_filesize = 10M
post_max_size = 10M
max_execution_time = 300
date.timezone = Europe/Paris
```

### Ports utilisés
- **Apache** : Port 80 (HTTP) ou 443 (HTTPS)
- **MySQL** : Port 3306
- **Redis** : Port 6379 (si installé)
- **Docker** : Port 8080 pour le web

---

## 📞 Besoin d'aide ?

Si vous avez un problème :
1. Vérifiez d'abord les versions installées (PHP, MySQL)
2. Vérifiez que toutes les extensions PHP sont bien là
3. Regardez les logs (XAMPP ou Docker)
4. Testez la connexion à la base de données
5. Vérifiez les permissions des fichiers
6. Ouvrez la console du navigateur (F12) pour voir les erreurs JavaScript

Bon courage ! 🚀

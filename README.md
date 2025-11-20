# 🌿 EcoRide - Application de Covoiturage

Application web de covoiturage écologique.

## 🚀 Démarrage Rapide en Local

### Option 1 : Docker (Le plus simple)

```bash
# 1. Cloner ou télécharger le projet
cd EcoRide--main

# 2. Lancer Docker
docker-compose up -d

# 3. Attendre 30 secondes que tout démarre

# 4. Ouvrir dans le navigateur
http://localhost:8080
```

**C'est tout !** La base de données se crée automatiquement.

### Option 2 : XAMPP

```bash
# 1. Installer XAMPP avec PHP 8.1+
# Télécharger depuis https://www.apachefriends.org/

# 2. Démarrer Apache et MySQL dans XAMPP

# 3. Créer la base de données
# Ouvrir http://localhost/phpmyadmin
# Créer une base "ecoride"
# Importer database/ecoride.sql

# 4. Copier les fichiers dans
# Windows : C:\xampp\htdocs\ecoride\
# Mac : /Applications/XAMPP/htdocs/ecoride/

# 5. Ouvrir dans le navigateur
http://localhost/ecoride/
```

**Voir [INSTALLATION.md](INSTALLATION.md) pour plus de détails.**

---

## 🧪 Tester l'Application

### Comptes de Test

- **Utilisateur** : `user` / `user123`
- **Admin** : `admin` / `admin123`
- **Employés** : `employe1` à `employe5` / `employe123`

Voir [COMPTES_TEST.md](COMPTES_TEST.md) pour tous les comptes.

### Tests à Effectuer

1. **Connexion** : Se connecter avec un compte de test
2. **Inscription** : Créer un nouveau compte (20 crédits offerts)
3. **Recherche** : Chercher un covoiturage (ex: "Paris" + date)
4. **Réservation** : Réserver un trajet (crédits déduits)
5. **Dashboard** : Voir ses voyages et statistiques

---

## 📁 Structure du Projet

```
EcoRide--main/
├── api/                    # API PHP
│   ├── auth.php           # Authentification
│   ├── trips.php           # Covoiturages
│   ├── reviews.php         # Avis
│   ├── stats.php           # Statistiques
│   ├── cache.php           # Cache Redis
│   ├── mongodb.php         # MongoDB (NoSQL)
│   └── notifications.php   # Notifications
├── css/                    # Styles
├── js/                     # Scripts JavaScript
├── database/               # Base de données
│   └── ecoride.sql         # Schéma SQL
├── data/                   # Données JSON
├── images/                 # Images
├── *.html                  # Pages HTML
├── docker-compose.yml      # Configuration Docker
├── Dockerfile              # Image Docker
└── Documentation/          # Documentation
```

---

## 🛠️ Technologies Utilisées

### Front-end
- HTML5, CSS3, JavaScript (ES6+)
- Tailwind CSS (framework CSS)
- Chart.js (graphiques)

### Back-end
- **PHP 8.1+** (API REST)
- **MySQL 8.0** (base de données relationnelle - SQL)
- **MongoDB 7.0** (base de données NoSQL - OBLIGATOIRE)
- **Redis** (cache optionnel)

### Outils
- Docker & Docker Compose
- Git

---

## 📝 API Endpoints

### Authentification
- `POST api/auth.php?action=register` - Inscription
- `POST api/auth.php?action=login` - Connexion
- `POST api/auth.php?action=logout` - Déconnexion
- `GET api/auth.php?action=check-session` - Vérifier session

### Covoiturages
- `POST api/trips.php?action=search` - Rechercher
- `POST api/trips.php?action=create-trip` - Créer voyage
- `POST api/trips.php?action=participate` - Réserver
- `GET api/trips.php?action=trips` - Historique

### Avis
- `POST api/reviews.php?action=create` - Créer avis
- `GET api/reviews.php?action=pending` - Avis en attente
- `POST api/reviews.php?action=moderate` - Modérer

### Statistiques
- `GET api/stats.php?action=user` - Stats utilisateur
- `GET api/stats.php?action=platform` - Stats plateforme

### Notifications (MongoDB)
- `GET api/notifications.php?action=list` - Liste notifications
- `POST api/notifications.php?action=read` - Marquer comme lue

---

## 🗄️ Bases de Données

### MySQL (Relationnelle)
- Tables : users, vehicles, trips, reservations, reviews, transactions
- Schéma : `database/ecoride.sql`

### MongoDB (NoSQL - OBLIGATOIRE)
- Collections : `activity_logs`, `sessions`, `notifications`, `search_queries`
- Utilisé pour : 
  - Logs d'activité utilisateur
  - Sessions utilisateur
  - Notifications en temps réel
  - Statistiques de recherche
- **Fichier** : `api/mongodb.php`

### Redis (Cache)
- Cache des requêtes fréquentes
- Améliore les performances

---

## 📚 Documentation

- **[INSTALLATION.md](INSTALLATION.md)** - Guide d'installation
- **[COMPTES_TEST.md](COMPTES_TEST.md)** - Comptes de test

---

## ⚙️ Configuration

### Fichier de Configuration
Modifier `api/config.php` si nécessaire :
```php
private $host = 'localhost';
private $db_name = 'ecoride';
private $username = 'root';
private $password = '';
```

### MongoDB
Par défaut : `mongodb://localhost:27017`
Base de données : `ecoride`

### Redis
Par défaut : `127.0.0.1:6379`

---

## 🐛 Problèmes Courants

### Erreur de connexion à la base
- Vérifier que MySQL est démarré
- Vérifier les paramètres dans `api/config.php`

### MongoDB non disponible
- L'application fonctionne sans MongoDB
- Installer MongoDB : `docker-compose up -d` (inclus dans Docker)
- Ou installer manuellement MongoDB

### Redis non disponible
- L'application fonctionne sans Redis
- Le cache sera désactivé automatiquement

---

## ✅ Fonctionnalités

- ✅ Authentification multi-rôles
- ✅ Gestion des covoiturages
- ✅ Système de crédits
- ✅ Recherche et réservation
- ✅ Avis et notes
- ✅ Statistiques
- ✅ Notifications (MongoDB)
- ✅ Cache Redis
- ✅ Logs d'activité (MongoDB)

---

**Bon développement ! 🚀**

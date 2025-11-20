# 🚀 Comment Lancer le Site EcoRide

## Option 1 : Docker (Le plus rapide - 5 minutes)

### Installation Docker Desktop

1. **Télécharger Docker Desktop pour Mac** :
   - Aller sur : https://www.docker.com/products/docker-desktop/
   - Cliquer sur "Download for Mac"
   - Choisir la version pour votre Mac (Intel ou Apple Silicon)

2. **Installer Docker Desktop** :
   - Ouvrir le fichier `.dmg` téléchargé
   - Glisser Docker dans Applications
   - Lancer Docker Desktop
   - Attendre que Docker démarre (icône dans la barre de menu)

3. **Lancer le site** :
   ```bash
   cd /Users/idrissakome/Downloads/EcoRide--main
   docker compose up -d
   ```

4. **Accéder au site** :
   ```
   http://localhost:8080
   ```

**C'est tout !** Tout est automatique avec Docker.

---

## Option 2 : XAMPP (Alternative)

### Installation XAMPP

1. **Télécharger XAMPP** :
   - Aller sur : https://www.apachefriends.org/
   - Télécharger XAMPP pour Mac (version avec PHP 8.1+)

2. **Installer XAMPP** :
   - Ouvrir le fichier `.dmg`
   - Glisser XAMPP dans Applications
   - Lancer XAMPP
   - Démarrer Apache et MySQL dans le panneau de contrôle

3. **Configurer le projet** :
   ```bash
   # Copier les fichiers
   cp -r /Users/idrissakome/Downloads/EcoRide--main /Applications/XAMPP/htdocs/ecoride
   ```

4. **Créer la base de données** :
   - Ouvrir http://localhost/phpmyadmin
   - Créer une base "ecoride"
   - Importer `database/ecoride.sql`

5. **Accéder au site** :
   ```
   http://localhost/ecoride/
   ```

---

## Option 3 : Serveur PHP intégré (Temporaire - pour tester)

Si vous avez PHP installé ailleurs :

```bash
cd /Users/idrissakome/Downloads/EcoRide--main
php -S localhost:8000
```

Puis ouvrir : `http://localhost:8000`

**Note** : Cette méthode ne fonctionne que si PHP est installé et ne gère pas MySQL/MongoDB automatiquement.

---

## ⚡ Solution la plus rapide

**Installer Docker Desktop** (1 clic) puis :

```bash
cd /Users/idrissakome/Downloads/EcoRide--main
docker compose up -d
```

Attendre 30 secondes, puis ouvrir `http://localhost:8080`

---

## 🆘 Besoin d'aide ?

Si vous avez des problèmes :
1. Vérifier que Docker/XAMPP est bien démarré
2. Voir les logs : `docker compose logs` (avec Docker)
3. Consulter [INSTALLATION.md](INSTALLATION.md) pour plus de détails


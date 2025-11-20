# 🚀 Envoyer le Projet sur GitHub

## Étape 1 : Créer un dépôt sur GitHub

1. **Aller sur GitHub** : https://github.com
2. **Se connecter** à votre compte (ou créer un compte)
3. **Créer un nouveau dépôt** :
   - Cliquez sur le bouton "+" en haut à droite
   - Sélectionnez "New repository"
   - Nom du dépôt : `EcoRide` (ou le nom que vous voulez)
   - Description : "Application web de covoiturage écologique"
   - Choisir **Public** ou **Private**
   - **NE PAS** cocher "Initialize with README" (on a déjà un README)
   - Cliquez sur "Create repository"

## Étape 2 : Lier le projet local à GitHub

Une fois le dépôt créé, GitHub vous donnera des commandes. Utilisez celles-ci :

```bash
cd /Users/idrissakome/Downloads/EcoRide--main

# Remplacer VOTRE_USERNAME par votre nom d'utilisateur GitHub
git remote add origin https://github.com/VOTRE_USERNAME/EcoRide.git

# Pousser le code
git push -u origin main
```

## Étape 3 : Commandes complètes

Si vous préférez, voici toutes les commandes en une fois :

```bash
cd /Users/idrissakome/Downloads/EcoRide--main

# Vérifier l'état
git status

# Ajouter tous les fichiers
git add .

# Faire un commit
git commit -m "Application EcoRide complète"

# Ajouter le remote (remplacer VOTRE_USERNAME)
git remote add origin https://github.com/VOTRE_USERNAME/EcoRide.git

# Pousser sur GitHub
git push -u origin main
```

## 🔐 Authentification GitHub

Si GitHub vous demande de vous authentifier :
- Utilisez un **Personal Access Token** (pas votre mot de passe)
- Créer un token : GitHub → Settings → Developer settings → Personal access tokens → Generate new token
- Donnez les permissions : `repo` (accès complet aux dépôts)

---

**Une fois le dépôt créé sur GitHub, dites-moi votre nom d'utilisateur GitHub et je ferai le push pour vous !**


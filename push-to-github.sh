#!/bin/bash
# Script pour pousser le projet sur GitHub

echo "🚀 Envoi du projet EcoRide sur GitHub"
echo ""

# Demander le nom d'utilisateur GitHub
read -p "Entrez votre nom d'utilisateur GitHub: " GITHUB_USERNAME

if [ -z "$GITHUB_USERNAME" ]; then
    echo "❌ Nom d'utilisateur requis"
    exit 1
fi

# Demander le nom du dépôt
read -p "Nom du dépôt (par défaut: EcoRide): " REPO_NAME
REPO_NAME=${REPO_NAME:-EcoRide}

echo ""
echo "📋 Configuration :"
echo "   Utilisateur: $GITHUB_USERNAME"
echo "   Dépôt: $REPO_NAME"
echo ""

# Vérifier si le remote existe déjà
if git remote get-url origin &> /dev/null; then
    echo "⚠️  Un remote 'origin' existe déjà"
    read -p "Voulez-vous le remplacer ? (o/n): " REPLACE
    if [ "$REPLACE" = "o" ] || [ "$REPLACE" = "O" ]; then
        git remote remove origin
    else
        echo "Annulé"
        exit 0
    fi
fi

# Ajouter le remote
echo "🔗 Ajout du remote GitHub..."
git remote add origin https://github.com/$GITHUB_USERNAME/$REPO_NAME.git

# Pousser le code
echo "📤 Envoi du code sur GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Projet envoyé avec succès !"
    echo "🌐 Votre projet est disponible sur :"
    echo "   https://github.com/$GITHUB_USERNAME/$REPO_NAME"
else
    echo ""
    echo "❌ Erreur lors de l'envoi"
    echo ""
    echo "Vérifiez que :"
    echo "1. Le dépôt existe sur GitHub"
    echo "2. Vous êtes authentifié (token GitHub)"
    echo "3. Le nom du dépôt est correct"
fi


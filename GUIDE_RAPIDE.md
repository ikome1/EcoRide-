# Guide Rapide EcoRide

## 🚀 Démarrage rapide

### 1. Accéder à l'application
Ouvrez `home.html` dans votre navigateur ou via :
```
http://localhost/EcoRide/home.html
```

### 2. Se connecter

#### Compte Utilisateur
- **Pseudo** : `user`
- **Mot de passe** : `user123`
- **Accès** : Dashboard utilisateur pour gérer ses voyages

#### Comptes Employés (5 disponibles)
- **Pseudo** : `employe1`, `employe2`, `employe3`, `employe4`, `employe5`
- **Mot de passe** : `employe123` (pour tous)
- **Accès** : Espace employé pour valider les avis

#### Compte Administrateur
- **Pseudo** : `admin`
- **Mot de passe** : `admin123`
- **Accès** : Espace administrateur pour gérer la plateforme

## 📋 Fonctionnalités principales

### Pour les Utilisateurs (US 11)
✅ Démarrer et arrêter un covoiturage
✅ Soumettre des avis et des notes
✅ Signaler des problèmes

### Pour les Employés (US 12)
✅ Valider ou refuser les avis
✅ Gérer les covoiturages problématiques
✅ Contacter les chauffeurs en cas de problème

### Pour les Administrateurs (US 13)
✅ Créer des comptes employés
✅ Suspendre/réactiver les comptes utilisateurs
✅ Visualiser les statistiques de la plateforme
✅ Voir les graphiques de covoiturages

## 🔄 Flux de travail

### 1. Covoiturage complet
1. Utilisateur crée un voyage (dashboard)
2. Utilisateur démarre le covoiturage
3. Participants font le trajet
4. Chauffeur arrête le covoiturage
5. Participants soumettent des avis
6. Employé valide les avis

### 2. Gestion des problèmes
1. Participant signale un problème
2. Employé voit le problème dans l'espace employé
3. Employé contacte le chauffeur
4. Employé marque le problème comme résolu

### 3. Administration
1. Admin crée des comptes employés
2. Admin surveille les statistiques
3. Admin suspend des comptes si nécessaire

## 🎯 Tests recommandés

### Test 1 : Connexion et redirection
1. Aller sur `login.html`
2. Se connecter avec `employe1` / `employe123`
3. Vérifier la redirection vers `employee-dashboard.html`

### Test 2 : Création d'employé
1. Se connecter en tant qu'admin (`admin` / `admin123`)
2. Aller dans "Gestion Employés"
3. Créer un nouvel employé
4. Se déconnecter et se reconnecter avec le nouvel employé

### Test 3 : Validation d'avis
1. (Simuler la soumission d'un avis via la console)
2. Se connecter en tant qu'employé
3. Voir l'avis en attente
4. Valider ou refuser l'avis

## 🔍 Données de test

### Créer un avis de test
Ouvrez la console du navigateur (F12) et exécutez :
```javascript
const reviews = [
  {
    id: 1,
    tripId: 123,
    passager: 'Marie Dupont',
    conducteur: 'Jean Martin',
    commentaire: 'Excellent conducteur, très ponctuel et sympathique !',
    note: 5,
    date: new Date().toISOString(),
    statut: 'en attente'
  }
];
localStorage.setItem('ecoride_reviews', JSON.stringify(reviews));
```

### Créer un problème de test
Ouvrez la console du navigateur (F12) et exécutez :
```javascript
const problems = [
  {
    id: 1,
    tripId: 456,
    conducteurPseudo: 'Pierre Martin',
    conducteurEmail: 'pierre@example.com',
    passagerPseudo: 'Sophie Dupont',
    passagerEmail: 'sophie@example.com',
    trajet: 'Paris → Lyon',
    date: new Date().toISOString(),
    commentaire: 'Le conducteur n\'est pas venu au point de rendez-vous.',
    resolu: false
  }
];
localStorage.setItem('ecoride_problems', JSON.stringify(problems));
```

## ⚠️ Notes importantes

- Les données sont stockées dans le **localStorage** du navigateur
- Si vous videz le cache, vous perdrez toutes les données
- Pour persister les données, utilisez une vraie base de données

## 📞 Support

Pour toute question, consultez :
- `INSTALLATION.md` pour l'installation
- `IMPLEMENTATION_US11_US12_US13.md` pour les détails techniques
- `COMPTES_TEST.md` pour la liste des comptes

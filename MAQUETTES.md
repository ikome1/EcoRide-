# Maquettes et Wireframes - EcoRide

## 📐 Processus de Maquettage

Ce document présente le processus de maquettage des interfaces utilisateur pour l'application EcoRide. J'ai d'abord créé des wireframes (schémas basse fidélité) pour chaque page, puis développé les maquettes haute fidélité avant de coder.

---

## 🎨 Outils Utilisés

- **Wireframes** : Schémas ASCII et croquis papier
- **Maquettes** : HTML/CSS avec Tailwind CSS
- **Prototypes** : Pages HTML interactives

---

## 📱 Wireframes Basse Fidélité

### 1. Page d'Accueil (Home)

```
┌─────────────────────────────────────────┐
│  [Logo]  Accueil | Covoiturages | Contact │
├─────────────────────────────────────────┤
│                                         │
│         ECO RIDE 🌿                     │
│    Le covoiturage écologique            │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  Rechercher un covoiturage      │   │
│  │  [Départ____] [Destination____] │   │
│  │  [Date______] [Rechercher]      │   │
│  └─────────────────────────────────┘   │
│                                         │
│  ┌──────┐  ┌──────┐  ┌──────┐         │
│  │ Card │  │ Card │  │ Card │         │
│  │ Trip │  │ Trip │  │ Trip │         │
│  └──────┘  └──────┘  └──────┘         │
│                                         │
│  Avis clients                           │
│  ┌──────┐  ┌──────┐  ┌──────┐         │
│  │ ⭐⭐⭐⭐⭐│  │ ⭐⭐⭐⭐│  │ ⭐⭐⭐⭐⭐│         │
│  │ Review│  │ Review│  │ Review│         │
│  └──────┘  └──────┘  └──────┘         │
│                                         │
│  Footer                                 │
└─────────────────────────────────────────┘
```

**Éléments clés :**
- Header avec navigation
- Hero section avec formulaire de recherche
- Grille de covoiturages disponibles
- Section avis clients
- Footer simplifié

---

### 2. Page de Connexion (Login)

```
┌─────────────────────────────────────────┐
│  [Logo]                                  │
├─────────────────────────────────────────┤
│                                         │
│         Connexion                       │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  Pseudo: [____________]         │   │
│  │  Mot de passe: [____]          │   │
│  │  [ ] Se souvenir de moi        │   │
│  │  [Se connecter]                 │   │
│  │  Pas de compte? [S'inscrire]   │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

**Éléments :**
- Formulaire centré
- Validation en temps réel
- Lien vers inscription

---

### 3. Dashboard Utilisateur

```
┌─────────────────────────────────────────┐
│  [Logo]  [Mon Espace] [Déconnexion]     │
├─────────────────────────────────────────┤
│  Bonjour, [Nom]      Crédits: [20]      │
├─────────────────────────────────────────┤
│  [Profil] [Véhicules] [Voyages] [Stats] │
├─────────────────────────────────────────┤
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  Contenu de l'onglet sélectionné │   │
│  │                                 │   │
│  │  - Liste des éléments           │   │
│  │  - Formulaires                  │   │
│  │  - Graphiques                   │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

**Onglets :**
1. **Profil** : Informations personnelles, préférences
2. **Véhicules** : Liste des véhicules, ajout/suppression
3. **Voyages** : Historique chauffeur/passager
4. **Créer** : Formulaire de création de voyage
5. **Rechercher** : Recherche de covoiturages
6. **Statistiques** : Graphiques et métriques

---

### 4. Page de Recherche de Covoiturages

```
┌─────────────────────────────────────────┐
│  [Logo]  Navigation                     │
├─────────────────────────────────────────┤
│  Rechercher un covoiturage              │
│  ┌─────────────────────────────────┐   │
│  │  [Départ] [Destination] [Date]   │   │
│  │  [Rechercher] [Reset]            │   │
│  └─────────────────────────────────┘   │
├─────────────────────────────────────────┤
│  Résultats (X trouvés)                  │
│                                         │
│  ┌─────────────────────────────────┐   │
│  │  [Photo] Nom Conducteur ⭐⭐⭐⭐  │   │
│  │  Paris → Lyon                   │   │
│  │  Date: 20/10/2025 09:00         │   │
│  │  Prix: 15 crédits               │   │
│  │  [Réserver] [Détails]           │   │
│  └─────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

---

### 5. Version Mobile (Responsive)

```
┌──────────────┐
│ [☰] [Logo]   │
├──────────────┤
│              │
│  ECO RIDE    │
│              │
│  [Recherche] │
│              │
│  ┌────────┐  │
│  │ Card 1 │  │
│  └────────┘  │
│  ┌────────┐  │
│  │ Card 2 │  │
│  └────────┘  │
│              │
│  [Menu bas]  │
└──────────────┘
```

**Breakpoints :**
- Mobile : < 768px (1 colonne)
- Tablet : 768px - 1024px (2 colonnes)
- Desktop : > 1024px (3 colonnes)

---

## 🎨 Design System

### Palette de Couleurs

```css
/* Couleurs principales */
--primary: #22c55e;      /* Vert EcoRide */
--secondary: #3b82f6;    /* Bleu */
--accent: #f59e0b;       /* Orange */
--danger: #ef4444;       /* Rouge */

/* Couleurs neutres */
--gray-50: #f9fafb;
--gray-100: #f3f4f6;
--gray-900: #111827;
```

**Choix des couleurs :**
- Vert principal : Représente l'écologie et la nature (thème du projet)
- Bleu : Pour les actions secondaires
- Orange : Pour les actions importantes
- Rouge : Pour les erreurs et suppressions

### Typographie

```css
/* Titres */
h1: 2.5rem, font-bold, text-green-700
h2: 2rem, font-semibold, text-gray-900
h3: 1.5rem, font-semibold

/* Corps */
body: 1rem, font-normal, text-gray-700
small: 0.875rem, text-gray-500
```

**Police :** Système (sans-serif par défaut du navigateur)

### Composants Réutilisables

#### Boutons

```html
<!-- Primaire (actions principales) -->
<button class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">
  Action
</button>

<!-- Secondaire (actions secondaires) -->
<button class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
  Action
</button>

<!-- Danger (suppressions) -->
<button class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">
  Supprimer
</button>
```

#### Cartes

```html
<div class="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
  <!-- Contenu -->
</div>
```

#### Formulaires

```html
<input type="text" 
       class="border border-gray-300 rounded-md px-3 py-2 
              focus:outline-none focus:ring-2 focus:ring-green-600">
```

---

## 📐 Grille et Espacement

### Grille Responsive

- **Desktop** : `grid-cols-3 gap-6`
- **Tablet** : `grid-cols-2 gap-4`
- **Mobile** : `grid-cols-1 gap-4`

### Espacement

- Petit : `0.5rem` (8px) - Espacement entre éléments proches
- Moyen : `1rem` (16px) - Espacement standard
- Grand : `2rem` (32px) - Espacement entre sections

---

## 🔄 Flux Utilisateur

### Parcours d'Inscription

```
Accueil → Inscription → Validation → Dashboard
```

1. Utilisateur arrive sur la page d'accueil
2. Clique sur "Créer un compte"
3. Remplit le formulaire d'inscription
4. Validation côté client et serveur
5. Redirection vers le dashboard avec 20 crédits

### Parcours de Réservation

```
Recherche → Résultats → Détails → Réservation → Confirmation
```

1. Utilisateur cherche un trajet
2. Voit les résultats de recherche
3. Clique sur "Détails" pour plus d'infos
4. Clique sur "Réserver"
5. Confirmation et déduction des crédits

### Parcours Chauffeur

```
Dashboard → Ajouter Véhicule → Créer Voyage → Gérer Réservations
```

1. Utilisateur se connecte
2. Va dans l'onglet "Véhicules"
3. Ajoute un véhicule
4. Crée un voyage avec ce véhicule
5. Gère les réservations reçues

---

## 📱 Responsive Design

### Mobile First

Le design a été pensé "mobile first" :
1. D'abord conçu pour mobile (< 768px)
2. Puis adapté pour tablet (768px - 1024px)
3. Enfin optimisé pour desktop (> 1024px)

### Adaptations par Écran

**Mobile :**
- Navigation en menu hamburger
- Cartes en pleine largeur
- Formulaire empilé verticalement
- Boutons en pleine largeur

**Tablet :**
- Navigation horizontale
- Cartes en 2 colonnes
- Formulaires en 2 colonnes
- Boutons adaptés

**Desktop :**
- Navigation complète
- Cartes en 3 colonnes
- Formulaires en grille
- Espacement optimisé

---

## ✅ Checklist de Maquettage

- [x] Wireframes basse fidélité pour toutes les pages
- [x] Maquettes haute fidélité (pages HTML)
- [x] Design system défini (couleurs, typographie)
- [x] Responsive design (mobile, tablet, desktop)
- [x] Prototypes interactifs (pages HTML fonctionnelles)
- [x] Composants réutilisables identifiés
- [x] Flux utilisateur documentés
- [x] Tests sur différents écrans

---

## 🎯 Principes de Design

1. **Simplicité** : Interface claire et intuitive, pas de surcharge
2. **Cohérence** : Même style sur toutes les pages
3. **Accessibilité** : Contraste suffisant, taille de texte lisible
4. **Performance** : Chargement rapide, animations légères
5. **Responsive** : Fonctionne sur tous les écrans

---

## 📝 Notes de Conception

### Pourquoi ce design ?

- **Vert comme couleur principale** : Thème écologique du projet
- **Cartes avec ombre** : Donne de la profondeur et sépare les éléments
- **Boutons arrondis** : Design moderne et friendly
- **Espacement généreux** : Facilite la lecture et l'utilisation

### Évolutions possibles

- Ajouter des icônes pour améliorer la compréhension
- Animations plus fluides pour les transitions
- Mode sombre (dark mode)
- Personnalisation des couleurs par utilisateur

---

**Date de création** : 2025-01-XX  
**Dernière mise à jour** : 2025-01-XX


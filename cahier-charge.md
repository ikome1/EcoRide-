# Cahier des charges – EcoRide

## 1) Contexte et objectif
EcoRide est une application web de covoiturage visant à faciliter les déplacements partagés et promouvoir une mobilité durable. Le projet sert d’appui pédagogique et illustre une architecture front-end (HTML/CSS/JS + localStorage) adossée à une base PHP/MySQL prête à l’emploi.

## 2) Périmètre fonctionnel (MVP)
- Authentification multi‑rôles: utilisateur, employé, administrateur.
- Gestion du profil utilisateur (type: passager/chauffeur, préférences).
- Gestion des véhicules (création, listing, suppression).
- Création de covoiturages par les chauffeurs.
- Recherche et filtrage des covoiturages (départ, destination, date).
- Réservation d’un trajet avec paiement simulé (carte/PayPal). Aucune donnée réelle de paiement n’est stockée.
- Tableau de bord utilisateur (mes véhicules, mes voyages, statistiques).
- Navbar dynamique en fonction de la session.
- Affichage combiné: trajets de démo + trajets créés par les utilisateurs (triés du plus récent au plus ancien).

## 3) Rôles et droits
- Utilisateur: créer un compte, se connecter, gérer profil/véhicules, créer/chercher/réserver des trajets, consulter l’historique.
- Employé (optionnel pour l’évaluation): modérer/valider des avis et traiter les trajets problématiques.
- Administrateur (optionnel pour l’évaluation): gérer les comptes employés/utilisateurs et consulter les statistiques globales.

## 4) Parcours clés
- Inscription/connexion → redirection automatique vers l’espace adapté au rôle.
- Chauffeur: ajoute un véhicule → crée un covoiturage → apparaît dans « Accès aux covoiturages » → réservations possibles.
- Passager: recherche → réserve → paiement simulé → réservation visible dans « Mon Espace ».

## 5) Spécifications détaillées
- Authentification: validation client, hashage mots de passe (démo) côté front; version serveur avec `api/auth.php` disponible.
- Covoiturage: structure normalisée (conducteur, trajet, détails véhicule, prix, places, date/heure) gérée côté front par `tripManager.js` et synchronisée.
- Réservations: écriture dans localStorage (`ecoride_reservations`) + affichage dans le dashboard.
- Paiement simulé: modal avec choix Carte/PayPal, message informatif « mode démo », aucune donnée bancaire réelle.
- Recherche: filtres cumulables (départ/destination/date) et tri des résultats (plus récents en premier).
- UI: Tailwind CSS, composants responsives, messages d’état (succès/erreur), navbar dynamique via `navbar.js`.

## 6) Données et stockage
- Démo: localStorage (utilisateurs, véhicules, trajets, réservations).
- Serveur (optionnel/extension): PHP/MySQL via `api/auth.php`, `api/trips.php` et schéma `database/ecoride.sql` (tables users, vehicles, trips, reservations, transactions, platform_stats, etc.).

## 7) Exigences non fonctionnelles
- Accessibilité et responsive (mobile/desktop).
- Simplicité d’utilisation et lisibilité.
- Sécurité pédagogique: pas de stockage d’infos de paiement; tokens/sessions côté PHP pour l’extension serveur.
- Performances: filtres et affichage instantanés côté front, tri en mémoire.

## 8) Interfaces/Endpoints (pour l’extension serveur)
- `POST api/auth.php?action=register|login|logout|update-profile`
- `GET api/auth.php?action=check-session`
- `POST api/trips.php?action=add-vehicle|create-trip|participate`
- `GET api/trips.php?action=vehicles|trips`

## 9) Contraintes et hypothèses
- Projet scolaire: paiement simulé uniquement; aucune intégration PSP réelle.
- Démo riche: données de test et comptes prédéfinis (user, 5 employés, admin).
- Compatibilité: navigateur moderne, XAMPP/WAMP possible pour la partie PHP/MySQL.

## 10) Critères d’acceptation
- Un utilisateur connecté voit « Mon Espace/Déconnexion » dans la navbar.
- Un chauffeur peut créer un covoiturage, visible dans « Accès aux covoiturages » (tri récent → ancien).
- Un passager peut réserver un trajet via le modal et voir la réservation dans « Mes Voyages ».
- Les filtres de recherche fonctionnent cumulativement et gardent l’ordre par date.
- Le paiement affiche un message « mode démo » et ne stocke aucune donnée sensible.

## 11) Livrables
- Code source front (HTML/CSS/JS) + scripts utilitaires (`userManager.js`, `tripManager.js`, `navbar.js`, `dashboard.js`).
- API PHP (`api/auth.php`, `api/trips.php`, `api/config.php`).
- Schéma SQL (`database/ecoride.sql`).
- Documentation: `INSTALLATION.md`, `GUIDE_RAPIDE.md`, `COMPTES_TEST.md`, `resumer projet.md`, `cahier-charge.md`.



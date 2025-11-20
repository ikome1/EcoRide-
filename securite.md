# Sécurité – EcoRide

## 3) Mécanismes de sécurité mis en place

- Formulaires (Front-end)
  - Validation HTML5 (required, type, pattern, min/max) et contrôles JS avant envoi.
  - Messages d’erreur explicites, évitent les soumissions partielles/incomplètes.
  - Normalisation et nettoyage de base côté client (trim, formats d’email/date).
  - Aucune donnée de paiement réelle collectée (paiement simulé en modal).
  - Navigation conditionnelle via `navbar.js` pour éviter l’exposition d’actions non autorisées aux invités.

- Composants Front-end
  - Rendu sans injection: interpolations contrôlées, pas d’`innerHTML` non filtré sur des données externes.
  - Stockage local (localStorage) limité à un cadre pédagogique; mise en garde intégrée et séparation claire avec l’API.
  - Découplage des responsabilités (gestion utilisateurs, trajets, navbar) pour limiter l’empreinte de chaque module.
  - Tri/recherches en mémoire, pas d’évaluation de code dynamique.

- Back-end (PHP/MySQL)
  - Connexion PDO en mode exceptions et requêtes préparées (prévention SQLi) via `api/config.php`.
  - Validation des entrées serveur: `validateInput()` (champs requis), `sanitizeInput()` (trim/strip_tags/htmlspecialchars).
  - Mots de passe hashés avec `password_hash()`; vérification avec `password_verify()`.
  - Sessions PHP + jeton de session « signé » (base64 + entropie) avec contrôle d’expiration dans `verifyToken()`.
  - En-têtes CORS contrôlés et réponses JSON typées (`sendResponse`) pour éviter les fuites non souhaitées.
  - Transactions pour opérations critiques (participation/transactions de crédits) afin de garantir la cohérence.

- Durcissement & bonnes pratiques
  - Messages d’erreur back-end sobres (codes HTTP + messages génériques).
  - Séparation des rôles (user/employé/admin) et redirections adaptées côté front.
  - Fichiers SQL fournis pour un schéma cohérent (FK, contraintes) facilitant l’intégrité.
  - Conseils de production documentés: CSP, HTTPS, CSRF token, rotation de secrets, logs centralisés.

## 4) Veille technologique (vulnérabilités)

- Référentiels suivis
  - OWASP Top 10 (web) pour prioriser: injection, contrôle d’accès, XSS, gestion de sessions, désérialisation, etc.
  - Flux CVE/NVD pour surveiller les vulnérabilités PHP, MySQL, et bibliothèques JS.
  - Bulletins de sécurité des écosystèmes (PHP, Tailwind, Chart.js) et notes de versions critiques.

- Points d’attention appliqués au projet
  - Injection SQL: usage systématique des requêtes préparées.
  - XSS: neutralisation via `sanitizeInput` côté serveur et rendu prudent côté front.
  - Authentification/gestion de sessions: hashage sécurisé, token de session avec durée de vie et invalidation.
  - Exposition de données sensibles: pas de stockage d’infos de paiement; delimitation claire des données en localStorage.
  - Contrôle d’accès: vérifications serveur (ex: participation/ajout véhicule) conditionnées par session valide.

- Améliorations recommandées (prod)
  - Ajouter un middleware CSRF, une CSP stricte, SRI pour CDN, et SameSite/HttpOnly/Secure pour cookies.
  - Activer une solution de monitoring (SIEM), alerting des erreurs, et revues régulières de dépendances (Dependabot, `npm audit`, `composer audit`).
  - Mettre en place un durcissement serveur (TLS moderne, headers de sécurité, rotation des clés) et des tests (SAST/DAST).



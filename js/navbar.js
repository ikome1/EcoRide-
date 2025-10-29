// Gestion dynamique de la navbar
function updateNavbar() {
  const navLinks = document.querySelector('.nav-links');
  if (!navLinks) return;
  
  // Vérifier si l'utilisateur est connecté
  const isLoggedIn = userManager.isLoggedIn();
  
  if (isLoggedIn) {
    // Récupérer l'utilisateur connecté
    const currentUser = userManager.getCurrentUser();
    
    // Déterminer le lien vers l'espace selon le rôle
    let espaceLink = 'dashboard.html';
    if (currentUser.role === 'employee') {
      espaceLink = 'employee-dashboard.html';
    } else if (currentUser.role === 'admin') {
      espaceLink = 'admin-dashboard.html';
    }
    
    // Navbar pour utilisateur connecté
    navLinks.innerHTML = `
      <li><a href="home.html">Accueil</a></li>
      <li><a href="covoiurage-disponibles.html">Accès aux covoiturages</a></li>
      <li><a href="contact.html">Contact</a></li>
      <li><a href="${espaceLink}">Mon Espace</a></li>
      <li><a href="#" onclick="logout()">Déconnexion</a></li>
    `;
  } else {
    // Navbar pour visiteur non connecté
    navLinks.innerHTML = `
      <li><a href="home.html">Accueil</a></li>
      <li><a href="covoiurage-disponibles.html">Accès aux covoiturages</a></li>
      <li><a href="contact.html">Contact</a></li>
      <li><a href="login.html">Connexion</a></li>
      <li><a href="register.html">Créer un compte</a></li>
    `;
  }
}

// Fonction de déconnexion
function logout() {
  if (confirm('Voulez-vous vous déconnecter ?')) {
    userManager.logout();
    window.location.href = 'home.html';
  }
}

// Exporter la fonction logout
window.logout = logout;

// Initialiser la navbar au chargement de la page
document.addEventListener('DOMContentLoaded', function() {
  updateNavbar();
});

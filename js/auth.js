// Script d'authentification pour les pages de connexion et inscription - Version API
document.addEventListener('DOMContentLoaded', async function() {
    // Vérifier si l'utilisateur est déjà connecté
    const sessionCheck = await apiClient.checkSession();
    if (sessionCheck.success) {
        redirectToDashboard();
        return;
    }

    // Gestion de la connexion
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Gestion de l'inscription
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
});

async function handleLogin(e) {
    e.preventDefault();
    
    const pseudo = document.getElementById('pseudo').value.trim();
    const password = document.getElementById('password').value;
    
    if (!pseudo || !password) {
        showError('Veuillez remplir tous les champs');
        return;
    }

    try {
        const result = await apiClient.login(pseudo, password);
        
        if (result.success) {
            showSuccess('Connexion réussie ! Redirection...');
            setTimeout(() => {
                redirectToDashboard();
            }, 1500);
        } else {
            showError(result.message || 'Identifiants incorrects');
        }
    } catch (error) {
        showError('Erreur de connexion au serveur');
        console.error('Erreur login:', error);
    }
}

async function handleRegister(e) {
    e.preventDefault();
    
    const pseudo = document.getElementById('pseudo').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validation des champs
    if (!pseudo || !email || !password || !confirmPassword) {
        showError('Veuillez remplir tous les champs');
        return;
    }

    if (password !== confirmPassword) {
        showError('Les mots de passe ne correspondent pas');
        return;
    }

    if (pseudo.length < 3) {
        showError('Le pseudo doit contenir au moins 3 caractères');
        return;
    }

    try {
        const result = await apiClient.register(pseudo, email, password);
        
        if (result.success) {
            showSuccess(`Compte créé avec succès ! Vous avez ${result.user.credits} crédits. Redirection...`);
            
            // Connexion automatique
            await apiClient.login(pseudo, password);
            
            setTimeout(() => {
                redirectToDashboard();
            }, 2000);
        } else {
            showError(result.message || 'Erreur lors de la création du compte');
        }
        
    } catch (error) {
        showError(error.message || 'Erreur de connexion au serveur');
        console.error('Erreur register:', error);
    }
}

function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    const successDiv = document.getElementById('successMessage');
    
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.classList.remove('hidden');
    }
    
    if (successDiv) {
        successDiv.classList.add('hidden');
    }
}

function showSuccess(message) {
    const successDiv = document.getElementById('successMessage');
    const errorDiv = document.getElementById('errorMessage');
    
    if (successDiv) {
        successDiv.textContent = message;
        successDiv.classList.remove('hidden');
    }
    
    if (errorDiv) {
        errorDiv.classList.add('hidden');
    }
}

function redirectToDashboard() {
    apiClient.redirectToDashboard();
}

// Fonction de déconnexion (utilisable partout)
async function logout() {
    try {
        await apiClient.logout();
        window.location.href = 'home.html';
    } catch (error) {
        console.error('Erreur lors de la déconnexion:', error);
        window.location.href = 'home.html';
    }
}

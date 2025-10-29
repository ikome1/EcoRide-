// Script pour le dashboard employé
document.addEventListener('DOMContentLoaded', function() {
    // Vérifier l'authentification
    if (!userManager.isLoggedIn()) {
        window.location.href = 'login.html';
        return;
    }
    
    const user = userManager.getCurrentUser();
    
    // Vérifier que l'utilisateur est employé
    if (user.role !== 'employee') {
        alert('Accès refusé : espace employé uniquement');
        window.location.href = 'home.html';
        return;
    }
    
    console.log('Employé connecté:', user.pseudo);
    
    // Charger les données
    loadReviews();
    loadProblems();
    
    // Afficher l'onglet par défaut
    showTab('avis');
});

function showTab(tabName) {
    // Masquer tous les contenus
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.add('hidden');
    });
    
    // Désactiver tous les onglets
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('border-green-500', 'text-green-600');
        button.classList.add('border-transparent', 'text-gray-500');
    });
    
    // Afficher le contenu sélectionné
    document.getElementById(`content-${tabName}`).classList.remove('hidden');
    
    // Activer l'onglet sélectionné
    const activeTab = document.getElementById(`tab-${tabName}`);
    activeTab.classList.remove('border-transparent', 'text-gray-500');
    activeTab.classList.add('border-green-500', 'text-green-600');
    
    // Recharger les données si nécessaire
    if (tabName === 'avis') {
        loadReviews();
    } else if (tabName === 'problemes') {
        loadProblems();
    }
}

function loadReviews() {
    const avisList = document.getElementById('avisList');
    
    // Charger les avis depuis le localStorage
    const reviews = getReviewsFromStorage();
    const pendingReviews = reviews.filter(r => r.statut === 'en attente');
    
    if (pendingReviews.length === 0) {
        avisList.innerHTML = `
            <div class="text-center py-8 text-gray-500">
                <div class="text-4xl mb-3">✅</div>
                <p class="text-lg font-semibold">Aucun avis en attente</p>
                <p class="text-sm">Tous les avis ont été traités</p>
            </div>
        `;
        return;
    }
    
    avisList.innerHTML = '';
    
    pendingReviews.forEach(review => {
        const reviewCard = document.createElement('div');
        reviewCard.className = 'bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow';
        reviewCard.innerHTML = `
            <div class="flex justify-between items-start">
                <div class="flex-1">
                    <div class="flex items-center space-x-3 mb-2">
                        <span class="text-2xl">⭐</span>
                        <div>
                            <h3 class="font-semibold text-gray-900">${review.passager}</h3>
                            <p class="text-sm text-gray-600">Avis pour : ${review.conducteur}</p>
                        </div>
                    </div>
                    <p class="text-gray-700 mb-2">${review.commentaire}</p>
                    <div class="flex items-center space-x-2 text-sm text-gray-600">
                        <span>📅 ${formatDate(review.date)}</span>
                        <span>•</span>
                        <span>Note : <strong>${review.note}/5</strong></span>
                        <span>•</span>
                        <span>Covoiturage #${review.tripId}</span>
                    </div>
                </div>
                <div class="flex flex-col space-y-2 ml-4">
                    <button onclick="validateReview(${review.id})" 
                            class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition">
                        ✅ Valider
                    </button>
                    <button onclick="rejectReview(${review.id})" 
                            class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition">
                        ❌ Refuser
                    </button>
                </div>
            </div>
        `;
        avisList.appendChild(reviewCard);
    });
}

function loadProblems() {
    const problemesList = document.getElementById('problemesList');
    
    // Charger les problèmes depuis le localStorage
    const problems = getProblemsFromStorage();
    const activeProblems = problems.filter(p => p.resolu === false);
    
    if (activeProblems.length === 0) {
        problemesList.innerHTML = `
            <div class="text-center py-8 text-gray-500">
                <div class="text-4xl mb-3">✅</div>
                <p class="text-lg font-semibold">Aucun covoiturage problématique</p>
                <p class="text-sm">Tout se passe bien !</p>
            </div>
        `;
        return;
    }
    
    problemesList.innerHTML = '';
    
    activeProblems.forEach(problem => {
        const problemCard = document.createElement('div');
        problemCard.className = 'bg-red-50 border border-red-200 rounded-lg p-4 hover:shadow-md transition-shadow';
        problemCard.innerHTML = `
            <div class="flex justify-between items-start">
                <div class="flex-1">
                    <div class="flex items-center space-x-2 mb-2">
                        <span class="text-2xl">⚠️</span>
                        <h3 class="font-semibold text-red-900">Covoiturage #${problem.tripId}</h3>
                    </div>
                    <div class="grid grid-cols-2 gap-4 text-sm text-gray-700 mb-3">
                        <div>
                            <p><strong>Conducteur:</strong> ${problem.conducteurPseudo}</p>
                            <p><strong>Email:</strong> ${problem.conducteurEmail}</p>
                        </div>
                        <div>
                            <p><strong>Passager:</strong> ${problem.passagerPseudo}</p>
                            <p><strong>Email:</strong> ${problem.passagerEmail}</p>
                        </div>
                    </div>
                    <div class="bg-white rounded p-3 mb-3">
                        <p class="text-sm text-gray-600 mb-2"><strong>Trajet:</strong></p>
                        <p class="text-sm">${problem.trajet}</p>
                        <p class="text-sm mt-1">📅 Date : ${formatDate(problem.date)}</p>
                    </div>
                    <div class="bg-white rounded p-3">
                        <p class="text-sm text-gray-600 mb-1"><strong>Commentaire du passager:</strong></p>
                        <p class="text-sm text-gray-800">${problem.commentaire}</p>
                    </div>
                </div>
                <div class="flex flex-col space-y-2 ml-4">
                    <button onclick="resolveProblem(${problem.id})" 
                            class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition">
                        ✅ Résolu
                    </button>
                    <button onclick="contactDriver(${problem.id})" 
                            class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
                        📞 Contacter
                    </button>
                </div>
            </div>
        `;
        problemesList.appendChild(problemCard);
    });
}

function validateReview(reviewId) {
    if (confirm('Valider cet avis ? Il sera visible publiquement.')) {
        const reviews = getReviewsFromStorage();
        const reviewIndex = reviews.findIndex(r => r.id === reviewId);
        
        if (reviewIndex !== -1) {
            reviews[reviewIndex].statut = 'validé';
            reviews[reviewIndex].validatedBy = userManager.getCurrentUser().pseudo;
            reviews[reviewIndex].validatedAt = new Date().toISOString();
            
            saveReviewsToStorage(reviews);
            
            alert('Avis validé avec succès !');
            loadReviews();
        }
    }
}

function rejectReview(reviewId) {
    if (confirm('Refuser cet avis ? Il sera supprimé.')) {
        const reviews = getReviewsFromStorage();
        const filteredReviews = reviews.filter(r => r.id !== reviewId);
        
        saveReviewsToStorage(filteredReviews);
        
        alert('Avis refusé et supprimé.');
        loadReviews();
    }
}

function resolveProblem(problemId) {
    if (confirm('Marquer ce problème comme résolu ?')) {
        const problems = getProblemsFromStorage();
        const problemIndex = problems.findIndex(p => p.id === problemId);
        
        if (problemIndex !== -1) {
            problems[problemIndex].resolu = true;
            problems[problemIndex].resoluPar = userManager.getCurrentUser().pseudo;
            problems[problemIndex].resoluLe = new Date().toISOString();
            
            saveProblemsToStorage(problems);
            
            alert('Problème marqué comme résolu.');
            loadProblems();
        }
    }
}

function contactDriver(problemId) {
    const problems = getProblemsFromStorage();
    const problem = problems.find(p => p.id === problemId);
    
    if (problem) {
        alert(`Contacter le chauffeur:\n\nEmail: ${problem.conducteurEmail}\n\nEnvoyer un email pour résoudre le problème.`);
    }
}

// Fonctions utilitaires pour les avis
function getReviewsFromStorage() {
    const reviews = localStorage.getItem('ecoride_reviews');
    return reviews ? JSON.parse(reviews) : [];
}

function saveReviewsToStorage(reviews) {
    localStorage.setItem('ecoride_reviews', JSON.stringify(reviews));
}

// Fonctions utilitaires pour les problèmes
function getProblemsFromStorage() {
    const problems = localStorage.getItem('ecoride_problems');
    return problems ? JSON.parse(problems) : [];
}

function saveProblemsToStorage(problems) {
    localStorage.setItem('ecoride_problems', JSON.stringify(problems));
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
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

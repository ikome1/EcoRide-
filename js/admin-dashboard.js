// Script pour le dashboard administrateur
document.addEventListener('DOMContentLoaded', function() {
    // Vérifier l'authentification
    if (!userManager.isLoggedIn()) {
        window.location.href = 'login.html';
        return;
    }
    
    const user = userManager.getCurrentUser();
    
    // Vérifier que l'utilisateur est admin
    if (user.role !== 'admin') {
        alert('Accès refusé : espace administrateur uniquement');
        window.location.href = 'home.html';
        return;
    }
    
    console.log('Administrateur connecté:', user.pseudo);
    
    // Charger les données
    loadStatistics();
    loadEmployees();
    loadUsers();
    
    // Gestionnaires d'événements
    setupEventListeners();
    
    // Afficher l'onglet par défaut
    showTab('employees');
});

function setupEventListeners() {
    const addEmployeeForm = document.getElementById('addEmployeeForm');
    if (addEmployeeForm) {
        addEmployeeForm.addEventListener('submit', handleAddEmployee);
    }
}

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
    
    // Charger les statistiques si l'onglet stats est sélectionné
    if (tabName === 'stats') {
        setTimeout(() => {
            loadCharts();
        }, 100);
    }
}

function loadStatistics() {
    const totalUsers = userManager.users.length;
    const totalEmployees = userManager.employees.length;
    
    // Calculer les crédits de la plateforme
    let platformCredits = 0;
    userManager.users.forEach(user => {
        user.trips?.forEach(trip => {
            if (trip.type === 'passager') {
                platformCredits += 2; // 2 crédits pour chaque voyage en tant que passager
            }
        });
    });
    
    document.getElementById('totalUsers').textContent = totalUsers;
    document.getElementById('totalEmployees').textContent = totalEmployees;
    document.getElementById('totalCredits').textContent = platformCredits;
}

function loadEmployees() {
    const employeesList = document.getElementById('employeesList');
    
    if (userManager.employees.length === 0) {
        employeesList.innerHTML = `
            <div class="text-center py-8 text-gray-500">
                <div class="text-4xl mb-3">👷</div>
                <p class="text-lg font-semibold">Aucun employé enregistré</p>
                <p class="text-sm">Créez votre premier compte employé</p>
            </div>
        `;
        return;
    }
    
    employeesList.innerHTML = '';
    
    userManager.employees.forEach(employee => {
        const employeeCard = document.createElement('div');
        employeeCard.className = 'bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow';
        employeeCard.innerHTML = `
            <div class="flex justify-between items-start">
                <div class="flex-1">
                    <h4 class="font-semibold text-gray-900">${employee.pseudo}</h4>
                    <p class="text-sm text-gray-600">${employee.email}</p>
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-2">
                        Employé
                    </span>
                </div>
                <div class="flex flex-col items-end space-y-2">
                    <button onclick="suspendAccount('employee', ${employee.id})" 
                            class="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600 transition">
                        🚫 Suspendre
                    </button>
                </div>
            </div>
        `;
        employeesList.appendChild(employeeCard);
    });
}

function loadUsers() {
    const usersList = document.getElementById('usersList');
    
    if (userManager.users.length === 0) {
        usersList.innerHTML = `
            <div class="text-center py-8 text-gray-500">
                <div class="text-4xl mb-3">👤</div>
                <p class="text-lg font-semibold">Aucun utilisateur enregistré</p>
            </div>
        `;
        return;
    }
    
    usersList.innerHTML = '';
    
    userManager.users.forEach(user => {
        const statutClass = user.suspended ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800';
        const statutText = user.suspended ? 'Suspendu' : 'Actif';
        
        const userCard = document.createElement('div');
        userCard.className = 'bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow';
        userCard.innerHTML = `
            <div class="flex justify-between items-start">
                <div class="flex-1">
                    <h4 class="font-semibold text-gray-900">${user.pseudo}</h4>
                    <p class="text-sm text-gray-600">${user.email}</p>
                    <div class="flex items-center space-x-2 mt-2">
                        <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statutClass}">
                            ${statutText}
                        </span>
                        <span class="text-sm text-gray-600">${user.credits} crédits</span>
                        <span class="text-sm text-gray-600">• ${user.trips?.length || 0} voyage(s)</span>
                    </div>
                </div>
                <div class="flex flex-col items-end space-y-2">
                    <button onclick="suspendAccount('user', ${user.id})" 
                            class="${user.suspended ? 'bg-green-500' : 'bg-red-500'} text-white px-3 py-1 rounded text-xs hover:opacity-90 transition">
                        ${user.suspended ? '✅ Réactiver' : '🚫 Suspendre'}
                    </button>
                </div>
            </div>
        `;
        usersList.appendChild(userCard);
    });
}

function loadCharts() {
    const stats = userManager.getAdminStats();
    
    // Graphique des covoiturages
    const tripsCtx = document.getElementById('tripsChart').getContext('2d');
    new Chart(tripsCtx, {
        type: 'bar',
        data: {
            labels: Object.keys(stats.tripsByDay),
            datasets: [{
                label: 'Nombre de covoiturages',
                data: Object.values(stats.tripsByDay),
                backgroundColor: 'rgba(34, 197, 94, 0.8)',
                borderColor: 'rgb(34, 197, 94)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
    
    // Graphique des crédits
    const creditsCtx = document.getElementById('creditsChart').getContext('2d');
    new Chart(creditsCtx, {
        type: 'line',
        data: {
            labels: Object.keys(stats.creditsByDay),
            datasets: [{
                label: 'Crédits gagnés',
                data: Object.values(stats.creditsByDay),
                borderColor: 'rgb(59, 130, 246)',
                backgroundColor: 'rgba(59, 130, 246, 0.1)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function showAddEmployeeModal() {
    document.getElementById('addEmployeeModal').classList.remove('hidden');
    document.getElementById('addEmployeeModal').classList.add('flex');
}

function hideAddEmployeeModal() {
    document.getElementById('addEmployeeModal').classList.add('hidden');
    document.getElementById('addEmployeeModal').classList.remove('flex');
    document.getElementById('addEmployeeForm').reset();
}

function handleAddEmployee(e) {
    e.preventDefault();
    
    const pseudo = document.getElementById('empPseudo').value;
    const email = document.getElementById('empEmail').value;
    const password = document.getElementById('empPassword').value;
    
    // Vérifier que le pseudo ou email n'existe pas déjà
    const existingUser = userManager.users.find(u => u.pseudo === pseudo || u.email === email);
    const existingEmployee = userManager.employees.find(e => e.pseudo === pseudo || e.email === email);
    
    if (existingUser || existingEmployee) {
        alert('Ce pseudo ou email est déjà utilisé');
        return;
    }
    
    // Vérifier la sécurité du mot de passe
    if (!userManager.isPasswordSecure(password)) {
        alert('Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre');
        return;
    }
    
    // Créer l'employé
    const newEmployee = {
        id: Date.now(),
        pseudo: pseudo,
        email: email,
        password: userManager.hashPassword(password),
        role: 'employee'
    };
    
    userManager.employees.push(newEmployee);
    userManager.saveEmployees();
    
    alert('Employé créé avec succès !');
    hideAddEmployeeModal();
    loadEmployees();
    loadStatistics();
}

function suspendAccount(type, id) {
    const action = type === 'user' 
        ? (userManager.users.find(u => u.id === id)?.suspended ? 'réactiver' : 'suspendre')
        : 'suspendre';
    
    if (confirm(`Voulez-vous ${action} ce compte ?`)) {
        if (type === 'user') {
            const user = userManager.users.find(u => u.id === id);
            if (user) {
                user.suspended = !user.suspended;
                userManager.saveUsers();
                alert(`Compte ${action} avec succès !`);
                loadUsers();
            }
        } else if (type === 'employee') {
            // Pour les employés, on peut les retirer de la liste
            if (confirm('Êtes-vous sûr de vouloir suspendre cet employé ? Il ne pourra plus se connecter.')) {
                userManager.employees = userManager.employees.filter(e => e.id !== id);
                userManager.saveEmployees();
                alert('Employé suspendu avec succès !');
                loadEmployees();
                loadStatistics();
            }
        }
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

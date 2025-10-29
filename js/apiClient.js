// API Client pour EcoRide
// Remplace le localStorage par des appels API PHP/MySQL

class APIClient {
    constructor() {
        this.baseURL = 'api/';
        this.currentUser = null;
    }

    // Méthode générique pour les appels API
    async makeRequest(endpoint, method = 'GET', data = null) {
        const url = this.baseURL + endpoint;
        const options = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            }
        };

        if (data) {
            options.body = JSON.stringify(data);
        }

        try {
            const response = await fetch(url, options);
            const result = await response.json();
            
            if (!response.ok) {
                throw new Error(result.message || 'Erreur API');
            }
            
            return result;
        } catch (error) {
            console.error('Erreur API:', error);
            throw error;
        }
    }

    // === AUTHENTIFICATION ===
    
    async register(pseudo, email, password) {
        return await this.makeRequest('auth.php?action=register', 'POST', {
            pseudo: pseudo,
            email: email,
            password: password
        });
    }

    async login(pseudo, password) {
        const result = await this.makeRequest('auth.php?action=login', 'POST', {
            pseudo: pseudo,
            password: password
        });
        
        if (result.success) {
            this.currentUser = result.user;
        }
        
        return result;
    }

    async logout() {
        const result = await this.makeRequest('auth.php?action=logout', 'POST');
        this.currentUser = null;
        return result;
    }

    async checkSession() {
        try {
            const result = await this.makeRequest('auth.php?action=check-session', 'GET');
            if (result.success) {
                this.currentUser = result.user;
            }
            return result;
        } catch (error) {
            this.currentUser = null;
            return { success: false, message: 'Session expirée' };
        }
    }

    async updateProfile(updates) {
        return await this.makeRequest('auth.php?action=update-profile', 'POST', updates);
    }

    // === COVOITURAGES ===
    
    async searchTrips(depart, destination, date) {
        return await this.makeRequest('trips.php?action=search', 'POST', {
            depart: depart,
            destination: destination,
            date: date
        });
    }

    async participateTrip(tripId) {
        return await this.makeRequest('trips.php?action=participate', 'POST', {
            trip_id: tripId
        });
    }

    async addVehicle(vehicleData) {
        return await this.makeRequest('trips.php?action=add-vehicle', 'POST', vehicleData);
    }

    async createTrip(tripData) {
        return await this.makeRequest('trips.php?action=create-trip', 'POST', tripData);
    }

    async getUserVehicles() {
        return await this.makeRequest('trips.php?action=vehicles', 'GET');
    }

    async getUserTrips() {
        return await this.makeRequest('trips.php?action=trips', 'GET');
    }

    // === UTILITAIRES ===
    
    isLoggedIn() {
        return this.currentUser !== null;
    }

    getCurrentUser() {
        return this.currentUser;
    }

    // Redirection selon le rôle
    redirectToDashboard() {
        if (!this.currentUser) {
            window.location.href = 'login.html';
            return;
        }

        switch (this.currentUser.role) {
            case 'admin':
                window.location.href = 'admin.html';
                break;
            case 'employee':
                window.location.href = 'employee.html';
                break;
            case 'user':
            default:
                window.location.href = 'dashboard.html';
                break;
        }
    }
}

// Instance globale de l'API Client
const apiClient = new APIClient();

// Fonction de déconnexion globale
async function logout() {
    try {
        await apiClient.logout();
        window.location.href = 'home.html';
    } catch (error) {
        console.error('Erreur lors de la déconnexion:', error);
        window.location.href = 'home.html';
    }
}

// Fonction pour vérifier l'authentification
async function requireAuth() {
    if (!apiClient.isLoggedIn()) {
        const sessionCheck = await apiClient.checkSession();
        if (!sessionCheck.success) {
            window.location.href = 'login.html';
            return false;
        }
    }
    return true;
}

// Fonction pour vérifier le rôle admin
async function requireAdmin() {
    if (!await requireAuth()) return false;
    
    const user = apiClient.getCurrentUser();
    if (user.role !== 'admin') {
        window.location.href = 'dashboard.html';
        return false;
    }
    return true;
}

// Fonction pour vérifier le rôle employé ou admin
async function requireEmployee() {
    if (!await requireAuth()) return false;
    
    const user = apiClient.getCurrentUser();
    if (user.role !== 'employee' && user.role !== 'admin') {
        window.location.href = 'dashboard.html';
        return false;
    }
    return true;
}

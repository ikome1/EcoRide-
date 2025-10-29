// Système de gestion des utilisateurs et authentification
class UserManager {
  constructor() {
    this.currentUser = null;
    this.users = this.loadUsers();
    this.employees = this.loadEmployees();
    this.admins = this.loadAdmins();
  }

  // Charger les utilisateurs depuis le localStorage
  loadUsers() {
    try {
      const users = localStorage.getItem('ecoride_users');
      if (users) {
        const parsed = JSON.parse(users);
        console.log('Utilisateurs chargés depuis localStorage:', parsed.length);
        return parsed;
      } else {
        console.log('Aucun utilisateur dans localStorage, initialisation avec tableau vide');
        return [];
      }
    } catch (error) {
      console.error('Erreur lors du chargement des utilisateurs:', error);
      console.log('Initialisation avec tableau vide');
      return [];
    }
  }

  // Charger les employés depuis le localStorage
  loadEmployees() {
    const employees = localStorage.getItem('ecoride_employees');
    if (employees) {
      return JSON.parse(employees);
    } else {
      // Initialiser les 5 employés par défaut
      const defaultEmployees = [
        {
          id: 1,
          pseudo: 'employe1',
          email: 'employe1@ecoride.fr',
          password: btoa('employe123'),
          role: 'employee'
        },
        {
          id: 2,
          pseudo: 'employe2',
          email: 'employe2@ecoride.fr',
          password: btoa('employe123'),
          role: 'employee'
        },
        {
          id: 3,
          pseudo: 'employe3',
          email: 'employe3@ecoride.fr',
          password: btoa('employe123'),
          role: 'employee'
        },
        {
          id: 4,
          pseudo: 'employe4',
          email: 'employe4@ecoride.fr',
          password: btoa('employe123'),
          role: 'employee'
        },
        {
          id: 5,
          pseudo: 'employe5',
          email: 'employe5@ecoride.fr',
          password: btoa('employe123'),
          role: 'employee'
        }
      ];
      // Sauvegarder les employés par défaut dans le localStorage
      localStorage.setItem('ecoride_employees', JSON.stringify(defaultEmployees));
      return defaultEmployees;
    }
  }

  // Charger les administrateurs depuis le localStorage
  loadAdmins() {
    const admins = localStorage.getItem('ecoride_admins');
    return admins ? JSON.parse(admins) : [
      {
        id: 1,
        pseudo: 'admin',
        email: 'admin@ecoride.fr',
        password: btoa('admin123'),
        role: 'admin'
      }
    ];
  }

  // Sauvegarder les utilisateurs
  saveUsers() {
    try {
      const usersJson = JSON.stringify(this.users);
      localStorage.setItem('ecoride_users', usersJson);
      console.log('Utilisateurs sauvegardés:', this.users.length);
      return true;
    } catch (error) {
      console.error('Erreur lors de la sauvegarde des utilisateurs:', error);
      return false;
    }
  }

  // Sauvegarder les employés
  saveEmployees() {
    localStorage.setItem('ecoride_employees', JSON.stringify(this.employees));
  }

  // Sauvegarder les administrateurs
  saveAdmins() {
    localStorage.setItem('ecoride_admins', JSON.stringify(this.admins));
  }

  // Créer un compte utilisateur (US 7)
  createAccount(pseudo, email, password) {
    console.log('createAccount appelé avec:', { pseudo, email });
    
    // Vérifier si le pseudo ou email existe déjà
    const existingUser = this.users.find(u => u.pseudo === pseudo || u.email === email);
    if (existingUser) {
      console.log('Utilisateur existant trouvé:', existingUser);
      throw new Error('Ce pseudo ou email est déjà utilisé');
    }

    // Vérifier la sécurité du mot de passe
    if (!this.isPasswordSecure(password)) {
      console.log('Mot de passe non sécurisé');
      throw new Error('Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre');
    }

    const newUser = {
      id: Date.now(),
      pseudo: pseudo,
      email: email,
      password: this.hashPassword(password),
      credits: 20, // 20 crédits à la création
      role: 'user',
      type: 'passager', // Par défaut passager
      vehicles: [],
      preferences: {
        fumeur: false,
        animaux: false,
        autres: []
      },
      trips: [], // Historique des covoiturages
      createdAt: new Date().toISOString()
    };

    console.log('Nouvel utilisateur créé:', newUser);
    
    this.users.push(newUser);
    console.log('Utilisateur ajouté à la liste, nombre total:', this.users.length);
    
    const saveResult = this.saveUsers();
    if (!saveResult) {
      // Si la sauvegarde échoue, retirer l'utilisateur de la liste
      this.users.pop();
      throw new Error('Erreur lors de la sauvegarde du compte');
    }
    console.log('Utilisateurs sauvegardés dans localStorage');
    
    return newUser;
  }

  // Vérifier la sécurité du mot de passe
  isPasswordSecure(password) {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    
    return minLength && hasUpperCase && hasLowerCase && hasNumber;
  }

  // Hash simple du mot de passe (en production, utiliser bcrypt)
  hashPassword(password) {
    return btoa(password); // Simple base64 pour la démo
  }

  // Vérifier le mot de passe
  verifyPassword(password, hash) {
    return btoa(password) === hash;
  }

  // Connexion utilisateur
  login(pseudo, password) {
    // Chercher dans les utilisateurs
    let user = this.users.find(u => u.pseudo === pseudo);
    if (user && this.verifyPassword(password, user.password)) {
      this.currentUser = user;
      localStorage.setItem('ecoride_current_user', JSON.stringify(user));
      return { success: true, user: user };
    }

    // Chercher dans les employés
    let employee = this.employees.find(e => e.pseudo === pseudo);
    if (employee && this.verifyPassword(password, employee.password)) {
      this.currentUser = employee;
      localStorage.setItem('ecoride_current_user', JSON.stringify(employee));
      return { success: true, user: employee };
    }

    // Chercher dans les administrateurs
    let admin = this.admins.find(a => a.pseudo === pseudo);
    if (admin && this.verifyPassword(password, admin.password)) {
      this.currentUser = admin;
      localStorage.setItem('ecoride_current_user', JSON.stringify(admin));
      return { success: true, user: admin };
    }

    return { success: false, message: 'Identifiants incorrects' };
  }

  // Déconnexion
  logout() {
    this.currentUser = null;
    localStorage.removeItem('ecoride_current_user');
  }

  // Vérifier si un utilisateur est connecté
  isLoggedIn() {
    // D'abord vérifier le localStorage
    const stored = localStorage.getItem('ecoride_current_user');
    if (stored) {
      try {
        const userData = JSON.parse(stored);
        // Vérifier que l'utilisateur existe toujours dans la base de données
        const userExists = this.users.find(u => u.id === userData.id) || 
                          this.employees.find(e => e.id === userData.id) || 
                          this.admins.find(a => a.id === userData.id);
        
        if (userExists) {
          this.currentUser = userData;
          return true;
        } else {
          // L'utilisateur n'existe plus, nettoyer le localStorage
          localStorage.removeItem('ecoride_current_user');
          this.currentUser = null;
          return false;
        }
      } catch (error) {
        console.error('Erreur lors du parsing de l\'utilisateur:', error);
        localStorage.removeItem('ecoride_current_user');
        this.currentUser = null;
        return false;
      }
    }
    
    return false;
  }

  // Obtenir l'utilisateur actuel
  getCurrentUser() {
    if (this.currentUser) return this.currentUser;
    
    // Si pas d'utilisateur en mémoire, vérifier le localStorage
    const stored = localStorage.getItem('ecoride_current_user');
    if (stored) {
      try {
        const userData = JSON.parse(stored);
        // Vérifier que l'utilisateur existe toujours dans la base de données
        const userExists = this.users.find(u => u.id === userData.id) || 
                          this.employees.find(e => e.id === userData.id) || 
                          this.admins.find(a => a.id === userData.id);
        
        if (userExists) {
          this.currentUser = userData;
          return userData;
        } else {
          // L'utilisateur n'existe plus, nettoyer le localStorage
          localStorage.removeItem('ecoride_current_user');
          return null;
        }
      } catch (error) {
        console.error('Erreur lors du parsing de l\'utilisateur:', error);
        localStorage.removeItem('ecoride_current_user');
        return null;
      }
    }
    return null;
  }

  // Mettre à jour le profil utilisateur (US 8)
  updateUserProfile(userId, updates) {
    const userIndex = this.users.findIndex(u => u.id === userId);
    if (userIndex === -1) return false;

    this.users[userIndex] = { ...this.users[userIndex], ...updates };
    this.saveUsers();

    // Mettre à jour l'utilisateur actuel si c'est lui
    if (this.currentUser && this.currentUser.id === userId) {
      this.currentUser = this.users[userIndex];
      localStorage.setItem('ecoride_current_user', JSON.stringify(this.currentUser));
    }

    return true;
  }

  // Ajouter un véhicule à un utilisateur
  addVehicle(userId, vehicle) {
    const user = this.users.find(u => u.id === userId);
    if (!user) return false;

    // Vérifier que la plaque n'existe pas déjà
    const existingVehicle = user.vehicles.find(v => v.plaque === vehicle.plaque);
    if (existingVehicle) {
      throw new Error('Un véhicule avec cette plaque existe déjà');
    }

    const newVehicle = {
      id: Date.now(),
      plaque: vehicle.plaque,
      dateImmatriculation: vehicle.dateImmatriculation,
      marque: vehicle.marque,
      modele: vehicle.modele,
      couleur: vehicle.couleur,
      places: vehicle.places,
      type: vehicle.type || 'Essence',
      createdAt: new Date().toISOString()
    };

    user.vehicles.push(newVehicle);
    this.updateUserProfile(userId, { vehicles: user.vehicles });
    return true;
  }

  // Supprimer un véhicule
  removeVehicle(userId, vehicleId) {
    const user = this.users.find(u => u.id === userId);
    if (!user) return false;

    user.vehicles = user.vehicles.filter(v => v.id !== vehicleId);
    this.updateUserProfile(userId, { vehicles: user.vehicles });
    return true;
  }

  // Obtenir les marques de véhicules disponibles
  getAvailableBrands() {
    return [
      { name: 'Toyota', models: ['Corolla', 'Camry', 'Prius', 'RAV4', 'Highlander'] },
      { name: 'Honda', models: ['Civic', 'Accord', 'CR-V', 'Pilot', 'Fit'] },
      { name: 'Tesla', models: ['Model 3', 'Model S', 'Model X', 'Model Y'] },
      { name: 'BMW', models: ['Série 3', 'Série 5', 'X3', 'X5', 'i3', 'i8'] },
      { name: 'Ford', models: ['Mustang', 'Focus', 'Fiesta', 'Escape', 'Explorer'] },
      { name: 'Audi', models: ['A4', 'A6', 'Q5', 'Q7', 'e-tron', 'TT'] },
      { name: 'Volkswagen', models: ['Golf', 'Passat', 'Tiguan', 'Jetta', 'ID.4'] },
      { name: 'Mercedes-Benz', models: ['Classe C', 'Classe E', 'GLC', 'GLE', 'EQC'] },
      { name: 'Porsche', models: ['911', 'Cayenne', 'Macan', 'Panamera', 'Taycan'] },
      { name: 'Nissan', models: ['Leaf', 'Altima', 'Sentra', 'Rogue', 'Pathfinder'] },
      { name: 'Renault', models: ['Zoe', 'Clio', 'Megane', 'Kadjar', 'Captur'] },
      { name: 'Peugeot', models: ['208', '308', '3008', '5008', 'e-208'] },
      { name: 'Citroën', models: ['C3', 'C4', 'C5 Aircross', 'Berlingo', 'e-C4'] }
    ];
  }

  // Déduire des crédits
  deductCredits(userId, amount) {
    const user = this.users.find(u => u.id === userId);
    if (!user || user.credits < amount) return false;

    user.credits -= amount;
    this.updateUserProfile(userId, { credits: user.credits });
    return true;
  }

  // Ajouter des crédits
  addCredits(userId, amount) {
    const user = this.users.find(u => u.id === userId);
    if (!user) return false;

    user.credits += amount;
    this.updateUserProfile(userId, { credits: user.credits });
    return true;
  }

  // Synchroniser l'utilisateur actuel avec les données en base
  syncCurrentUser() {
    if (!this.currentUser) return false;
    
    // Chercher l'utilisateur dans la base de données
    let updatedUser = this.users.find(u => u.id === this.currentUser.id) || 
                     this.employees.find(e => e.id === this.currentUser.id) || 
                     this.admins.find(a => a.id === this.currentUser.id);
    
    if (updatedUser) {
      // Mettre à jour l'utilisateur actuel avec les données les plus récentes
      // En conservant les propriétés qui pourraient manquer (vehicles, trips, etc.)
      const mergedUser = {
        ...updatedUser,
        vehicles: updatedUser.vehicles || this.currentUser.vehicles || [],
        trips: updatedUser.trips || this.currentUser.trips || [],
        preferences: updatedUser.preferences || this.currentUser.preferences || {
          fumeur: false,
          animaux: false,
          autres: []
        }
      };
      
      this.currentUser = mergedUser;
      localStorage.setItem('ecoride_current_user', JSON.stringify(mergedUser));
      return true;
    } else {
      // L'utilisateur n'existe plus, se déconnecter
      this.logout();
      return false;
    }
  }

  // Obtenir les statistiques pour l'admin
  getAdminStats() {
    const totalCreditsEarned = this.users.reduce((sum, user) => {
      return sum + (20 - user.credits); // Crédits dépensés
    }, 0);

    const tripsByDay = {};
    this.users.forEach(user => {
      user.trips.forEach(trip => {
        const date = trip.date;
        tripsByDay[date] = (tripsByDay[date] || 0) + 1;
      });
    });

    const creditsByDay = {};
    this.users.forEach(user => {
      user.trips.forEach(trip => {
        const date = trip.date;
        creditsByDay[date] = (creditsByDay[date] || 0) + 2; // 2 crédits par voyage
      });
    });

    return {
      totalUsers: this.users.length,
      totalCreditsEarned: totalCreditsEarned,
      tripsByDay: tripsByDay,
      creditsByDay: creditsByDay
    };
  }
}

// Instance globale du gestionnaire d'utilisateurs
const userManager = new UserManager();

// Export pour utilisation dans d'autres fichiers
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { UserManager, userManager };
}

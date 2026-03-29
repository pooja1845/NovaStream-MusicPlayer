/**
 * auth.js - Centralized Authentication Utility for NovaStream
 * This script handles user registration, login, and session state using LocalStorage.
 */

const Auth = {
    // Keys for LocalStorage
    USERS_KEY: 'novastream_users',
    CURRENT_USER_KEY: 'novastream_current_user',

    /**
     * Get all registered users from localStorage
     * @returns {Array} Array of user objects
     */
    getAllUsers: function() {
        const users = localStorage.getItem(this.USERS_KEY);
        return users ? JSON.parse(users) : [];
    },

    /**
     * Register a new user
     * @param {string} name 
     * @param {string} email 
     * @param {string} password 
     * @returns {Object} { success: boolean, message: string }
     */
    register: function(name, email, password) {
        const users = this.getAllUsers();
        
        // Check if user already exists
        if (users.find(u => u.email === email)) {
            return { success: false, message: 'User with this email already exists.' };
        }

        // Add new user
        const newUser = { id: Date.now(), name, email, password };
        users.push(newUser);
        localStorage.setItem(this.USERS_KEY, JSON.stringify(users));

        return { success: true, message: 'Registration successful! You can now log in.' };
    },

    /**
     * Authenticate a user
     * @param {string} email 
     * @param {string} password 
     * @returns {Object} { success: boolean, message: string }
     */
    login: function(email, password) {
        const users = this.getAllUsers();
        const user = users.find(u => u.email === email && u.password === password);

        if (user) {
            // Set current user (excluding password for security)
            const { password, ...userSession } = user;
            localStorage.setItem(this.CURRENT_USER_KEY, JSON.stringify(userSession));
            return { success: true, message: 'Login successful!' };
        }

        return { success: false, message: 'Invalid email or password.' };
    },

    /**
     * Log out the current user
     */
    logout: function() {
        localStorage.removeItem(this.CURRENT_USER_KEY);
        window.location.href = 'index.html';
    },

    /**
     * Get the currently logged in user
     * @returns {Object|null} User object or null
     */
    getCurrentUser: function() {
        const user = localStorage.getItem(this.CURRENT_USER_KEY);
        return user ? JSON.parse(user) : null;
    },

    /**
     * Check if a user is currently logged in
     * @returns {boolean}
     */
    isLoggedIn: function() {
        return !!this.getCurrentUser();
    }
};

// Export to window so it's globally accessible in NovaStream
window.Auth = Auth;

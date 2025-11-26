import api from '../api/axios';

// Use sessionStorage instead of localStorage so each tab maintains its own session
const storage = sessionStorage;

const authService = {
    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        if (response.data.token) {
            storage.setItem('token', response.data.token);
            storage.setItem('user', JSON.stringify(response.data.user));
            storage.setItem('role', response.data.role || 'student');
        }
        return response.data;
    },

    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        if (response.data.token) {
            storage.setItem('token', response.data.token);
            storage.setItem('user', JSON.stringify(response.data.user));
            storage.setItem('role', response.data.role || 'student');
        }
        return response.data;
    },

    logout: async () => {
        const token = storage.getItem('token');
        if (token) {
            try {
                await api.post('/auth/logout', {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } catch (error) {
                // Even if logout fails on server, clear session storage
                console.error('Logout error:', error);
            }
        }
        storage.removeItem('token');
        storage.removeItem('user');
        storage.removeItem('role');
        storage.removeItem('student'); // Remove old key if exists
        // Also clear localStorage for backwards compatibility
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        localStorage.removeItem('student');
    },

    getCurrentUser: () => {
        // Check sessionStorage first, then localStorage for backwards compatibility
        const user = storage.getItem('user') || localStorage.getItem('user') || storage.getItem('student') || localStorage.getItem('student');
        return user ? JSON.parse(user) : null;
    },

    getCurrentStudent: () => {
        // Backwards compatibility
        return authService.getCurrentUser();
    },

    getRole: () => {
        return storage.getItem('role') || localStorage.getItem('role') || 'student';
    },

    getToken: () => {
        return storage.getItem('token') || localStorage.getItem('token');
    },

    isAuthenticated: () => {
        return !!(storage.getItem('token') || localStorage.getItem('token'));
    },

    isAdmin: () => {
        return authService.getRole() === 'admin';
    },

    isSecurity: () => {
        return authService.getRole() === 'security';
    },

    isStudent: () => {
        return authService.getRole() === 'student';
    },

    // Get current user from API (ensures we get the actual authenticated user)
    getProfile: async () => {
        try {
            const response = await api.get('/auth/profile');
            const user = response.data;
            // Update sessionStorage with fresh data
            storage.setItem('user', JSON.stringify(user));
            // Also update role if provided
            if (user.role) {
                storage.setItem('role', user.role);
            }
            return user;
        } catch (error) {
            console.error('Failed to get profile:', error);
            // If API call fails with 401, clear stale data
            if (error.response?.status === 401) {
                storage.removeItem('user');
                storage.removeItem('role');
                // Also clear localStorage for backwards compatibility
                localStorage.removeItem('user');
                localStorage.removeItem('role');
                throw error; // Re-throw to let component handle it
            }
            // For other errors, don't use stale storage data
            // Return null so component can handle the error
            throw error;
        }
    }
};

export default authService;
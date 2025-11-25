import api from '../api/axios';

const authService = {
    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            localStorage.setItem('role', response.data.role || 'student');
        }
        return response.data;
    },

    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
            localStorage.setItem('role', response.data.role || 'student');
        }
        return response.data;
    },

    logout: async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                await api.post('/auth/logout', {}, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } catch (error) {
                // Even if logout fails on server, clear local storage
                console.error('Logout error:', error);
            }
        }
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('role');
        localStorage.removeItem('student'); // Remove old key if exists
    },

    getCurrentUser: () => {
        const user = localStorage.getItem('user') || localStorage.getItem('student');
        return user ? JSON.parse(user) : null;
    },

    getCurrentStudent: () => {
        // Backwards compatibility
        return authService.getCurrentUser();
    },

    getRole: () => {
        return localStorage.getItem('role') || 'student';
    },

    getToken: () => {
        return localStorage.getItem('token');
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('token');
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
            // Update localStorage with fresh data
            localStorage.setItem('user', JSON.stringify(user));
            return user;
        } catch (error) {
            console.error('Failed to get profile:', error);
            // If API call fails, fall back to localStorage
            return authService.getCurrentUser();
        }
    }
};

export default authService;
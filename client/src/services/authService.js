import api from '../api/axios';

export const authService = {
    register: async (userData) => {
        const response = await api.post('/auth/register', userData);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('student', JSON.stringify(response.data.student));
        }
        return response.data;
    },

    login: async (credentials) => {
        const response = await api.post('/auth/login', credentials);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user_type', response.data.user_type);
            localStorage.setItem('role', response.data.role);
            
            // Store user or student data based on type
            if (response.data.user_type === 'student') {
                localStorage.setItem('student', JSON.stringify(response.data.student));
            } else {
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }
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
                console.error('Logout API error:', error);
            }
        }
        localStorage.removeItem('token');
        localStorage.removeItem('student');
        localStorage.removeItem('user');
        localStorage.removeItem('user_type');
        localStorage.removeItem('role');
    },

    getCurrentStudent: () => {
        const student = localStorage.getItem('student');
        return student ? JSON.parse(student) : null;
    },

    getToken: () => {
        return localStorage.getItem('token');
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },

    getProfile: async () => {
        const response = await api.get('/auth/profile');
        if (response.data) {
            // Update localStorage with fresh profile data
            if (response.data.pkStudentID) {
                localStorage.setItem('student', JSON.stringify(response.data));
            }
        }
        return response.data;
    }
};
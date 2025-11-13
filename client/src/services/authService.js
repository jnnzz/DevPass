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
            localStorage.setItem('student', JSON.stringify(response.data.student));
        }
        return response.data;
    },

    logout: async () => {
        const token = localStorage.getItem('token');
        if (token) {
            await api.post('/auth/logout', {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
        }
        localStorage.removeItem('token');
        localStorage.removeItem('student');
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
    }
};
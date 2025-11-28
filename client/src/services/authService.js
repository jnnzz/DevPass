import api from '../api/axios';

export const authService = {
    register: async (userData, rememberMe = false) => {
        const response = await api.post('/auth/register', userData);
        if (response.data.token) {
            const storage = rememberMe ? localStorage : sessionStorage;
            storage.setItem('token', response.data.token);
            storage.setItem('student', JSON.stringify(response.data.student));
            // Also store a flag to know which storage was used
            if (rememberMe) {
                localStorage.setItem('rememberMe', 'true');
            } else {
                localStorage.removeItem('rememberMe');
            }
        }
        return response.data;
    },

    login: async (credentials, rememberMe = false) => {
        const response = await api.post('/auth/login', credentials);
        if (response.data.token) {
            const storage = rememberMe ? localStorage : sessionStorage;
            storage.setItem('token', response.data.token);
            storage.setItem('student', JSON.stringify(response.data.student));
            // Also store a flag to know which storage was used
            if (rememberMe) {
                localStorage.setItem('rememberMe', 'true');
            } else {
                localStorage.removeItem('rememberMe');
            }
        }
        return response.data;
    },

    logout: async () => {
        try {
            // Try to call the logout endpoint (axios interceptor will add the token)
            const token = localStorage.getItem('token') || sessionStorage.getItem('token');
            if (token) {
                try {
                    await api.post('/auth/logout');
                } catch (error) {
                    // Even if the API call fails, we still want to clear storage
                    console.warn('Logout API call failed, but clearing storage anyway:', error);
                }
            }
        } finally {
            // Always clear both storage types, even if API call fails
            localStorage.removeItem('token');
            localStorage.removeItem('student');
            localStorage.removeItem('rememberMe');
            sessionStorage.removeItem('token');
            sessionStorage.removeItem('student');
        }
    },

    getCurrentStudent: () => {
        // Check localStorage first (remember me), then sessionStorage
        const student = localStorage.getItem('student') || sessionStorage.getItem('student');
        return student ? JSON.parse(student) : null;
    },

    getToken: () => {
        // Check localStorage first (remember me), then sessionStorage
        return localStorage.getItem('token') || sessionStorage.getItem('token');
    },

    isAuthenticated: () => {
        // Check both storage types
        return !!(localStorage.getItem('token') || sessionStorage.getItem('token'));
    },

    forgotPassword: async (email) => {
        const response = await api.post('/auth/forgot-password', { email });
        return response.data;
    },

    resetPassword: async (email, code, password, passwordConfirmation) => {
        const response = await api.post('/auth/reset-password', {
            email,
            code,
            password,
            password_confirmation: passwordConfirmation
        });
        return response.data;
    },

    isSecurity: () => {
        // Check localStorage first (remember me), then sessionStorage
        const studentData = localStorage.getItem('student') || sessionStorage.getItem('student');
        if (!studentData) return false;
        
        try {
            const student = JSON.parse(studentData);
            const course = student.course?.toLowerCase() || '';
            const email = student.email?.toLowerCase() || '';
            return course === 'security' || course === 'personnel' || email.includes('security@devpass');
        } catch (e) {
            return false;
        }
    }
};
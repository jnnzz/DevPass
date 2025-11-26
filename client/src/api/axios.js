import axios from 'axios';
import authService from '../services/authService';

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

// Add token to every request if it exists
// Use sessionStorage first (per-tab), fallback to localStorage for backwards compatibility
api.interceptors.request.use(
    (config) => {
        const token = sessionStorage.getItem('token') || localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle response errors globally
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;
        
        // Only handle 401/403 errors, and only if we haven't already retried
        if ((error.response?.status === 401 || error.response?.status === 403) && 
            !originalRequest._retry) {
            
            originalRequest._retry = true;
            
            // Check if token exists - if not, it's a real auth issue
            // Check sessionStorage first, then localStorage
            const token = sessionStorage.getItem('token') || localStorage.getItem('token');
            if (!token) {
                // No token, clear everything and let component handle redirect
                return Promise.reject(error);
            }
            
            // Token exists but got 401/403 - could be expired or invalid
            // Don't logout immediately - let the component decide
            // Some endpoints might return 401/403 for other reasons (e.g., insufficient permissions)
            // Only logout if it's specifically an authentication endpoint
            const isAuthEndpoint = originalRequest.url?.includes('/auth/');
            
            if (isAuthEndpoint && error.response?.status === 401) {
                // Auth endpoint returned 401 - token is definitely invalid
                // Clear auth data but don't navigate (let component handle it)
                sessionStorage.removeItem('token');
                sessionStorage.removeItem('user');
                sessionStorage.removeItem('role');
                // Also clear localStorage for backwards compatibility
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                localStorage.removeItem('role');
            }
        }
        
        return Promise.reject(error);
    }
);

export default api;
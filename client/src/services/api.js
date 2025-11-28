import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const studentAPI = {
    getAll: () => api.get('/students'),
    create: (studentData) => api.post('/students', studentData),
    getById: (id) => api.get(`/students/${id}`),
};

export const deviceAPI = {
    getAll: () => api.get('/devices'),
    create: (deviceData) => api.post('/devices', deviceData),
    getByStudent: (studentId) => api.get(`/devices/student/${studentId}`),
};

export const qrAPI = {
    generate: (deviceId) => api.post('/qr/generate', { device_id: deviceId }),
    validate: (qrHash) => api.post('/qr/validate', { qr_hash: qrHash }),
};

export default api;
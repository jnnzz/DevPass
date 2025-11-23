import api from '../api/axios';

export const deviceService = {
    // Get all devices for authenticated student
    getAll: async () => {
        const response = await api.get('/devices');
        return response.data;
    },

    // Get specific device
    getById: async (id) => {
        const response = await api.get(`/devices/${id}`);
        return response.data;
    },

    // Register new device
    register: async (deviceData) => {
        const response = await api.post('/devices', deviceData);
        return response.data;
    },

    // Update device
    update: async (id, deviceData) => {
        const response = await api.put(`/devices/${id}`, deviceData);
        return response.data;
    },

    // Delete device
    delete: async (id) => {
        const response = await api.delete(`/devices/${id}`);
        return response.data;
    },

    // Generate QR code
    generateQR: async (id) => {
        const response = await api.post(`/devices/${id}/generate-qr`);
        return response.data;
    },

    // Renew device QR
    renew: async (id) => {
        const response = await api.post(`/devices/${id}/renew`);
        return response.data;
    },

    // Get recent activities
    getActivities: async () => {
        const response = await api.get('/devices/activities/list');
        return response.data;
    },
};


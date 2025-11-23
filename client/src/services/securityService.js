import api from '../api/axios';

export const securityService = {
    // Read QR code (without logging - for preview)
    readQR: async (qrData) => {
        const response = await api.post('/qr/read', {
            qr_data: qrData
        });
        return response.data;
    },

    // Validate QR code (logs as accepted)
    validateQR: async (qrData, gateName) => {
        const response = await api.post('/qr/validate', {
            qr_data: qrData,
            gate_name: gateName
        });
        return response.data;
    },

    // Deny access manually
    denyAccess: async (qrData, gateName) => {
        const response = await api.post('/qr/deny', {
            qr_data: qrData,
            gate_name: gateName
        });
        return response.data;
    },

    // Get statistics for security personnel
    getStatistics: async (gateName = null) => {
        const params = gateName ? { gate_name: gateName } : {};
        const response = await api.get('/security/statistics', { params });
        return response.data;
    },

    // Get recent scans/activities
    getRecentScans: async (limit = 50, gateName = null) => {
        const params = { limit };
        if (gateName) params.gate_name = gateName;
        const response = await api.get('/security/activities', { params });
        return response.data;
    },
};


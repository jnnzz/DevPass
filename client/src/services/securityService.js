import api from '../api/axios';

export const securityService = {
    // Read QR code (without logging - for preview)
    readQR: async (qrHash) => {
        const response = await api.post('/entries/read-qr', {
            qr_hash: qrHash
        });
        return response.data;
    },

    // Validate QR code (logs as accepted)
    validateQR: async (qrHash, gateName) => {
        const response = await api.post('/entries/validate-qr', {
            qr_hash: qrHash,
            gate_name: gateName
        });
        return response.data;
    },

    // Deny access manually
    denyAccess: async (qrHash, gateName) => {
        const response = await api.post('/entries/deny-qr', {
            qr_hash: qrHash,
            gate_name: gateName
        });
        return response.data;
    },

    // Get statistics for security personnel
    getStatistics: async (gateName = null) => {
        const params = gateName ? { gate: gateName } : {};
        const response = await api.get('/entries/stats', { params });
        return response.data;
    },

    // Get recent scans/activities
    getRecentScans: async (limit = 50, gateName = null) => {
        const params = { limit };
        if (gateName) params.gate = gateName;
        const response = await api.get('/entries', { params });
        return response.data;
    },
};


import api from '../api/axios';

export const adminService = {
    // Get all devices (with filters)
    getAllDevices: async (filters = {}) => {
        const params = new URLSearchParams();
        if (filters.status) params.append('status', filters.status);
        if (filters.student_id) params.append('student_id', filters.student_id);
        if (filters.search) params.append('search', filters.search);
        
        const queryString = params.toString();
        const url = `/admin/devices${queryString ? `?${queryString}` : ''}`;
        const response = await api.get(url);
        return response.data;
    },

    // Get specific device
    getDevice: async (id) => {
        const response = await api.get(`/admin/devices/${id}`);
        return response.data;
    },

    // Approve device
    approveDevice: async (id) => {
        const response = await api.post(`/admin/devices/${id}/approve`);
        return response.data;
    },

    // Reject device
    rejectDevice: async (id, reason = null) => {
        const response = await api.post(`/admin/devices/${id}/reject`, {
            reason: reason
        });
        return response.data;
    },

    // Get statistics
    getStatistics: async () => {
        const response = await api.get('/admin/devices/statistics');
        return response.data;
    },

    // Get all activities
    getActivities: async (limit = 50) => {
        const response = await api.get(`/admin/devices/activities/list?limit=${limit}`);
        return response.data;
    },
};


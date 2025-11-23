import api from '../api/axios';

export const adminService = {
    // Dashboard Stats
    getDashboardStats: () => api.get('/admin/dashboard/stats'),

    // Device Management
    getDevices: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.status) queryParams.append('status', params.status);
        if (params.search) queryParams.append('search', params.search);
        if (params.per_page) queryParams.append('per_page', params.per_page);
        
        const queryString = queryParams.toString();
        return api.get(`/admin/devices${queryString ? '?' + queryString : ''}`);
    },

    approveDevice: (deviceId) => api.post(`/admin/devices/${deviceId}/approve`),

    rejectDevice: (deviceId, reason = '') => api.post(`/admin/devices/${deviceId}/reject`, { reason }),

    // Recent Scans
    getRecentScans: (limit = 20) => api.get(`/admin/scans/recent?limit=${limit}`),

    // Reports
    getStudentsReport: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.format) queryParams.append('format', params.format);
        if (params.start_date) queryParams.append('start_date', params.start_date);
        if (params.end_date) queryParams.append('end_date', params.end_date);
        
        const queryString = queryParams.toString();
        return api.get(`/admin/reports/students${queryString ? '?' + queryString : ''}`);
    },

    getDevicesReport: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.format) queryParams.append('format', params.format);
        if (params.status) queryParams.append('status', params.status);
        if (params.start_date) queryParams.append('start_date', params.start_date);
        if (params.end_date) queryParams.append('end_date', params.end_date);
        
        const queryString = queryParams.toString();
        return api.get(`/admin/reports/devices${queryString ? '?' + queryString : ''}`);
    },

    getSummaryReport: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.start_date) queryParams.append('start_date', params.start_date);
        if (params.end_date) queryParams.append('end_date', params.end_date);
        
        const queryString = queryParams.toString();
        return api.get(`/admin/reports/summary${queryString ? '?' + queryString : ''}`);
    },
};


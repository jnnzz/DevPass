import api from '../api/axios';

export const studentAPI = {
    getAll: () => api.get('/students'),
    create: (studentData) => api.post('/students', studentData),
    getById: (id) => api.get(`/students/${id}`),
};

export const deviceAPI = {
    getAll: () => api.get('/devices'),
    create: (deviceData) => api.post('/devices', {
        device_type: deviceData.deviceType,
        brand: deviceData.brand,
        model: deviceData.model,
        serial_number: deviceData.serialNumber,
        notes: deviceData.notes
    }),
    getByStudent: (studentId) => api.get(`/devices/student/${studentId}`),
    getScanActivity: () => api.get('/devices/activity/scans'),
};

export const qrAPI = {
    generate: (deviceId) => api.post('/qr/generate', { device_id: deviceId }),
    validate: (qrData, gateName = null) => api.post('/qr/validate', { 
        qr_data: qrData,
        gate_name: gateName 
    }),
};

export default api;
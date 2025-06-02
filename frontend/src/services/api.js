import axios from 'axios';

const API_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add token to requests if it exists
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const auth = {
    register: (userData) => api.post('/auth/register', userData),
    login: (credentials) => api.post('/auth/login', credentials)
};

export const stations = {
    getAll: () => api.get('/stations'),
    create: (stationData) => api.post('/stations', stationData),
    update: (id, stationData) => api.put(`/stations/${id}`, stationData),
    delete: (id) => api.delete(`/stations/${id}`),
    getNearby: (latitude, longitude, maxDistance) => 
        api.get('/stations/nearby', { params: { latitude, longitude, maxDistance } })
};

export default api; 
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://202.155.90.188:3000',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor: Otomatis nambahin JWT Token ke setiap request kalau udah login
api.interceptors.request.use((config) => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;

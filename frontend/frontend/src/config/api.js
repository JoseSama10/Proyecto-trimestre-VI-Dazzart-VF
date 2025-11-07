import axios from 'axios';

const api = axios.create({
    baseURL: 'https://ec2-13-222-164-180.compute-1.amazonaws.com:3001',
    headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'https://main.d3t813q1o1kf7z.amplifyapp.com'
    }
});

// Interceptor para incluir el token en las solicitudes
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
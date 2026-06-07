import axios from 'axios';

const api = axios.create({
  baseURL: 'https://turf-management-system-u8ce.onrender.com/api',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('turfpro_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('turfpro_token');
      localStorage.removeItem('turfpro_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

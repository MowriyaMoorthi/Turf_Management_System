import api from './api.js';

export const authService = {
  login: async (email, password) => {
    return await api.post('/auth/login', { email, password });
  },
  register: async (userData) => {
    return await api.post('/auth/register', userData);
  },
  getProfile: async () => {
    return await api.get('/auth/me');
  },
  updateProfile: async (updates) => {
    return await api.put('/auth/profile', updates);
  },
};

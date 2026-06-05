import api from './api.js';

export const SPORTS = ['All', 'Football', 'Cricket', 'Badminton', 'Tennis', 'Futsal', 'Volleyball'];
export const LOCATIONS = ['All', 'Velachery', 'Porur', 'Anna Nagar', 'Adyar', 'Tambaram', 'T. Nagar'];

export const turfService = {
  getAllTurfs: async (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.sport && filters.sport !== 'All') params.set('sport', filters.sport);
    if (filters.location && filters.location !== 'All') params.set('location', filters.location);
    if (filters.search) params.set('search', filters.search);
    if (filters.maxPrice) params.set('maxPrice', filters.maxPrice);
    if (filters.sort) params.set('sort', filters.sort);
    return await api.get('/turfs?' + params.toString());
  },
  getTurfById: async (id) => {
    return await api.get('/turfs/' + id);
  },
  createTurf: async (data) => {
    return await api.post('/turfs', data);
  },
  updateTurf: async (id, data) => {
    return await api.put('/turfs/' + id, data);
  },
  deleteTurf: async (id) => {
    return await api.delete('/turfs/' + id);
  },
  getTurfStats: async () => {
    return await api.get('/turfs/stats');
  },
};

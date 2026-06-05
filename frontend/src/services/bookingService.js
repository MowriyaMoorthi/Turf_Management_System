import api from './api.js';

export const bookingService = {
  createBooking: async (data) => {
    return await api.post('/bookings', {
      turfId: data.turfId,
      date: data.date,
      startTime: data.startTime,
      endTime: data.endTime,
      hours: data.hours,
      userPhone: data.userPhone,
      paymentMethod: data.paymentMethod,
      notes: data.notes,
    });
  },
  getUserBookings: async () => {
    return await api.get('/bookings/my');
  },
  getAllBookings: async () => {
    return await api.get('/bookings');
  },
  getBookingById: async (id) => {
    return await api.get('/bookings/' + id);
  },
  cancelBooking: async (id) => {
    return await api.put('/bookings/' + id + '/cancel');
  },
  getBookedSlots: async (turfId, date) => {
    return await api.get('/bookings/slots?turfId=' + turfId + '&date=' + date);
  },
  getBookingStats: async () => {
    return await api.get('/bookings/stats');
  },
};

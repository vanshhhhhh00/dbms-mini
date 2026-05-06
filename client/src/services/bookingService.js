// ============================================================
// services/bookingService.js - Booking API Calls
// ============================================================

import api from './api';

const bookingService = {
  // Create a booking for an event
  create: async (eventId, tickets) => {
    const response = await api.post('/bookings', { event_id: eventId, tickets });
    return response.data;
  },

  // Get the current user's bookings
  getMyBookings: async () => {
    const response = await api.get('/bookings/my');
    return response.data;
  },

  // Cancel a booking
  cancel: async (bookingId) => {
    const response = await api.put(`/bookings/${bookingId}/cancel`);
    return response.data;
  },

  // Get all bookings (admin only)
  getAll: async () => {
    const response = await api.get('/bookings');
    return response.data;
  },
};

export default bookingService;

// ============================================================
// services/paymentService.js - Payment API Calls
// ============================================================

import api from './api';

const paymentService = {
  // Get all payments (admin only)
  getAll: async () => {
    const response = await api.get('/payments');
    return response.data;
  },

  // Get payment for a specific booking
  getByBooking: async (bookingId) => {
    const response = await api.get(`/payments/booking/${bookingId}`);
    return response.data;
  },
};

export default paymentService;

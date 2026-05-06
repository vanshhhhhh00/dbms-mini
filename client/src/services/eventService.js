// ============================================================
// services/eventService.js - Event API Calls
// ============================================================

import api from './api';

const eventService = {
  // Get all events (public)
  getAll: async () => {
    const response = await api.get('/events');
    return response.data;
  },

  // Get a single event by ID
  getById: async (id) => {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },

  // Get the logged-in organizer's events
  getMyEvents: async () => {
    const response = await api.get('/events/organizer/my-events');
    return response.data;
  },

  // Create a new event (with optional image upload)
  create: async (formData) => {
    const response = await api.post('/events', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Update an event
  update: async (id, formData) => {
    const response = await api.put(`/events/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  // Delete an event
  delete: async (id) => {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  },

  // Get attendees for an event
  getAttendees: async (id) => {
    const response = await api.get(`/events/${id}/attendees`);
    return response.data;
  },
};

export default eventService;

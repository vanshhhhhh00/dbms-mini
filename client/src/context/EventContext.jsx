// ============================================================
// context/EventContext.jsx - Global Event State
// ============================================================

import { createContext, useState, useCallback } from 'react';
import eventService from '../services/eventService';

export const EventContext = createContext(null);

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all events from the API
  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await eventService.getAll();
      setEvents(data.events || []);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load events.');
    } finally {
      setLoading(false);
    }
  }, []);

  const value = {
    events,
    loading,
    error,
    fetchEvents,
    setEvents,
  };

  return (
    <EventContext.Provider value={value}>
      {children}
    </EventContext.Provider>
  );
};

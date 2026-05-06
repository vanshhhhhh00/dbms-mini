// ============================================================
// controllers/eventController.js - Event CRUD Operations
// ============================================================

const EventModel = require('../models/EventModel');

// ============================================================
// GET /api/events
// Get all events (public)
// ============================================================
const getAllEvents = async (req, res) => {
  try {
    const events = await EventModel.getAll();
    res.json({ events });
  } catch (error) {
    console.error('Get events error:', error);
    res.status(500).json({ message: 'Failed to fetch events.' });
  }
};

// ============================================================
// GET /api/events/:id
// Get a single event by ID (public)
// ============================================================
const getEventById = async (req, res) => {
  try {
    const event = await EventModel.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }
    res.json({ event });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch event.' });
  }
};

// ============================================================
// GET /api/events/organizer/my-events
// Get events created by the logged-in organizer
// ============================================================
const getMyEvents = async (req, res) => {
  try {
    const events = await EventModel.getByOrganizer(req.user.id);
    res.json({ events });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch your events.' });
  }
};

// ============================================================
// POST /api/events
// Create a new event (organizer/admin only)
// ============================================================
const createEvent = async (req, res) => {
  try {
    const { title, description, date, location, price, total_seats, category } = req.body;

    // Validate required fields
    if (!title || !date || !location || !total_seats) {
      return res.status(400).json({ message: 'Title, date, location, and total seats are required.' });
    }

    // Check if an image was uploaded
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    const eventData = {
      title,
      description: description || '',
      date,
      location,
      price: price || 0,
      total_seats: parseInt(total_seats),
      category: category || 'General',
      image_url,
      organizer_id: req.user.id,
    };

    const eventId = await EventModel.create(eventData);
    const newEvent = await EventModel.findById(eventId);

    res.status(201).json({ message: 'Event created successfully!', event: newEvent });
  } catch (error) {
    console.error('Create event error:', error);
    res.status(500).json({ message: 'Failed to create event.' });
  }
};

// ============================================================
// PUT /api/events/:id
// Update an event (only by its organizer or admin)
// ============================================================
const updateEvent = async (req, res) => {
  try {
    const event = await EventModel.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    // Ensure the logged-in user is the organizer or an admin
    if (event.organizer_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this event.' });
    }

    const { title, description, date, location, price, total_seats, category } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : event.image_url;

    const updated = await EventModel.update(req.params.id, {
      title: title || event.title,
      description: description || event.description,
      date: date || event.date,
      location: location || event.location,
      price: price !== undefined ? price : event.price,
      total_seats: total_seats || event.total_seats,
      category: category || event.category,
      image_url,
    });

    if (!updated) {
      return res.status(400).json({ message: 'Failed to update event.' });
    }

    const updatedEvent = await EventModel.findById(req.params.id);
    res.json({ message: 'Event updated successfully!', event: updatedEvent });
  } catch (error) {
    console.error('Update event error:', error);
    res.status(500).json({ message: 'Failed to update event.' });
  }
};

// ============================================================
// DELETE /api/events/:id
// Delete an event (only by its organizer or admin)
// ============================================================
const deleteEvent = async (req, res) => {
  try {
    const event = await EventModel.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    // Ensure the logged-in user is the organizer or an admin
    if (event.organizer_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this event.' });
    }

    await EventModel.delete(req.params.id);
    res.json({ message: 'Event deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete event.' });
  }
};

// ============================================================
// GET /api/events/:id/attendees
// Get attendees for an event (organizer/admin only)
// ============================================================
const getAttendees = async (req, res) => {
  try {
    const event = await EventModel.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    if (event.organizer_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized.' });
    }

    const attendees = await EventModel.getAttendees(req.params.id);
    res.json({ attendees });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch attendees.' });
  }
};

module.exports = { getAllEvents, getEventById, getMyEvents, createEvent, updateEvent, deleteEvent, getAttendees };

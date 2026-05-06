// ============================================================
// controllers/bookingController.js - Booking Operations
// ============================================================

const BookingModel = require('../models/BookingModel');
const EventModel = require('../models/EventModel');
const PaymentModel = require('../models/PaymentModel');

// ============================================================
// POST /api/bookings
// Book tickets for an event
// ============================================================
const createBooking = async (req, res) => {
  try {
    const { event_id, tickets } = req.body;

    // Validate input
    if (!event_id || !tickets || tickets < 1) {
      return res.status(400).json({ message: 'Event ID and number of tickets (min 1) are required.' });
    }

    // Check if event exists
    const event = await EventModel.findById(event_id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found.' });
    }

    // Check if enough seats are available
    if (event.available_seats < tickets) {
      return res.status(400).json({ 
        message: `Only ${event.available_seats} seats available.` 
      });
    }

    // Deduct the seats from the event
    const seatsUpdated = await EventModel.decrementSeats(event_id, tickets);
    if (!seatsUpdated) {
      return res.status(400).json({ message: 'Not enough seats. Please try again.' });
    }

    // Create the booking
    const bookingId = await BookingModel.create(req.user.id, event_id, tickets);

    // Calculate total amount and create payment record
    const amount = event.price * tickets;
    await PaymentModel.create(bookingId, amount);

    res.status(201).json({ 
      message: 'Booking confirmed!', 
      bookingId,
      amount,
    });
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ message: 'Failed to create booking.' });
  }
};

// ============================================================
// GET /api/bookings/my
// Get all bookings for the logged-in user
// ============================================================
const getMyBookings = async (req, res) => {
  try {
    const bookings = await BookingModel.getByUser(req.user.id);
    res.json({ bookings });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch bookings.' });
  }
};

// ============================================================
// PUT /api/bookings/:id/cancel
// Cancel a booking
// ============================================================
const cancelBooking = async (req, res) => {
  try {
    const booking = await BookingModel.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found.' });
    }

    // Make sure user owns this booking
    if (booking.user_id !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized to cancel this booking.' });
    }

    // Cancel the booking
    const cancelled = await BookingModel.cancel(req.params.id, req.user.id);
    if (!cancelled) {
      return res.status(400).json({ message: 'Booking is already cancelled or not found.' });
    }

    // Restore the seats
    await EventModel.incrementSeats(booking.event_id, booking.tickets);

    // Mark payment as refunded
    await PaymentModel.updateStatus(req.params.id, 'refunded');

    res.json({ message: 'Booking cancelled successfully.' });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ message: 'Failed to cancel booking.' });
  }
};

// ============================================================
// GET /api/bookings (Admin only)
// Get all bookings
// ============================================================
const getAllBookings = async (req, res) => {
  try {
    const bookings = await BookingModel.getAll();
    res.json({ bookings });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch bookings.' });
  }
};

module.exports = { createBooking, getMyBookings, cancelBooking, getAllBookings };

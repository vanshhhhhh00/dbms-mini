// ============================================================
// controllers/paymentController.js - Payment Operations
// ============================================================

const PaymentModel = require('../models/PaymentModel');

// ============================================================
// GET /api/payments (Admin only)
// Get all payments
// ============================================================
const getAllPayments = async (req, res) => {
  try {
    const payments = await PaymentModel.getAll();
    const totalRevenue = await PaymentModel.getTotalRevenue();
    res.json({ payments, totalRevenue });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch payments.' });
  }
};

// ============================================================
// GET /api/payments/booking/:bookingId
// Get payment for a specific booking
// ============================================================
const getPaymentByBooking = async (req, res) => {
  try {
    const payment = await PaymentModel.getByBookingId(req.params.bookingId);
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found.' });
    }
    res.json({ payment });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch payment.' });
  }
};

module.exports = { getAllPayments, getPaymentByBooking };

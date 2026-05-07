import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, IndianRupee, Users, CheckCircle } from 'lucide-react';
import api from '../services/api';

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [tickets, setTickets] = useState(1);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await api.get(`/events/${id}`);
        setEvent(response.data.event);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching event:', err);
        setError('Failed to load event details.');
        setLoading(false);
      }
    };
    fetchEvent();
  }, [id]);

  const handleBooking = async (e) => {
    e.preventDefault();
    setBookingLoading(true);
    setError('');

    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      // Redirect to login if not authenticated
      navigate('/login');
      return;
    }

    try {
      await api.post('/bookings', {
        event_id: id,
        tickets: parseInt(tickets)
      });
      setSuccess(true);
      setTimeout(() => navigate('/'), 3000); // Redirect after 3 seconds
    } catch (err) {
      console.error('Booking error:', err);
      setError(err.response?.data?.message || 'Failed to book event. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex justify-center items-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-[80vh] flex justify-center items-center">
        <div className="glass-card p-8 text-center text-red-400">
          {error || 'Event not found.'}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8 animate-fade-in relative z-10 pb-20">
      <div className="glass-card overflow-hidden flex flex-col md:flex-row shadow-2xl">
        {/* Left Side: Event Image & Basic Info */}
        <div className="w-full md:w-1/2 relative min-h-[300px] md:min-h-full">
          {event.image_url ? (
            <img 
              src={`http://localhost:5001${event.image_url}`} 
              alt={event.title} 
              className="w-full h-full object-cover absolute inset-0"
              onError={(e) => { e.target.onerror = null; e.target.src = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"; }}
            />
          ) : (
            <img 
              src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
              alt="Event placeholder" 
              className="w-full h-full object-cover absolute inset-0 opacity-60"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-dark-900/60 to-transparent"></div>
          
          <div className="absolute bottom-0 left-0 w-full p-8 text-left">
            <span className="badge-info backdrop-blur-md bg-blue-500/30 border-blue-400/50 mb-4 inline-block">{event.category || 'General'}</span>
            <h1 className="text-3xl font-bold text-white mb-3 leading-tight drop-shadow-lg">{event.title}</h1>
            <p className="text-gray-300 line-clamp-3 text-sm md:text-base leading-relaxed">{event.description}</p>
          </div>
        </div>

        {/* Right Side: Booking Form */}
        <div className="w-full md:w-1/2 p-6 md:p-10 flex flex-col justify-center bg-dark-800/50">
          
          {success ? (
            <div className="text-center animate-slide-up py-8">
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-500/20 mb-6 shadow-lg shadow-green-500/20 border border-green-500/30">
                <CheckCircle className="w-12 h-12 text-green-400" />
              </div>
              <h2 className="text-3xl font-bold text-white mb-3">Booking Confirmed!</h2>
              <p className="text-gray-400 mb-8">You have successfully booked {tickets} ticket(s).</p>
              <p className="text-primary text-sm animate-pulse">Redirecting to home...</p>
            </div>
          ) : (
            <>
              <h2 className="text-2xl font-bold text-white mb-8 border-b border-white/10 pb-4">Booking Details</h2>
              
              <div className="space-y-5 mb-8">
                <div className="flex items-start gap-4 text-gray-300">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center shrink-0 border border-primary/30">
                    <Calendar className="w-5 h-5 text-primary-light" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Date & Time</p>
                    <p className="font-medium">{new Date(event.date).toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 text-gray-300">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center shrink-0 border border-purple-500/30">
                    <MapPin className="w-5 h-5 text-purple-400" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Location</p>
                    <p className="font-medium">{event.location}</p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between border-t border-b border-white/10 py-5 my-6">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Price per ticket</p>
                    <p className="text-2xl font-bold text-white flex items-center"><IndianRupee className="w-5 h-5" />{event.price}</p>
                  </div>
                  <div className="text-right border-l border-white/10 pl-6">
                    <p className="text-gray-400 text-sm mb-1">Available Seats</p>
                    <p className="text-2xl font-bold text-primary">{event.available_seats}</p>
                  </div>
                </div>
              </div>

              {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-lg mb-6 text-sm flex items-center">
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleBooking} className="mt-auto pt-2">
                <div className="mb-6">
                  <label className="form-label flex justify-between mb-2">
                    <span>Number of Tickets</span>
                    <span className="text-gray-500 text-xs mt-1">Max {Math.min(10, event.available_seats)}</span>
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                      <Users className="h-5 w-5" />
                    </div>
                    <input
                      type="number"
                      min="1"
                      max={Math.min(10, event.available_seats)}
                      required
                      className="form-input pl-10 bg-dark-900/80 text-lg border-white/10 focus:border-primary/50"
                      value={tickets}
                      onChange={(e) => setTickets(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between mb-8 bg-dark-900/60 p-4 rounded-xl border border-white/5">
                  <span className="text-gray-300 font-medium">Total Amount</span>
                  <span className="text-3xl font-bold text-white flex items-center">
                    <IndianRupee className="w-6 h-6 mr-1" />
                    {(event.price * tickets).toFixed(2)}
                  </span>
                </div>

                <div className="flex gap-4">
                  <button type="button" onClick={() => navigate('/')} className="btn-secondary flex-1">
                    Cancel
                  </button>
                  <button type="submit" disabled={bookingLoading} className="btn-primary flex-[2] flex justify-center items-center text-lg">
                    {bookingLoading ? (
                      <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      'Confirm Booking'
                    )}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Booking;

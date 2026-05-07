import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Tag, Users, FileText, IndianRupee } from 'lucide-react';
import api from '../services/api';

const CreateEvent = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    price: '',
    total_seats: '',
    category: 'Technology'
  });

  const categories = ['Technology', 'Music', 'Business', 'Food', 'Arts', 'Health', 'General'];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/events', formData);
      console.log('Event created:', response.data);
      navigate('/');
    } catch (err) {
      console.error('Error creating event:', err);
      setError(err.response?.data?.message || 'Failed to create event. Make sure you are an organizer or admin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 md:p-8 animate-fade-in relative z-10 pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Create New Event</h1>
        <p className="text-gray-400">Fill in the details to publish your event to the database.</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-6 py-4 rounded-xl mb-8 flex items-center animate-slide-up">
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="glass-card p-6 md:p-8 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <label className="form-label" htmlFor="title">Event Title</label>
            <input
              id="title" name="title" type="text" required
              className="form-input bg-dark-800/80"
              placeholder="e.g., Tech Summit 2025"
              value={formData.title} onChange={handleChange}
            />
          </div>

          <div className="md:col-span-2">
            <label className="form-label" htmlFor="description">Description</label>
            <div className="relative">
              <div className="absolute top-3 left-3 pointer-events-none text-gray-500">
                <FileText className="h-5 w-5" />
              </div>
              <textarea
                id="description" name="description" rows="4"
                className="form-input pl-10 bg-dark-800/80 resize-none"
                placeholder="What is this event about?"
                value={formData.description} onChange={handleChange}
              ></textarea>
            </div>
          </div>

          <div>
            <label className="form-label" htmlFor="date">Date & Time</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                <Calendar className="h-5 w-5" />
              </div>
              <input
                id="date" name="date" type="datetime-local" required
                className="form-input pl-10 bg-dark-800/80"
                value={formData.date} onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className="form-label" htmlFor="location">Location</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                <MapPin className="h-5 w-5" />
              </div>
              <input
                id="location" name="location" type="text" required
                className="form-input pl-10 bg-dark-800/80"
                placeholder="e.g., Mumbai Convention Center"
                value={formData.location} onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className="form-label" htmlFor="price">Ticket Price (₹)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                <IndianRupee className="h-5 w-5" />
              </div>
              <input
                id="price" name="price" type="number" step="0.01" min="0" required
                className="form-input pl-10 bg-dark-800/80"
                placeholder="0.00 for free events"
                value={formData.price} onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className="form-label" htmlFor="total_seats">Total Seats</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                <Users className="h-5 w-5" />
              </div>
              <input
                id="total_seats" name="total_seats" type="number" min="1" required
                className="form-input pl-10 bg-dark-800/80"
                placeholder="e.g., 200"
                value={formData.total_seats} onChange={handleChange}
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="form-label" htmlFor="category">Category</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                <Tag className="h-5 w-5" />
              </div>
              <select
                id="category" name="category"
                className="form-input pl-10 bg-dark-800/80 appearance-none"
                value={formData.category} onChange={handleChange}
              >
                {categories.map(cat => <option key={cat} value={cat} className="bg-dark-800">{cat}</option>)}
              </select>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-white/10 flex justify-end gap-4 mt-8">
          <button type="button" onClick={() => navigate('/')} className="btn-secondary">
            Cancel
          </button>
          <button type="submit" disabled={loading} className="btn-primary w-40 flex justify-center items-center">
            {loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : 'Save Event'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateEvent;

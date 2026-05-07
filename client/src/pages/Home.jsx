import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, Tag, Search, ArrowRight } from 'lucide-react';
import api from '../services/api';

const Home = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await api.get('/events');
        // The backend returns { events: [...] }
        setEvents(response.data.events || []);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events. Please make sure the backend is running.');
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const filteredEvents = events.filter(event => 
    (event.title && event.title.toLowerCase().includes(searchTerm.toLowerCase())) || 
    (event.category && event.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (event.location && event.location.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen p-6 md:p-12 relative overflow-hidden">
      {/* Decorative background blurs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="absolute top-1/2 left-0 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div className="animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight">Discover Events</h1>
            <p className="text-gray-400 text-lg max-w-2xl">Find and book the best tech conferences, music festivals, and workshops happening around you.</p>
          </div>
          
          <div className="relative w-full md:w-auto animate-fade-in">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
              <Search className="h-5 w-5" />
            </div>
            <input
              type="text"
              className="form-input pl-10 w-full md:w-80 bg-dark-800/80 border-white/10 backdrop-blur-md focus:border-primary/50"
              placeholder="Search events, locations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-6 py-4 rounded-xl mb-8 flex items-center animate-slide-up">
            <span>{error}</span>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="glass-card p-12 text-center animate-slide-up">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-dark-700 mb-4">
              <Search className="w-10 h-10 text-gray-500" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-2">No events found</h3>
            <p className="text-gray-400">Try adjusting your search or check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event, index) => (
              <div 
                key={event.id} 
                className="glass-card group hover:-translate-y-2 transition-all duration-300 overflow-hidden flex flex-col"
                style={{ animation: `slideUp 0.4s ease-out ${index * 0.1}s both` }}
              >
                <div className="h-48 bg-dark-700 relative overflow-hidden">
                  {event.image_url ? (
                    <img 
                      src={`http://localhost:5001${event.image_url}`} 
                      alt={event.title} 
                      className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" 
                      onError={(e) => {
                        e.target.onerror = null; 
                        e.target.src = "https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80";
                      }}
                    />
                  ) : (
                    <img 
                      src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                      alt="Event placeholder" 
                      className="w-full h-full object-cover opacity-60 group-hover:opacity-80 group-hover:scale-105 transition-all duration-500"
                    />
                  )}
                  <div className="absolute top-4 right-4">
                    <span className="badge-info backdrop-blur-md bg-blue-500/30 border-blue-400/50">
                      {event.category || 'General'}
                    </span>
                  </div>
                </div>
                
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-white line-clamp-2 leading-tight">{event.title}</h3>
                  </div>
                  
                  <div className="space-y-3 mb-6 flex-1 text-sm text-gray-300">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                        <Calendar className="w-4 h-4 text-primary-light" />
                      </div>
                      <span>{new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
                        <MapPin className="w-4 h-4 text-purple-400" />
                      </div>
                      <span className="line-clamp-1">{event.location}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                        <Tag className="w-4 h-4 text-green-400" />
                      </div>
                      <span>₹{event.price}</span>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-white/10 flex items-center justify-between mt-auto">
                    <div className="text-sm">
                      <span className="text-gray-400">Available: </span>
                      <span className="font-semibold text-white">{event.available_seats}</span>
                    </div>
                    <Link to={`/book/${event.id}`} className="btn-primary py-2 px-4 text-sm flex items-center gap-2 group-hover:bg-primary-dark">
                      Book Now <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;

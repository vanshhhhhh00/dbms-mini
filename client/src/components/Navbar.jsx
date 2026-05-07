import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CalendarDays, PlusCircle, LogOut, LogIn } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userStr = localStorage.getItem('user');
  const user = userStr ? JSON.parse(userStr) : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav className="glass-card mx-4 mt-4 md:mx-6 md:mt-6 px-6 py-4 sticky top-4 z-50 flex justify-between items-center rounded-2xl animate-fade-in">
      <Link to="/" className="flex items-center gap-3 group">
        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors shadow-lg shadow-primary/10">
          <CalendarDays className="w-6 h-6 text-primary" />
        </div>
        <span className="text-xl font-bold text-white tracking-tight">EventSphere</span>
      </Link>
      
      <div className="flex items-center gap-4">
        {token ? (
          <>
            {(user?.role === 'organizer' || user?.role === 'admin') && (
              <Link to="/create-event" className="btn-secondary hidden md:flex items-center gap-2 py-2 px-4 hover:shadow-lg">
                <PlusCircle className="w-4 h-4" /> Create Event
              </Link>
            )}
            <div className="flex items-center gap-3 ml-2 pl-4 border-l border-white/10">
              <span className="text-sm font-medium text-gray-300 hidden md:block">Hi, {user?.name || 'User'}</span>
              <button onClick={handleLogout} className="p-2 rounded-lg bg-dark-700/50 hover:bg-red-500/20 text-gray-400 hover:text-red-400 transition-colors group" title="Logout">
                <LogOut className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
              </button>
            </div>
          </>
        ) : (
          <Link to="/login" className="btn-primary py-2 px-5 flex items-center gap-2">
            <LogIn className="w-4 h-4" /> Sign In
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

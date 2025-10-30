import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from './ThemeToggle';
import { BookOpen, LogOut, Menu, X } from 'lucide-react';

export default function Navbar() {
  const auth = typeof useAuth === 'function' ? useAuth() : { user: null, logout: () => {} };
  const user = auth?.user || null;
  const logout = auth?.logout || (() => {});
  const navigate = typeof useNavigate === 'function' ? useNavigate() : () => {};
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function handleLogout() {
    try { logout(); } catch (e) {}
    try { navigate('/login'); } catch (e) {}
  }

  const handleGetStarted = () => {
    if (user) {
      // If user is logged in, redirect to appropriate dashboard
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else if (user.role === 'instructor') {
        navigate('/instructor/dashboard');
      } else {
        navigate('/');
      }
    } else {
      // If user is not logged in, redirect to login page
      navigate('/login');
    }
  };

  return (
    <nav className="w-full bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-accent-bluePurple flex items-center justify-center text-white font-bold shadow-soft-1">
              EN
            </div>
            <div className="hidden sm:block">
              <div className="text-lg font-semibold">EduNexus</div>
              <div className="text-xs text-neutral-500">Modern learning platform</div>
            </div>
          </Link>

          <div className="hidden md:flex items-center gap-4">
            <Link className="text-neutral-700 hover:text-primary-700 transition-common" to="/courses">Courses</Link>
            <Link className="text-neutral-700 hover:text-primary-700 transition-common" to="/instructors">Instructors</Link>
            <Link className="text-neutral-700 hover:text-primary-700 transition-common" to="/pricing">Pricing</Link>
            <button className="btn-primary" onClick={handleGetStarted}>Get Started</button>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-lg bg-neutral-100/60 dark:bg-neutral-900/40">
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile */}
      {isMenuOpen && (
        <div className="md:hidden px-4 pb-4">
          <div className="space-y-2">
            <Link to="/courses" className="block py-2">Courses</Link>
            <Link to="/instructors" className="block py-2">Instructors</Link>
            <Link to="/pricing" className="block py-2">Pricing</Link>
            {user ? (
              <>
                <div className="py-2">{user.name}</div>
                <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="w-full text-left py-2">Logout</button>
              </>
            ) : (
              <div className="flex gap-2">
                <Link to="/login" className="py-2">Login</Link>
                <Link to="/register" className="py-2">Register</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, LogOut, Menu, X } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-blue-600 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 text-white">
              <BookOpen size={32} />
              <span className="text-xl font-bold">EduNexus</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  to="/"
                  className="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Courses
                </Link>

                {user.role === 'admin' && (
                  <Link
                    to="/admin/dashboard"
                    className="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Admin Dashboard
                  </Link>
                )}

                {user.role === 'instructor' && (
                  <Link
                    to="/instructor/dashboard"
                    className="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Instructor Dashboard
                  </Link>
                )}

                <div className="flex items-center space-x-3">
                  <span className="text-white text-sm">
                    {user.name}
                    <span className="ml-2 px-2 py-1 bg-blue-800 rounded-full text-xs">
                      {user.role}
                    </span>
                  </span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-1 text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    <LogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-white text-blue-600 hover:bg-gray-100 px-4 py-2 rounded-md text-sm font-medium"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="text-white hover:bg-blue-700 p-2 rounded-md"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-blue-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {user ? (
              <>
                <Link
                  to="/"
                  className="block text-white hover:bg-blue-800 px-3 py-2 rounded-md text-base font-medium"
                  onClick={toggleMenu}
                >
                  Courses
                </Link>

                {user.role === 'admin' && (
                  <Link
                    to="/admin/dashboard"
                    className="block text-white hover:bg-blue-800 px-3 py-2 rounded-md text-base font-medium"
                    onClick={toggleMenu}
                  >
                    Admin Dashboard
                  </Link>
                )}

                {user.role === 'instructor' && (
                  <Link
                    to="/instructor/dashboard"
                    className="block text-white hover:bg-blue-800 px-3 py-2 rounded-md text-base font-medium"
                    onClick={toggleMenu}
                  >
                    Instructor Dashboard
                  </Link>
                )}

                <div className="px-3 py-2 text-white text-sm">
                  {user.name}
                  <span className="ml-2 px-2 py-1 bg-blue-900 rounded-full text-xs">
                    {user.role}
                  </span>
                </div>

                <button
                  onClick={() => {
                    handleLogout();
                    toggleMenu();
                  }}
                  className="w-full text-left text-white hover:bg-blue-800 px-3 py-2 rounded-md text-base font-medium"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block text-white hover:bg-blue-800 px-3 py-2 rounded-md text-base font-medium"
                  onClick={toggleMenu}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block text-white hover:bg-blue-800 px-3 py-2 rounded-md text-base font-medium"
                  onClick={toggleMenu}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
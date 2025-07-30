import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User, FileText, Layout, Settings } from 'lucide-react';
import useAuthStore from '../store/authStore';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <FileText className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">CV Maker</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            {isAuthenticated ? (
              <>
                <Link 
                  to="/dashboard" 
                  className="text-gray-600 hover:text-primary-600 transition-colors"
                >
                  Dashboard
                </Link>
                <Link 
                  to="/templates" 
                  className="text-gray-600 hover:text-primary-600 transition-colors"
                >
                  Templates
                </Link>
                <Link 
                  to="/cv/new" 
                  className="btn btn-primary"
                >
                  Create CV
                </Link>
              </>
            ) : (
              <>
                <Link 
                  to="/templates" 
                  className="text-gray-600 hover:text-primary-600 transition-colors"
                >
                  Templates
                </Link>
                <Link 
                  to="/login" 
                  className="text-gray-600 hover:text-primary-600 transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="btn btn-primary"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* User Menu */}
          {isAuthenticated && (
            <div className="flex items-center space-x-4">
              {/* Premium Badge */}
              {user?.isPremium && (
                <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-2 py-1 rounded-full text-xs font-medium">
                  Premium
                </span>
              )}
              
              {/* User Dropdown */}
              <div className="relative group">
                <button className="flex items-center space-x-2 text-gray-600 hover:text-primary-600 transition-colors">
                  <User className="h-5 w-5" />
                  <span className="hidden md:block">
                    {user?.firstName} {user?.lastName}
                  </span>
                </button>
                
                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <div className="py-1">
                    <Link 
                      to="/profile" 
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Profile Settings
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button className="text-gray-600 hover:text-primary-600">
              <Layout className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
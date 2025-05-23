import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Gift, User, LogOut, LogIn, Settings } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useAdmin } from '../../contexts/AdminContext';

const Navbar: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const { adminState, logout: adminLogout } = useAdmin();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const handleAdminLogout = () => {
    adminLogout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link 
              to="/" 
              className="flex items-center gap-2 font-bold text-2xl text-green-600"
            >
              <Gift className="h-8 w-8 text-red-600" />
              <span className="text-red-600">Mr.</span>
              <span className="text-green-600">BD</span>
            </Link>
          </div>
          
          <div className="flex items-center gap-4">
            {adminState.isAuthenticated && (
              <Link 
                to="/admin/dashboard" 
                className="flex items-center gap-2 text-gray-700 hover:text-green-600 transition-colors"
              >
                <Settings className="h-5 w-5" />
                <span className="hidden sm:inline">Admin Panel</span>
              </Link>
            )}
            
            {currentUser ? (
              <div className="flex items-center gap-4">
                <Link 
                  to="/profile" 
                  className="flex items-center gap-2 text-gray-700 hover:text-green-600 transition-colors"
                >
                  {currentUser.photoURL ? (
                    <img 
                      src={currentUser.photoURL} 
                      alt={currentUser.displayName || 'User'} 
                      className="h-8 w-8 rounded-full"
                    />
                  ) : (
                    <User className="h-5 w-5" />
                  )}
                  <span className="hidden sm:inline">Profile</span>
                </Link>
                
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-gray-700 hover:text-red-600 transition-colors"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <>
                {!adminState.isAuthenticated && (
                  <>
                    <Link 
                      to="/login" 
                      className="flex items-center gap-2 text-gray-700 hover:text-green-600 transition-colors"
                    >
                      <LogIn className="h-5 w-5" />
                      <span className="hidden sm:inline">Login</span>
                    </Link>
                    
                    <Link 
                      to="/admin" 
                      className="flex items-center gap-2 text-gray-700 hover:text-green-600 transition-colors"
                    >
                      <Settings className="h-5 w-5" />
                      <span className="hidden sm:inline">Admin</span>
                    </Link>
                  </>
                )}
              </>
            )}
            
            {adminState.isAuthenticated && (
              <button 
                onClick={handleAdminLogout}
                className="flex items-center gap-2 text-gray-700 hover:text-red-600 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span className="hidden sm:inline">Admin Logout</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
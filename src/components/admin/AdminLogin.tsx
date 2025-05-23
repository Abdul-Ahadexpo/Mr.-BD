import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, User, LogIn } from 'lucide-react';
import { useAdmin } from '../../contexts/AdminContext';
import toast from 'react-hot-toast';

const AdminLogin: React.FC = () => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAdmin();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
      const success = login(password);
      
      if (success) {
        toast.success('Admin login successful');
        navigate('/admin/dashboard');
      } else {
        toast.error('Invalid admin password');
      }
      
      setLoading(false);
    }, 1000); // Simulating a delay
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-green-600 text-white">
        <h2 className="text-xl font-bold flex items-center justify-center">
          <User className="h-5 w-5 mr-2" />
          Admin Access
        </h2>
      </div>
      
      <div className="p-6">
        <div className="flex justify-center mb-6">
          <div className="p-4 rounded-full bg-green-100">
            <Lock className="h-8 w-8 text-green-600" />
          </div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">
              Admin Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter admin password"
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-md font-semibold transition-colors duration-300 flex items-center justify-center ${
              loading ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Verifying...
              </>
            ) : (
              <>
                <LogIn className="h-5 w-5 mr-2" />
                Login as Admin
              </>
            )}
          </button>
        </form>
        
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Access to this area is restricted to administrators only.</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
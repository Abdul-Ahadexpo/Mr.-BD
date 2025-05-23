import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Home } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-red-600 text-white flex justify-center">
        <h2 className="text-xl font-bold flex items-center">
          <AlertTriangle className="h-5 w-5 mr-2" />
          Page Not Found
        </h2>
      </div>
      
      <div className="p-6 text-center">
        <div className="text-9xl font-bold text-red-600 mb-4">404</div>
        <h3 className="text-2xl font-semibold text-gray-800 mb-4">
          Oops! Page not found
        </h3>
        <p className="text-gray-600 mb-6">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <button 
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors inline-flex items-center gap-2"
        >
          <Home className="h-5 w-5" />
          Go to Homepage
        </button>
      </div>
    </div>
  );
};

export default NotFoundPage;
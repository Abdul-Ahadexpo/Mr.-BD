import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogIn, Gift } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const LoginPage: React.FC = () => {
  const { currentUser, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Check if there's a redirect path in location state
  const from = location.state?.from || '/';
  
  useEffect(() => {
    if (currentUser) {
      navigate(from);
    }
  }, [currentUser, navigate, from]);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      toast.success('Login successful!');
      navigate(from);
    } catch (error) {
      console.error('Error signing in with Google:', error);
      toast.error('Failed to sign in with Google');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-green-600 text-white">
        <h2 className="text-xl font-bold flex items-center justify-center">
          <LogIn className="h-5 w-5 mr-2" />
          Login to Participate
        </h2>
      </div>
      
      <div className="p-6">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="h-16 w-16 bg-red-100 rounded-full flex items-center justify-center">
              <Gift className="h-8 w-8 text-red-600" />
            </div>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Welcome to <span className="text-red-600">Mr.</span><span className="text-green-600">BD</span>
          </h3>
          <p className="text-gray-600">
            Login to participate in giveaways and track your entries
          </p>
        </div>
        
        <div className="space-y-4">
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M23.7663 12.2764C23.7663 11.4607 23.7001 10.6406 23.559 9.83807H12.2402V14.4591H18.722C18.453 15.9494 17.5888 17.2678 16.3233 18.1056V21.1039H20.1903C22.4611 19.0139 23.7663 15.9274 23.7663 12.2764Z" fill="#4285F4"/>
              <path d="M12.2401 24.0008C15.4766 24.0008 18.2059 22.9382 20.1945 21.1039L16.3276 18.1055C15.2517 18.8375 13.8627 19.252 12.2445 19.252C9.11388 19.252 6.45946 17.1399 5.5066 14.3003H1.5083V17.3912C3.55239 21.4434 7.7029 24.0008 12.2401 24.0008Z" fill="#34A853"/>
              <path d="M5.50253 14.3003C4.99987 12.8099 4.99987 11.1961 5.50253 9.70575V6.61481H1.50428C-0.18125 10.0056 -0.18125 14.0004 1.50428 17.3912L5.50253 14.3003Z" fill="#FBBC05"/>
              <path d="M12.2401 4.74966C13.9509 4.7232 15.6044 5.36697 16.8434 6.54867L20.2695 3.12262C18.1001 1.0855 15.2208 -0.034466 12.2401 0.000808666C7.7029 0.000808666 3.55239 2.55822 1.5083 6.61481L5.50655 9.70575C6.45892 6.86173 9.1133 4.74966 12.2401 4.74966Z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>
        </div>
        
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
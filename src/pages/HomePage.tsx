import React from 'react';
import { Link } from 'react-router-dom';
import { Gift, Award, Shield, User } from 'lucide-react';
import GiveawayList from '../components/public/GiveawayList';

const HomePage: React.FC = () => {
  return (
    <div>
      {/* Hero section */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-red-500">Win Amazing Prizes</span> with Mr.BD!
            </h1>
            <p className="text-xl max-w-3xl mx-auto mb-8">
              Join the biggest giveaway platform in Bangladesh and get a chance to win exclusive prizes, gadgets, and much more!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/giveaways"
                className="px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-300 font-semibold flex items-center justify-center gap-2"
              >
                <Gift className="h-5 w-5" />
                <span>Browse Giveaways</span>
              </Link>
              <Link 
                to="/login"
                className="px-6 py-3 bg-white text-green-700 rounded-md hover:bg-gray-100 transition-colors duration-300 font-semibold flex items-center justify-center gap-2"
              >
                <User className="h-5 w-5" />
                <span>Login to Participate</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features section */}
      <div className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Why Choose <span className="text-red-600">Mr.</span><span className="text-green-600">BD</span>?
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
              <div className="mx-auto h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <Gift className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Exciting Prizes</h3>
              <p className="text-gray-600">
                Win amazing products, gadgets, and exclusive items from top brands in Bangladesh.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
              <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <Award className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Simple Participation</h3>
              <p className="text-gray-600">
                Easy entry process with just a few steps. Login, fill out a simple form, and you're in!
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg transition-shadow">
              <div className="mx-auto h-16 w-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <Shield className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">100% Trustworthy</h3>
              <p className="text-gray-600">
                Fully transparent giveaway process with real winners and verifiable results.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Recent giveaways section */}
      <div className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-2 text-gray-800">
            Current Giveaways
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Check out our latest giveaways and participate for a chance to win amazing prizes. New giveaways are added regularly!
          </p>
          
          <GiveawayList />
        </div>
      </div>
      
      {/* CTA section */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Win?</h2>
          <p className="text-xl max-w-3xl mx-auto mb-8">
            Join thousands of winners from across Bangladesh. Sign up now and start participating in our exciting giveaways!
          </p>
          <Link 
            to="/login"
            className="px-6 py-3 bg-white text-red-600 rounded-md hover:bg-gray-100 transition-colors duration-300 font-semibold inline-flex items-center gap-2"
          >
            <User className="h-5 w-5" />
            <span>Create an Account</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
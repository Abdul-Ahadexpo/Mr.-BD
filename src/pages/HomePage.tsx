import React from 'react';
import { Link } from 'react-router-dom';
import { Gift, Award, Shield, User } from 'lucide-react';
import GiveawayList from '../components/public/GiveawayList';

const HomePage: React.FC = () => {
  return (
    <div>
      {/* Hero section */}
      <div className="bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              <span className="text-yellow-200">Win Amazing Prizes</span> with Mr.BD! ✨
            </h1>
            <p className="text-xl max-w-3xl mx-auto mb-8">
              Join the biggest giveaway platform in Bangladesh and get a chance to win exclusive prizes, gadgets, and much more! 🎁
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/giveaways"
                className="px-6 py-3 bg-pink-500 text-white rounded-full hover:bg-pink-600 transition-all duration-300 transform hover:scale-105 font-semibold flex items-center justify-center gap-2 shadow-lg"
              >
                <Gift className="h-5 w-5" />
                <span>Browse Giveaways</span>
              </Link>
              <Link 
                to="/login"
                className="px-6 py-3 bg-white text-purple-600 rounded-full hover:bg-purple-50 transition-all duration-300 transform hover:scale-105 font-semibold flex items-center justify-center gap-2 shadow-lg"
              >
                <User className="h-5 w-5" />
                <span>Join Now</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features section */}
      <div className="py-12 bg-gradient-to-b from-pink-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-purple-800">
            Why Choose <span className="text-pink-500">Mr.</span><span className="text-purple-500">BD</span>? ✨
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl shadow-md text-center hover:shadow-lg transition-all duration-300 transform hover:scale-105 border-2 border-pink-100">
              <div className="mx-auto h-16 w-16 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center mb-4">
                <Gift className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-purple-800">Exciting Prizes</h3>
              <p className="text-gray-600">
                Win amazing products, gadgets, and exclusive items from top brands in Bangladesh.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-md text-center hover:shadow-lg transition-all duration-300 transform hover:scale-105 border-2 border-pink-100">
              <div className="mx-auto h-16 w-16 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center mb-4">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-purple-800">Simple Participation</h3>
              <p className="text-gray-600">
                Easy entry process with just a few steps. Login, fill out a simple form, and you're in!
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-md text-center hover:shadow-lg transition-all duration-300 transform hover:scale-105 border-2 border-pink-100">
              <div className="mx-auto h-16 w-16 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-purple-800">100% Trustworthy</h3>
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
          <h2 className="text-3xl font-bold text-center mb-2 text-purple-800">
            Current Giveaways ✨
          </h2>
          <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
            Check out our latest giveaways and participate for a chance to win amazing prizes. New giveaways are added regularly!
          </p>
          
          <GiveawayList />
        </div>
      </div>
      
      {/* CTA section */}
      <div className="bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Win? ✨</h2>
          <p className="text-xl max-w-3xl mx-auto mb-8">
            Join thousands of winners from across Bangladesh. Sign up now and start participating in our exciting giveaways!
          </p>
          <Link 
            to="/login"
            className="px-6 py-3 bg-white text-purple-600 rounded-full hover:bg-purple-50 transition-all duration-300 transform hover:scale-105 font-semibold inline-flex items-center gap-2 shadow-lg"
          >
            <User className="h-5 w-5" />
            <span>Join Now</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
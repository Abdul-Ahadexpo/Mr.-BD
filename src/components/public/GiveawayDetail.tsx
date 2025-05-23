import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ref, onValue } from 'firebase/database';
import { Gift, Calendar, Clock, ChevronLeft, Award } from 'lucide-react';
import { database } from '../../firebase/config';
import { Giveaway } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import ImageGallery from '../common/ImageGallery';
import Countdown from '../common/Countdown';

const GiveawayDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [giveaway, setGiveaway] = useState<Giveaway | null>(null);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) return;

    const giveawayRef = ref(database, `giveaways/${id}`);
    
    const fetchGiveaway = () => {
      onValue(giveawayRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          setGiveaway({
            id,
            ...data
          });
        } else {
          setGiveaway(null);
        }
        setLoading(false);
      });
    };

    fetchGiveaway();
  }, [id]);

  const handleParticipate = () => {
    if (!currentUser) {
      navigate('/login', { state: { from: `/giveaway/${id}` } });
    } else {
      navigate(`/giveaway/${id}/entry`);
    }
  };

  const isActive = giveaway?.active && (!giveaway.endDate || giveaway.endDate > Date.now());

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!giveaway) {
    return (
      <div className="text-center py-12">
        <Gift className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-700">Giveaway Not Found</h3>
        <p className="text-gray-500 mt-2">The giveaway you're looking for doesn't exist or has been removed.</p>
        <button 
          onClick={() => navigate('/')}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors inline-flex items-center"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-green-600 text-white flex justify-between items-center">
        <h2 className="text-2xl font-bold flex items-center">
          <Gift className="h-6 w-6 mr-2" />
          {giveaway.title}
        </h2>
        {isActive ? (
          <span className="bg-white text-green-600 text-sm px-3 py-1 rounded-full font-semibold">
            Active
          </span>
        ) : (
          <span className="bg-white text-red-600 text-sm px-3 py-1 rounded-full font-semibold">
            Ended
          </span>
        )}
      </div>
      
      <div className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <ImageGallery 
              images={giveaway.images} 
              className="rounded-lg overflow-hidden shadow-sm mb-4"
            />
            
            <div className="flex items-center text-gray-600 mb-4">
              <Calendar className="h-5 w-5 mr-2" />
              <span>
                Posted on {new Date(giveaway.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
            
            {giveaway.endDate && (
              <Countdown 
                targetDate={giveaway.endDate} 
                onComplete={() => {
                  // This could refresh the page or change state to show it's ended
                  console.log('Giveaway ended!');
                }}
              />
            )}
          </div>
          
          <div>
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3 text-gray-800">About this Giveaway</h3>
              <p className="text-gray-700 whitespace-pre-line">{giveaway.description}</p>
            </div>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-3 text-gray-800 flex items-center">
                <Award className="h-5 w-5 mr-2 text-red-600" />
                Rules & Requirements
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-gray-700 whitespace-pre-line">{giveaway.rules}</p>
              </div>
            </div>
            
            {isActive && (
              <button
                onClick={handleParticipate}
                className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors duration-300 flex items-center justify-center"
              >
                <Gift className="h-5 w-5 mr-2" />
                Participate Now
              </button>
            )}
            
            {!isActive && (
              <div className="bg-gray-100 p-4 rounded-lg text-center">
                <Clock className="h-6 w-6 mx-auto mb-2 text-gray-500" />
                <p className="text-gray-700 font-medium">This giveaway has ended</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GiveawayDetail;
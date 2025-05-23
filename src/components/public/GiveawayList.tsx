import React, { useEffect, useState } from 'react';
import { ref, onValue, query, orderByChild, equalTo } from 'firebase/database';
import { database } from '../../firebase/config';
import { Giveaway } from '../../types';
import GiveawayCard from '../common/GiveawayCard';
import { Gift } from 'lucide-react';

const GiveawayList: React.FC = () => {
  const [giveaways, setGiveaways] = useState<Giveaway[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<boolean | null>(null);

  useEffect(() => {
    const giveawaysRef = ref(database, 'giveaways');
    
    const fetchGiveaways = () => {
      onValue(giveawaysRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const giveawaysList = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
          }));
          
          // Sort by creation date, newest first
          giveawaysList.sort((a, b) => b.createdAt - a.createdAt);
          
          setGiveaways(giveawaysList);
        } else {
          setGiveaways([]);
        }
        setLoading(false);
      });
    };

    fetchGiveaways();
    
    return () => {
      // This is the cleanup function
      // No need to unsubscribe as onValue already returns the unsubscribe function
    };
  }, []);

  const filteredGiveaways = activeFilter === null 
    ? giveaways 
    : giveaways.filter(giveaway => 
        giveaway.active === activeFilter && 
        (!giveaway.endDate || giveaway.endDate > Date.now())
      );

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (giveaways.length === 0) {
    return (
      <div className="text-center py-12">
        <Gift className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-gray-700">No Giveaways Available</h3>
        <p className="text-gray-500 mt-2">Check back soon for new exciting giveaways!</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-center mb-6 gap-4">
        <button
          onClick={() => setActiveFilter(null)}
          className={`px-4 py-2 rounded-md ${
            activeFilter === null 
              ? 'bg-green-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          } transition-colors`}
        >
          All
        </button>
        <button
          onClick={() => setActiveFilter(true)}
          className={`px-4 py-2 rounded-md ${
            activeFilter === true 
              ? 'bg-green-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          } transition-colors`}
        >
          Active
        </button>
        <button
          onClick={() => setActiveFilter(false)}
          className={`px-4 py-2 rounded-md ${
            activeFilter === false 
              ? 'bg-green-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          } transition-colors`}
        >
          Ended
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGiveaways.map(giveaway => (
          <GiveawayCard key={giveaway.id} giveaway={giveaway} />
        ))}
      </div>
      
      {filteredGiveaways.length === 0 && (
        <div className="text-center py-12">
          <Gift className="h-12 w-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-700">No giveaways match your filter</h3>
          <p className="text-gray-500 mt-1">Try changing your filter options</p>
        </div>
      )}
    </div>
  );
};

export default GiveawayList;
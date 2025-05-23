import React from 'react';
import { Link } from 'react-router-dom';
import { Gift, Calendar } from 'lucide-react';
import { Giveaway } from '../../types';
import ImageGallery from './ImageGallery';

interface GiveawayCardProps {
  giveaway: Giveaway;
}

const GiveawayCard: React.FC<GiveawayCardProps> = ({ giveaway }) => {
  const isActive = giveaway.active && (!giveaway.endDate || giveaway.endDate > Date.now());
  
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300">
      <ImageGallery 
        images={giveaway.images} 
        className="h-48"
      />
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-bold text-gray-800 truncate">{giveaway.title}</h3>
          {isActive ? (
            <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-semibold">
              Active
            </span>
          ) : (
            <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full font-semibold">
              Ended
            </span>
          )}
        </div>
        
        <p className="text-gray-600 mb-4 line-clamp-2">{giveaway.description}</p>
        
        <div className="flex items-center text-gray-500 text-sm mb-4">
          <Calendar className="h-4 w-4 mr-1" />
          <span>
            {new Date(giveaway.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </span>
        </div>
        
        <Link 
          to={`/giveaway/${giveaway.id}`}
          className="block w-full text-center bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-md transition-colors duration-300 font-medium flex items-center justify-center gap-2"
        >
          <Gift className="h-5 w-5" />
          <span>View Details</span>
        </Link>
      </div>
    </div>
  );
};

export default GiveawayCard;
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, onValue } from 'firebase/database';
import { database } from '../../firebase/config';
import { useAuth } from '../../contexts/AuthContext';
import { User, Gift, MessageSquare, LogOut } from 'lucide-react';
import { GiveawayEntry } from '../../types';

const UserProfile: React.FC = () => {
  const { currentUser, userProfile, logout } = useAuth();
  const [entries, setEntries] = useState<GiveawayEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const userEntriesRef = ref(database, `users/${currentUser.uid}/entries`);
    
    const fetchEntries = () => {
      onValue(userEntriesRef, (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.val();
          const entriesList = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
          }));
          
          // Sort by submission date, newest first
          entriesList.sort((a, b) => b.submittedAt - a.submittedAt);
          
          setEntries(entriesList);
        } else {
          setEntries([]);
        }
        setLoading(false);
      });
    };

    fetchEntries();
  }, [currentUser, navigate]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (!currentUser || !userProfile) {
    return null; // Will redirect from useEffect
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="md:col-span-1">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 bg-green-600 text-white">
            <h2 className="text-xl font-bold flex items-center">
              <User className="h-5 w-5 mr-2" />
              Profile
            </h2>
          </div>
          
          <div className="p-6">
            <div className="flex flex-col items-center">
              {userProfile.photoURL ? (
                <img 
                  src={userProfile.photoURL} 
                  alt={userProfile.displayName} 
                  className="h-24 w-24 rounded-full mb-4"
                />
              ) : (
                <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                  <User className="h-12 w-12 text-gray-500" />
                </div>
              )}
              
              <h3 className="text-xl font-semibold text-gray-800">
                {userProfile.displayName}
              </h3>
              
              <p className="text-gray-600 mb-6">
                {userProfile.email}
              </p>
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div className="md:col-span-2">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 bg-green-600 text-white">
            <h2 className="text-xl font-bold flex items-center">
              <Gift className="h-5 w-5 mr-2" />
              My Giveaway Entries
            </h2>
          </div>
          
          <div className="p-6">
            {loading ? (
              <div className="flex justify-center items-center min-h-[200px]">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-600"></div>
              </div>
            ) : entries.length > 0 ? (
              <div className="space-y-6">
                {entries.map(entry => (
                  <div key={entry.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {entry.giveawayTitle || 'Giveaway Entry'}
                      </h3>
                      <span className="text-sm text-gray-500">
                        {new Date(entry.submittedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                      <div>
                        <p className="text-sm text-gray-600">Full Name</p>
                        <p className="font-medium">{entry.fullName}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Phone Number</p>
                        <p className="font-medium">{entry.phoneNumber}</p>
                      </div>
                      <div className="md:col-span-2">
                        <p className="text-sm text-gray-600">Location</p>
                        <p className="font-medium">{entry.location}</p>
                      </div>
                    </div>
                    
                    <div className="bg-green-50 p-3 rounded-md">
                      <div className="flex items-start gap-2">
                        <MessageSquare className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                        <p className="text-green-800">{entry.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Gift className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-gray-700">No Entries Yet</h3>
                <p className="text-gray-500 mt-1">You haven't entered any giveaways</p>
                <button 
                  onClick={() => navigate('/')}
                  className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  Browse Giveaways
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
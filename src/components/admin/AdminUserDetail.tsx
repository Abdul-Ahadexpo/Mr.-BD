import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ref, onValue } from 'firebase/database';
import { database } from '../../firebase/config';
import { useAdmin } from '../../contexts/AdminContext';
import { ArrowLeft, User, Gift, Calendar, MessageSquare } from 'lucide-react';
import { UserProfile, GiveawayEntry } from '../../types';

const AdminUserDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { adminState } = useAdmin();
  const navigate = useNavigate();
  
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [entries, setEntries] = useState<GiveawayEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!adminState.isAuthenticated) {
      navigate('/admin');
      return;
    }

    if (!id) return;

    const userRef = ref(database, `users/${id}`);
    
    const fetchUserData = () => {
      onValue(userRef, (snapshot) => {
        if (snapshot.exists()) {
          const userData = snapshot.val();
          setUserProfile(userData);
          
          // Extract entries
          if (userData.entries) {
            const entriesList = Object.keys(userData.entries).map(key => ({
              id: key,
              ...userData.entries[key]
            }));
            
            // Sort by submission date, newest first
            entriesList.sort((a, b) => b.submittedAt - a.submittedAt);
            
            setEntries(entriesList);
          } else {
            setEntries([]);
          }
        } else {
          setUserProfile(null);
          setEntries([]);
        }
        
        setLoading(false);
      });
    };

    fetchUserData();
  }, [id, adminState, navigate]);

  if (!adminState.isAuthenticated) {
    return null; // Will redirect from useEffect
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-green-600 text-white flex justify-between items-center">
        <h2 className="text-xl font-bold flex items-center">
          <User className="h-5 w-5 mr-2" />
          User Profile
        </h2>
        
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="bg-white text-green-600 px-3 py-1 rounded-md hover:bg-green-50 transition-colors flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </button>
      </div>
      
      <div className="p-6">
        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-600"></div>
          </div>
        ) : userProfile ? (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="flex-shrink-0">
                {userProfile.photoURL ? (
                  <img 
                    src={userProfile.photoURL} 
                    alt={userProfile.displayName} 
                    className="h-24 w-24 rounded-full"
                  />
                ) : (
                  <div className="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="h-12 w-12 text-gray-500" />
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="text-2xl font-semibold text-gray-800">
                  {userProfile.displayName}
                </h3>
                
                <p className="text-gray-600 mb-2">
                  {userProfile.email}
                </p>
                
                <div className="flex items-center text-gray-500 text-sm">
                  <Gift className="h-4 w-4 mr-1" />
                  <span>
                    {entries.length} Giveaway {entries.length === 1 ? 'Entry' : 'Entries'}
                  </span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-4">
                Participation History
              </h4>
              
              {entries.length > 0 ? (
                <div className="space-y-4">
                  {entries.map(entry => (
                    <div key={entry.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <h5 className="text-base font-semibold text-gray-800">
                          {entry.giveawayTitle || 'Giveaway Entry'}
                        </h5>
                        <span className="text-sm text-gray-500 flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
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
                      
                      <div className="bg-gray-50 p-3 rounded-md">
                        <div className="flex items-start gap-2">
                          <MessageSquare className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                          <p className="text-gray-700">{entry.message}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <Gift className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-lg font-semibold text-gray-700">No Entries Found</h3>
                  <p className="text-gray-500 mt-1">This user hasn't participated in any giveaways yet</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-700">User Not Found</h3>
            <p className="text-gray-500 mt-1">The user you're looking for doesn't exist</p>
            <button 
              onClick={() => navigate('/admin/dashboard')}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Return to Dashboard
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminUserDetail;
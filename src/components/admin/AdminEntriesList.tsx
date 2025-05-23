import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ref, onValue, get } from 'firebase/database';
import { database } from '../../firebase/config';
import { useAdmin } from '../../contexts/AdminContext';
import { ArrowLeft, User, Search, Phone, MapPin, Calendar } from 'lucide-react';
import { Giveaway, GiveawayEntry } from '../../types';

const AdminEntriesList: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { adminState } = useAdmin();
  const navigate = useNavigate();
  
  const [giveaway, setGiveaway] = useState<Giveaway | null>(null);
  const [entries, setEntries] = useState<GiveawayEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!adminState.isAuthenticated) {
      navigate('/admin');
      return;
    }

    if (!id) return;

    const fetchData = async () => {
      try {
        // Fetch giveaway details
        const giveawaySnapshot = await get(ref(database, `giveaways/${id}`));
        
        if (!giveawaySnapshot.exists()) {
          navigate('/admin/dashboard');
          return;
        }
        
        const giveawayData = {
          id,
          ...giveawaySnapshot.val()
        };
        
        setGiveaway(giveawayData);
        
        // Check if giveaway has entries
        if (!giveawayData.entries) {
          setEntries([]);
          setLoading(false);
          return;
        }
        
        // Fetch all entries for this giveaway
        const entriesPromises = Object.keys(giveawayData.entries).map(async (entryId) => {
          const entrySnapshot = await get(ref(database, `entries/${entryId}`));
          return entrySnapshot.exists() ? entrySnapshot.val() : null;
        });
        
        const entriesData = await Promise.all(entriesPromises);
        const validEntries = entriesData.filter(Boolean);
        
        // Sort by submission date, newest first
        validEntries.sort((a, b) => b.submittedAt - a.submittedAt);
        
        setEntries(validEntries);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, [id, adminState, navigate]);

  const filteredEntries = entries.filter(entry => 
    entry.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    entry.phoneNumber.includes(searchTerm)
  );

  if (!adminState.isAuthenticated) {
    return null; // Will redirect from useEffect
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-green-600 text-white flex justify-between items-center">
        <h2 className="text-xl font-bold flex items-center">
          <User className="h-5 w-5 mr-2" />
          {giveaway ? `Entries for: ${giveaway.title}` : 'Giveaway Entries'}
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
        <div className="mb-4 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="Search entries by name, location or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-600"></div>
          </div>
        ) : filteredEntries.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Participant
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Contact
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredEntries.map(entry => (
                  <tr key={entry.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-gray-500" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{entry.fullName}</div>
                          <div className="text-sm text-gray-500">User ID: {entry.userId.substring(0, 8)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <Phone className="h-4 w-4 mr-1 text-gray-400" />
                        {entry.phoneNumber}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 flex items-start">
                        <MapPin className="h-4 w-4 mr-1 text-gray-400 mt-0.5 flex-shrink-0" />
                        <span className="line-clamp-2">{entry.location}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-gray-400" />
                        {new Date(entry.submittedAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/admin/user/${entry.userId}`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        View Profile
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <User className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-gray-700">No Entries Found</h3>
            <p className="text-gray-500 mt-1">
              {searchTerm ? 'No entries match your search' : 'This giveaway has no entries yet'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminEntriesList;
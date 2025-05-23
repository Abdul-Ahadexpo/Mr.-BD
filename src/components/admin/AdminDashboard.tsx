import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ref, onValue } from 'firebase/database';
import { database } from '../../firebase/config';
import { useAdmin } from '../../contexts/AdminContext';
import { 
  Gift, 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Check, 
  X,
  Search
} from 'lucide-react';
import { Giveaway } from '../../types';
import AdminGiveawayForm from './AdminGiveawayForm';
import AdminEntriesList from './AdminEntriesList';

const AdminDashboard: React.FC = () => {
  const { adminState } = useAdmin();
  const navigate = useNavigate();
  
  const [giveaways, setGiveaways] = useState<Giveaway[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingGiveaway, setEditingGiveaway] = useState<Giveaway | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!adminState.isAuthenticated) {
      navigate('/admin');
      return;
    }

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
  }, [adminState, navigate]);

  const handleAddGiveaway = () => {
    setEditingGiveaway(null);
    setShowAddForm(true);
  };

  const handleEditGiveaway = (giveaway: Giveaway) => {
    setEditingGiveaway(giveaway);
    setShowAddForm(true);
  };

  const handleFormClose = () => {
    setShowAddForm(false);
    setEditingGiveaway(null);
  };

  const filteredGiveaways = giveaways.filter(giveaway => 
    giveaway.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    giveaway.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!adminState.isAuthenticated) {
    return null; // Will redirect from useEffect
  }

  if (showAddForm) {
    return (
      <AdminGiveawayForm 
        giveaway={editingGiveaway} 
        onClose={handleFormClose}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 bg-green-600 text-white flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center">
            <Gift className="h-5 w-5 mr-2" />
            Manage Giveaways
          </h2>
          
          <button
            onClick={handleAddGiveaway}
            className="bg-white text-green-600 px-3 py-1 rounded-md hover:bg-green-50 transition-colors flex items-center gap-1"
          >
            <Plus className="h-4 w-4" />
            <span>Add New</span>
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
              placeholder="Search giveaways..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center min-h-[200px]">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-green-600"></div>
            </div>
          ) : filteredGiveaways.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Title
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Entries
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredGiveaways.map(giveaway => {
                    const isActive = giveaway.active && (!giveaway.endDate || giveaway.endDate > Date.now());
                    const entryCount = giveaway.entries ? Object.keys(giveaway.entries).length : 0;
                    
                    return (
                      <tr key={giveaway.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="text-sm font-medium text-gray-900">
                              {giveaway.title}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {new Date(giveaway.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {isActive ? (
                              <div className="flex items-center">
                                <Check className="h-3 w-3 mr-1" />
                                Active
                              </div>
                            ) : (
                              <div className="flex items-center">
                                <X className="h-3 w-3 mr-1" />
                                Inactive
                              </div>
                            )}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1 text-gray-400" />
                            {entryCount}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <Link
                              to={`/admin/entries/${giveaway.id}`}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              <Eye className="h-5 w-5" />
                            </Link>
                            <button
                              onClick={() => handleEditGiveaway(giveaway)}
                              className="text-green-600 hover:text-green-900"
                            >
                              <Edit className="h-5 w-5" />
                            </button>
                            <button
                              className="text-red-600 hover:text-red-900"
                            >
                              <Trash2 className="h-5 w-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8">
              <Gift className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-lg font-semibold text-gray-700">No Giveaways Found</h3>
              <p className="text-gray-500 mt-1">
                {searchTerm ? 'No giveaways match your search' : 'Start by adding your first giveaway'}
              </p>
              <button 
                onClick={handleAddGiveaway}
                className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors inline-flex items-center"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Giveaway
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
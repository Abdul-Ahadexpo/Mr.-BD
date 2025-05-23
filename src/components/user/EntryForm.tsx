import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ref, get, update, push } from 'firebase/database';
import { database } from '../../firebase/config';
import { useAuth } from '../../contexts/AuthContext';
import { Gift, User, MapPin, Phone, Send } from 'lucide-react';
import { Giveaway, GiveawayEntry } from '../../types';
import toast from 'react-hot-toast';

const EntryForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [giveaway, setGiveaway] = useState<Giveaway | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    location: '',
    phoneNumber: ''
  });

  useEffect(() => {
    if (!id || !currentUser) return;

    const fetchData = async () => {
      try {
        const giveawaySnapshot = await get(ref(database, `giveaways/${id}`));
        
        if (!giveawaySnapshot.exists()) {
          toast.error('Giveaway not found');
          navigate('/');
          return;
        }
        
        const giveawayData = {
          id,
          ...giveawaySnapshot.val()
        };
        
        if (!giveawayData.active || (giveawayData.endDate && giveawayData.endDate < Date.now())) {
          toast.error('This giveaway has ended');
          navigate(`/giveaway/${id}`);
          return;
        }
        
        setGiveaway(giveawayData);
        
        const userEntriesSnapshot = await get(ref(database, `users/${currentUser.uid}/entries`));
        if (userEntriesSnapshot.exists()) {
          const entries = userEntriesSnapshot.val();
          const hasUserEntered = Object.values(entries).some(
            (entry: any) => entry.giveawayId === id
          );
          
          if (hasUserEntered) {
            setHasEntered(true);
            toast.error('You have already entered this giveaway');
            navigate(`/giveaway/${id}`);
            return;
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load giveaway');
        navigate('/');
      }
    };

    fetchData();
  }, [id, currentUser, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser || !giveaway || !id) return;
    
    setSubmitting(true);
    
    try {
      const entryData: Omit<GiveawayEntry, 'id'> = {
        giveawayId: id,
        userId: currentUser.uid,
        fullName: formData.fullName,
        location: formData.location,
        phoneNumber: formData.phoneNumber,
        message: `Thank you for entering the "${giveaway.title}" giveaway! Your entry has been received. To increase your chances of winning, make sure to follow our social media accounts and stay tuned for the announcement.`,
        submittedAt: Date.now(),
        giveawayTitle: giveaway.title
      };
      
      const newEntryRef = push(ref(database, 'entries'));
      const entryId = newEntryRef.key;
      
      if (!entryId) {
        throw new Error('Failed to generate entry ID');
      }
      
      const updates: Record<string, any> = {};
      
      updates[`entries/${entryId}`] = {
        ...entryData,
        id: entryId
      };
      
      updates[`users/${currentUser.uid}/entries/${entryId}`] = {
        ...entryData,
        id: entryId
      };
      
      updates[`giveaways/${id}/entries/${entryId}`] = true;
      
      await update(ref(database), updates);
      
      toast.success('Entry submitted successfully!');
      navigate(`/profile`);
    } catch (error) {
      console.error('Error submitting entry:', error);
      toast.error('Failed to submit entry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!giveaway || hasEntered) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 bg-green-600 text-white">
        <h2 className="text-xl font-bold flex items-center">
          <Gift className="h-5 w-5 mr-2" />
          Enter Giveaway: {giveaway.title}
        </h2>
      </div>
      
      <div className="p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2 flex items-center">
              <User className="h-4 w-4 mr-2" />
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter your full name"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2 flex items-center">
              <MapPin className="h-4 w-4 mr-2" />
              Exact Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter your full address"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2 flex items-center">
              <Phone className="h-4 w-4 mr-2" />
              Phone Number
            </label>
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Enter your phone number"
            />
          </div>
          
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
            <p className="text-yellow-800">
              By submitting this form, you agree to the rules of this giveaway and our terms & conditions.
            </p>
          </div>
          
          <button
            type="submit"
            disabled={submitting}
            className={`w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-md font-semibold transition-colors duration-300 flex items-center justify-center ${
              submitting ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          >
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                Submitting...
              </>
            ) : (
              <>
                <Send className="h-5 w-5 mr-2" />
                Submit Entry
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EntryForm;
import React, { useState } from 'react';
import { ref, push, update, remove } from 'firebase/database';
import { database } from '../../firebase/config';
import { Giveaway } from '../../types';
import { Gift, Calendar, Image, ArrowLeft, Trash2, Plus, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

interface AdminGiveawayFormProps {
  giveaway?: Giveaway | null;
  onClose: () => void;
}

const AdminGiveawayForm: React.FC<AdminGiveawayFormProps> = ({ giveaway, onClose }) => {
  const [formData, setFormData] = useState({
    title: giveaway?.title || '',
    description: giveaway?.description || '',
    rules: giveaway?.rules || '',
    endDate: giveaway?.endDate ? new Date(giveaway.endDate).toISOString().split('T')[0] : '',
    active: giveaway?.active !== undefined ? giveaway.active : true
  });
  
  const [images, setImages] = useState<string[]>(giveaway?.images || []);
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const uploadToImgbb = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch('https://api.imgbb.com/1/upload?key=80e36fc64660321209fefca92146c6f0', {
      method: 'POST',
      body: formData
    });

    if (!response.ok) {
      throw new Error('Failed to upload image');
    }

    const data = await response.json();
    return data.data.url;
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setUploading(true);
      const files = Array.from(e.target.files);
      
      try {
        const uploadPromises = files.map(file => uploadToImgbb(file));
        const uploadedUrls = await Promise.all(uploadPromises);
        
        setImages(prev => [...prev, ...uploadedUrls]);
        toast.success('Images uploaded successfully!');
      } catch (error) {
        console.error('Error uploading images:', error);
        toast.error('Failed to upload images');
      } finally {
        setUploading(false);
      }
    }
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const giveawayData = {
        title: formData.title,
        description: formData.description,
        rules: formData.rules,
        images,
        active: formData.active,
        endDate: formData.endDate ? new Date(formData.endDate).getTime() : null,
        createdAt: giveaway?.createdAt || Date.now()
      };
      
      if (giveaway) {
        await update(ref(database, `giveaways/${giveaway.id}`), giveawayData);
        toast.success('✨ Giveaway updated successfully!');
      } else {
        await push(ref(database, 'giveaways'), giveawayData);
        toast.success('🎉 Giveaway created successfully!');
      }
      
      onClose();
    } catch (error) {
      console.error('Error saving giveaway:', error);
      toast.error('Failed to save giveaway');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border-2 border-pink-200">
      <div className="p-4 bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400 text-white flex justify-between items-center">
        <h2 className="text-xl font-bold flex items-center">
          <Sparkles className="h-6 w-6 mr-2 animate-pulse text-yellow-200" />
          {giveaway ? '✨ Edit Giveaway' : '🎁 Create Magic!'}
        </h2>
        
        <button
          onClick={onClose}
          className="bg-white bg-opacity-20 backdrop-blur-lg text-white px-4 py-2 rounded-full hover:bg-opacity-30 transition-all duration-300 flex items-center gap-2 border border-white border-opacity-30"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back</span>
        </button>
      </div>
      
      <div className="p-6 bg-gradient-to-b from-pink-50 to-purple-50">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-purple-700 font-medium mb-2">
              ✨ Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border-2 border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
              placeholder="Enter a magical title..."
            />
          </div>
          
          <div>
            <label className="block text-purple-700 font-medium mb-2">
              📝 Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-4 py-2 border-2 border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
              placeholder="Describe your amazing giveaway..."
            />
          </div>
          
          <div>
            <label className="block text-purple-700 font-medium mb-2">
              📜 Rules & Requirements
            </label>
            <textarea
              name="rules"
              value={formData.rules}
              onChange={handleChange}
              required
              rows={4}
              className="w-full px-4 py-2 border-2 border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
              placeholder="List the rules for participation..."
            />
          </div>
          
          <div>
            <label className="block text-purple-700 font-medium mb-2 flex items-center">
              <Calendar className="h-4 w-4 mr-2 text-purple-500" />
              End Date (Optional)
            </label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full px-4 py-2 border-2 border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all duration-300"
            />
            <p className="text-sm text-purple-500 mt-1">
              Leave blank for no end date ✨
            </p>
          </div>
          
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                name="active"
                checked={formData.active}
                onChange={handleChange}
                className="h-5 w-5 text-purple-500 focus:ring-purple-400 border-pink-200 rounded-lg transition-all duration-300"
              />
              <span className="ml-2 text-purple-700">✨ Active (visible to users)</span>
            </label>
          </div>
          
          <div>
            <label className="block text-purple-700 font-medium mb-2 flex items-center">
              <Image className="h-4 w-4 mr-2 text-purple-500" />
              Images
            </label>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-3">
              {images.map((image, index) => (
                <div key={index} className="relative group rounded-xl overflow-hidden border-2 border-pink-200">
                  <img 
                    src={image} 
                    alt={`Giveaway image ${index + 1}`}
                    className="h-24 w-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 bg-red-400 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              
              <label className={`h-24 border-2 border-dashed border-pink-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-pink-50 transition-all duration-300 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                {uploading ? (
                  <>
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                    <span className="text-sm text-purple-500 mt-1">Uploading...</span>
                  </>
                ) : (
                  <>
                    <Plus className="h-6 w-6 text-purple-400" />
                    <span className="text-sm text-purple-500 mt-1">Add Image</span>
                  </>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  disabled={uploading}
                  className="hidden"
                  multiple
                />
              </label>
            </div>
            
            <p className="text-sm text-purple-500">
              Upload clear images of the prize. You can add multiple images! ✨
            </p>
          </div>
          
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border-2 border-pink-300 rounded-full text-purple-600 hover:bg-pink-50 transition-all duration-300"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={submitting || uploading}
              className={`px-6 py-2 bg-gradient-to-r from-pink-400 to-purple-500 text-white rounded-full hover:from-pink-500 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 ${
                (submitting || uploading) ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                  Creating Magic...
                </>
              ) : (
                '✨ Save Giveaway'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminGiveawayForm;
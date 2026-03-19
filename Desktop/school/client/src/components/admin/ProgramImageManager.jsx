import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FiPlus, FiTrash2, FiEdit2 } from 'react-icons/fi';
import PhotoUploadInput from '../PhotoUploadInput';

const ProgramImageManager = () => {
  const [programs, setPrograms] = useState([
    { id: 'plus-two', title: '+2 Management' },
    { id: 'bba', title: 'BBA (Bachelor of Business Administration)' },
    { id: 'bbs', title: 'BBS (Bachelor of Business Studies)' },
  ]);
  
  const [programImages, setProgramImages] = useState({});
  const [loading, setLoading] = useState(false);

  // Load program images from localStorage on mount
  useEffect(() => {
    const savedImages = localStorage.getItem('programImages');
    if (savedImages) {
      setProgramImages(JSON.parse(savedImages));
    }
  }, []);

  const handleImageUpload = (programId, imageData) => {
    setLoading(true);
    try {
      const updatedImages = {
        ...programImages,
        [programId]: imageData,
      };
      setProgramImages(updatedImages);
      localStorage.setItem('programImages', JSON.stringify(updatedImages));
      toast.success('Program image updated successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setLoading(false);
    }
  };

  const handleImageRemove = (programId) => {
    if (!window.confirm('Are you sure you want to remove this program image?')) return;
    
    setLoading(true);
    try {
      const updatedImages = { ...programImages };
      delete updatedImages[programId];
      setProgramImages(updatedImages);
      localStorage.setItem('programImages', JSON.stringify(updatedImages));
      toast.success('Program image removed');
    } catch (error) {
      console.error('Error removing image:', error);
      toast.error('Failed to remove image');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">Program Images</h2>
      </div>

      <p className="text-gray-600 text-sm">
        Upload images for each program to showcase students studying or engaged in activities. These will appear on the Programs page.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {programs.map((program) => (
          <div key={program.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
            <div className="mb-4">
              <h3 className="font-bold text-gray-800 text-lg">{program.title}</h3>
              <p className="text-xs text-gray-500 mt-1">ID: {program.id}</p>
            </div>

            {/* Image Preview */}
            {programImages[program.id] ? (
              <div className="relative">
                <img
                  src={programImages[program.id]}
                  alt={program.title}
                  className="w-full h-40 object-cover rounded-lg border border-gray-200"
                />
                <button
                  onClick={() => handleImageRemove(program.id)}
                  disabled={loading}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-lg p-2 hover:bg-red-600 transition-colors disabled:opacity-50"
                >
                  <FiTrash2 size={16} />
                </button>
              </div>
            ) : (
              <div className="w-full h-40 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400">
                <div className="text-center">
                  <FiPlus className="text-2xl mx-auto mb-2" />
                  <p className="text-xs">No image yet</p>
                </div>
              </div>
            )}

            {/* Photo Upload Input */}
            <PhotoUploadInput
              value={programImages[program.id] || null}
              onChange={(image) => handleImageUpload(program.id, image)}
              label="Upload Program Image"
            />

            <p className="text-xs text-gray-500">
              Recommended: 560×320px or similar aspect ratio, max 5MB
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgramImageManager;

import { useState } from 'react';
import { FiCamera, FiX } from 'react-icons/fi';
import toast from 'react-hot-toast';

export default function PhotoUploadInput({ value, onChange, label = 'Upload Photo' }) {
  const [preview, setPreview] = useState(value || null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size must be less than 5MB');
      return;
    }

    setLoading(true);
    try {
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String = event.target.result;
        setPreview(base64String);
        onChange(base64String);
        toast.success('Photo uploaded successfully');
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error reading file:', error);
      toast.error('Failed to upload photo');
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onChange(null);
    toast.success('Photo removed');
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      
      <div className="relative">
        {preview ? (
          <div className="relative inline-block">
            <img
              src={preview}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-lg border-2 border-primary-200 shadow-md"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-lg"
              disabled={loading}
            >
              <FiX className="text-lg" />
            </button>
          </div>
        ) : (
          <label className="flex items-center justify-center w-32 h-32 rounded-lg border-2 border-dashed border-primary-300 hover:border-primary-500 bg-primary-50 hover:bg-primary-100 cursor-pointer transition-colors group">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              disabled={loading}
            />
            <div className="text-center">
              <FiCamera className="text-2xl text-primary-500 mx-auto mb-1 group-hover:text-primary-600" />
              <span className="text-xs text-gray-600 group-hover:text-gray-700">Click to upload</span>
            </div>
          </label>
        )}
      </div>

      {loading && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div className="w-4 h-4 border-2 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
          Uploading...
        </div>
      )}

      <p className="text-xs text-gray-500">Recommended: 400×400px, max 5MB, JPG or PNG</p>
    </div>
  );
}

import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiEdit2, FiTrash2, FiCamera, FiUpload, FiX } from 'react-icons/fi';
import Modal from './Modal';
import ConfirmDialog from './ConfirmDialog';

const GalleryManager = () => {
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(false);

  // Modal states
  const [editModal, setEditModal] = useState(false);
  const [createModal, setCreateModal] = useState(false);
  const [photoModal, setPhotoModal] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState(false);

  // Form data
  const [selectedGallery, setSelectedGallery] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'other',
  });
  const [coverImageFile, setCoverImageFile] = useState(null);
  const [coverImagePreview, setCoverImagePreview] = useState(null);

  // Photo management
  const [photoFiles, setPhotoFiles] = useState([]);
  const [uploadingPhotos, setUploadingPhotos] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchGalleries();
  }, []);

  const fetchGalleries = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/gallery`);
      if (response.data.success) {
        setGalleries(response.data.galleries);
      }
    } catch (error) {
      toast.error('Failed to fetch gallery collections');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCoverImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCoverImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCoverImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setFormData({ title: '', description: '', category: 'other' });
    setCoverImageFile(null);
    setCoverImagePreview(null);
  };

  // Open create modal
  const openCreateModal = () => {
    resetForm();
    setCreateModal(true);
  };

  // Open edit modal
  const openEditModal = (gallery) => {
    setSelectedGallery(gallery);
    setFormData({
      title: gallery.title,
      description: gallery.description,
      category: gallery.category,
    });
    setCoverImagePreview(gallery.coverImage); // Show current cover image
    setCoverImageFile(null); // No new file selected initially
    setEditModal(true);
  };

  // Create new gallery collection
  const handleCreate = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }

    if (!coverImageFile) {
      toast.error('Cover image is required');
      return;
    }

    const submitData = new FormData();
    submitData.append('title', formData.title);
    submitData.append('description', formData.description);
    submitData.append('category', formData.category);
    submitData.append('coverImage', coverImageFile);

    try {
      setLoading(true);
      const response = await axios.post(`${API_URL}/gallery`, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });

      if (response.data.success) {
        setGalleries([response.data.gallery, ...galleries]);
        toast.success('Gallery collection created successfully');
        setCreateModal(false);
        resetForm();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create gallery collection');
    } finally {
      setLoading(false);
    }
  };

  // Update gallery collection
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }

    const submitData = new FormData();
    submitData.append('title', formData.title);
    submitData.append('description', formData.description);
    submitData.append('category', formData.category);

    // Only append cover image if a new one is selected
    if (coverImageFile) {
      submitData.append('coverImage', coverImageFile);
    }

    try {
      setLoading(true);
      const response = await axios.put(`${API_URL}/gallery/${selectedGallery._id}`, submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        withCredentials: true,
      });

      if (response.data.success) {
        setGalleries(galleries.map(g =>
          g._id === selectedGallery._id ? response.data.gallery : g
        ));
        toast.success('Gallery collection updated successfully');
        setEditModal(false);
        resetForm();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update gallery collection');
    } finally {
      setLoading(false);
    }
  };

  // Delete gallery collection
  const handleDelete = async () => {
    try {
      const response = await axios.delete(`${API_URL}/gallery/${selectedGallery._id}`, {
        withCredentials: true,
      });

      if (response.data.success) {
        setGalleries(galleries.filter(g => g._id !== selectedGallery._id));
        toast.success('Gallery collection deleted successfully');
        setDeleteDialog(false);
      }
    } catch (error) {
      toast.error('Failed to delete gallery collection');
    }
  };

  // Open photo management modal
  const openPhotoModal = (gallery) => {
    setSelectedGallery(gallery);
    setPhotoModal(true);
  };

  // Upload photos to collection
  const handlePhotoUpload = async () => {
    if (photoFiles.length === 0) {
      toast.error('Please select photos to upload');
      return;
    }

    const submitData = new FormData();
    photoFiles.forEach(file => {
      submitData.append('photos', file);
    });

    try {
      setUploadingPhotos(true);
      const response = await axios.post(
         `${API_URL}/gallery/${selectedGallery._id}/photos`,
         submitData,
         {
           headers: {
             'Content-Type': 'multipart/form-data',
           },
           withCredentials: true,
         }
       );

      if (response.data.success) {
        // Update the gallery in state
        setGalleries(galleries.map(g =>
          g._id === selectedGallery._id ? response.data.gallery : g
        ));
        setSelectedGallery(response.data.gallery);
        toast.success(response.data.message);
        setPhotoFiles([]);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to upload photos');
    } finally {
      setUploadingPhotos(false);
    }
  };

  // Delete single photo
  const handlePhotoDelete = async (photoId) => {
    if (!window.confirm('Are you sure you want to delete this photo?')) return;

    try {
      const response = await axios.delete(
         `${API_URL}/gallery/${selectedGallery._id}/photos/${photoId}`,
         { withCredentials: true }
       );

      if (response.data.success) {
        // Update the gallery in state
        setGalleries(galleries.map(g =>
          g._id === selectedGallery._id ? response.data.gallery : g
        ));
        setSelectedGallery(response.data.gallery);
        toast.success('Photo deleted successfully');
      }
    } catch (error) {
      toast.error('Failed to delete photo');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Add Category button */}
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">Gallery Collections</h2>
        <button
          onClick={openCreateModal}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
        >
          <FiUpload size={18} />
          + Add Category
        </button>
      </div>

      {/* Gallery Grid */}
      {loading && galleries.length === 0 ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {galleries.length > 0 ? (
            galleries.map((gallery) => (
              <div key={gallery._id} className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition">
                <div className="relative">
                  <img
                    src={gallery.coverImage?.startsWith('/uploads/')
                      ? `${API_URL.replace('/api/v1', '')}${gallery.coverImage}`
                      : gallery.coverImage
                    }
                    alt={gallery.title}
                    className="w-full h-48 object-cover"
                    onError={(e) => {
                      e.target.src = 'https://via.placeholder.com/300x200?text=Image+Not+Found';
                    }}
                  />
                  <div className="absolute top-2 right-2 bg-black bg-opacity-75 text-white px-2 py-1 rounded text-sm">
                    {gallery.images?.length || 0} images
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-semibold text-gray-800 text-lg mb-2">{gallery.title}</h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{gallery.description}</p>
                  <p className="text-xs text-gray-500 mb-4">
                    Category: <span className="capitalize">{gallery.category}</span> • {gallery.images?.length || 0} photos
                  </p>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    {/* Edit Button */}
                    <button
                      onClick={() => openEditModal(gallery)}
                      className="flex-1 flex items-center justify-center gap-1 bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition"
                    >
                      <FiEdit2 size={16} /> Edit
                    </button>

                    {/* Delete Button */}
                    <button
                      onClick={() => {
                        setSelectedGallery(gallery);
                        setDeleteDialog(true);
                      }}
                      className="flex-1 flex items-center justify-center gap-1 bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 transition"
                    >
                      <FiTrash2 size={16} /> Delete
                    </button>
                  </div>

                  {/* Manage Photos Button */}
                  <button
                    onClick={() => openPhotoModal(gallery)}
                    className="w-full mt-2 flex items-center justify-center gap-1 bg-green-600 text-white px-3 py-2 rounded hover:bg-green-700 transition"
                  >
                    <FiCamera size={16} /> 📷 Manage Photos
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-16">
              <div className="text-gray-400 text-6xl mb-4">📷</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Gallery Collections Yet</h3>
              <p className="text-gray-500 mb-4">Create your first gallery collection to get started.</p>
              <button
                onClick={openCreateModal}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                + Add Category
              </button>
            </div>
          )}
        </div>
      )}

      {/* Create Category Modal */}
      <Modal isOpen={createModal} onClose={() => setCreateModal(false)} title="Create Gallery Category" size="md">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              placeholder="e.g., Annual Sports Day"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              placeholder="Describe this category..."
              rows="3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            >
              <option value="activities">Activities</option>
              <option value="achievements">Achievements</option>
              <option value="events">Events</option>
              <option value="campus">Campus</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cover Image *
            </label>
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleCoverImageChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              required
            />
            {coverImagePreview && (
              <div className="mt-2">
                <img
                  src={coverImagePreview}
                  alt="Preview"
                  className="w-full h-32 object-cover rounded border"
                />
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setCreateModal(false)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Category'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Edit Category Modal */}
      <Modal isOpen={editModal} onClose={() => setEditModal(false)} title="Edit Gallery Category" size="md">
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              placeholder="e.g., Annual Sports Day"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
              placeholder="Describe this category..."
              rows="3"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            >
              <option value="activities">Activities</option>
              <option value="achievements">Achievements</option>
              <option value="events">Events</option>
              <option value="campus">Campus</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cover Image
            </label>
            {coverImagePreview && (
              <div className="mb-2">
                <p className="text-sm text-gray-500 mb-2">Current Image:</p>
                <img
                  src={coverImagePreview?.startsWith('/uploads/')
                    ? `${API_URL.replace('/api/v1', '')}${coverImagePreview}`
                    : coverImagePreview
                  }
                  alt="Current cover"
                  className="w-full h-32 object-cover rounded border"
                />
              </div>
            )}
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleCoverImageChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
            />
            <p className="text-xs text-gray-500 mt-1">Leave empty to keep current image</p>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => setEditModal(false)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Photo Management Modal */}
      <Modal isOpen={photoModal} onClose={() => setPhotoModal(false)} title={`Photos — ${selectedGallery?.title}`} size="lg">
        <div className="space-y-6">
          {/* Upload Section */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-800 mb-3">Upload Photos</h4>
            <input
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              multiple
              onChange={(e) => setPhotoFiles(Array.from(e.target.files))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent mb-3"
            />
            {photoFiles.length > 0 && (
              <div className="mb-3">
                <p className="text-sm text-gray-600 mb-2">
                  {photoFiles.length} file{photoFiles.length !== 1 ? 's' : ''} selected
                </p>
                <div className="flex flex-wrap gap-2">
                  {photoFiles.map((file, index) => (
                    <div key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                      {file.name}
                    </div>
                  ))}
                </div>
              </div>
            )}
            <button
              onClick={handlePhotoUpload}
              disabled={photoFiles.length === 0 || uploadingPhotos}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition disabled:opacity-50"
            >
              {uploadingPhotos ? 'Uploading...' : 'Upload Photos'}
            </button>
          </div>

          {/* Existing Photos Grid */}
          <div>
            <h4 className="font-medium text-gray-800 mb-3">
              Existing Photos ({selectedGallery?.images?.length || 0})
            </h4>
            {selectedGallery?.images?.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {selectedGallery.images.map((image) => (
                  <div key={image._id} className="relative group">
                    <img
                      src={image.url?.startsWith('/uploads/')
                        ? `${API_URL.replace('/api/v1', '')}${image.url}`
                        : image.url
                      }
                      alt={image.caption || 'Gallery photo'}
                      className="w-full h-24 object-cover rounded border"
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/200x150?text=Error';
                      }}
                    />
                    <button
                      onClick={() => handlePhotoDelete(image._id)}
                      className="absolute top-1 right-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-700 transition opacity-0 group-hover:opacity-100"
                    >
                      <FiX size={14} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FiCamera size={48} className="mx-auto mb-2 text-gray-400" />
                <p>No photos in this category yet.</p>
                <p className="text-sm mt-1">Upload some using the form above.</p>
              </div>
            )}
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={deleteDialog}
        onClose={() => setDeleteDialog(false)}
        onConfirm={handleDelete}
        message={`Are you sure you want to delete '${selectedGallery?.title}'? This will also delete all photos in this category.`}
      />
    </div>
  );
};

export default GalleryManager;

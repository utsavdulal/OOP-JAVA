import { useState, useEffect } from 'react';
import { FiUploadCloud, FiTrash2, FiImage } from 'react-icons/fi';
import api from '../../utils/api';
import Modal from '../../components/admin/Modal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { showToast } from '../../components/admin/Toast';
import LoadingSpinner from '../../components/admin/LoadingSpinner';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Gallery = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const res = await api.get('/gallery');
      setImages(res.data);
    } catch (err) {
      showToast.error('Failed to load gallery images');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      if (!selectedFile.type.startsWith('image/')) {
        showToast.error('Please select an image file');
        return;
      }
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!title || !file) {
      showToast.error('Title and image are required');
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('image', file);

      await api.post('/gallery', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      showToast.success('Image uploaded successfully');
      setModalOpen(false);
      resetForm();
      fetchImages();
    } catch (err) {
      showToast.error('Failed to upload image');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/gallery/${deleteId}`);
      showToast.success('Image deleted successfully');
      fetchImages();
    } catch (err) {
      showToast.error('Failed to delete image');
      console.error(err);
    }
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setFile(null);
    setPreview('');
  };

  const closeAndReset = () => {
    setModalOpen(false);
    resetForm();
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex justify-between items-center bg-white p-5 rounded-xl shadow-sm border border-slate-100">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <FiImage className="text-blue-600" /> Gallery Management
        </h1>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-all shadow-sm hover:shadow active:scale-95"
        >
          <FiUploadCloud size={20} /> Upload Image
        </button>
      </div>

      {/* Grid */}
      {images.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-500">
          <FiImage size={48} className="mb-4 text-slate-300" />
          <p className="text-lg">No images uploaded yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((img) => (
            <div key={img._id} className="bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200 group relative">
              <div className="aspect-video bg-slate-100 overflow-hidden relative">
                <img 
                  src={`${API_BASE_URL.replace('/api', '')}${img.imageUrl}`} 
                  alt={img.title} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => { e.target.src = 'https://via.placeholder.com/400x300?text=Image+Not+Found'; }}
                />
                <button
                  onClick={() => setDeleteId(img._id)}
                  className="absolute top-3 right-3 p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg shadow opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Delete Image"
                >
                  <FiTrash2 size={18} />
                </button>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-slate-800 truncate" title={img.title}>{img.title}</h3>
                {img.description && (
                  <p className="text-sm text-slate-500 mt-1 line-clamp-2" title={img.description}>
                    {img.description}
                  </p>
                )}
                <p className="text-xs text-slate-400 mt-3">
                  Uploaded on {new Date(img.uploadedAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      <Modal isOpen={modalOpen} onClose={closeAndReset} title="Upload New Image">
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Image Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="E.g., Sports Day 2026"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="Brief description of the image"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Image File *</label>
            <input
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              onChange={handleFileChange}
              required
              className="w-full text-slate-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
          {preview && (
            <div className="mt-2 rounded-lg overflow-hidden border border-slate-200">
              <img src={preview} alt="Preview" className="w-full max-h-48 object-cover" />
            </div>
          )}
          <div className="flex justify-end gap-3 pt-4 border-t mt-4">
            <button
              type="button"
              onClick={closeAndReset}
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 flex items-center gap-2"
            >
              {submitting ? (
                <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> Uploading...</>
              ) : (
                'Submit'
              )}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        message="Are you sure you want to delete this image? This action cannot be undone."
      />
    </div>
  );
};

export default Gallery;

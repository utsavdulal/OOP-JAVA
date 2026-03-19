import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiClipboard, FiPaperclip } from 'react-icons/fi';
import api from '../../utils/api';
import Modal from '../../components/admin/Modal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { showToast } from '../../components/admin/Toast';
import LoadingSpinner from '../../components/admin/LoadingSpinner';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const Notices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Academic');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [file, setFile] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const res = await api.get('/notices');
      setNotices(res.data);
    } catch (err) {
      showToast.error('Failed to load notices');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content || !category) {
      showToast.error('Title, content, and category are required');
      return;
    }

    try {
      setSubmitting(true);
      const formData = new FormData();
      formData.append('title', title);
      formData.append('content', content);
      formData.append('category', category);
      formData.append('date', date);
      if (file) {
        formData.append('attachment', file);
      }

      if (editingId) {
        await api.put(`/notices/${editingId}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        showToast.success('Notice updated successfully');
      } else {
        await api.post('/notices', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        showToast.success('Notice created successfully');
      }
      
      closeAndReset();
      fetchNotices();
    } catch (err) {
      showToast.error('Failed to save notice');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (n) => {
    setEditingId(n._id);
    setTitle(n.title);
    setContent(n.content);
    setCategory(n.category || 'Academic');
    setDate(new Date(n.date).toISOString().split('T')[0]);
    setFile(null); // Force re-upload if changing file
    setModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/notices/${deleteId}`);
      showToast.success('Notice deleted');
      fetchNotices();
    } catch (err) {
      showToast.error('Failed to delete notice');
      console.error(err);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setContent('');
    setCategory('Academic');
    setDate(new Date().toISOString().split('T')[0]);
    setFile(null);
  };

  const closeAndReset = () => {
    setModalOpen(false);
    resetForm();
  };

  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'Academic': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Administrative': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Event': return 'bg-pink-100 text-pink-700 border-pink-200';
      case 'Holiday': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-xl shadow-sm border border-slate-100">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <FiClipboard className="text-blue-600" /> Notices Board
        </h1>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-all shadow-sm hover:shadow active:scale-95 whitespace-nowrap"
        >
          <FiPlus size={20} /> New Notice
        </button>
      </div>

      {notices.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-500">
          <FiClipboard size={48} className="mb-4 text-slate-300" />
          <p className="text-lg">No notices published yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {notices.map((n) => (
            <div key={n._id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow relative group flex flex-col h-full">
              <div className="flex justify-between items-start mb-3">
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getCategoryColor(n.category)}`}>
                  {n.category || 'Academic'}
                </span>
                <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">
                  {new Date(n.date).toLocaleDateString()}
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-2">{n.title}</h3>
              <p className="text-slate-600 text-sm mb-4 flex-1 line-clamp-3">
                {n.content}
              </p>
              
              {n.attachment && (
                <div className="mb-4">
                  <a 
                    href={`${API_BASE_URL.replace('/api', '')}${n.attachment}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                  >
                    <FiPaperclip size={14} /> View Attachment
                  </a>
                </div>
              )}
              
              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 mt-auto">
                <button
                  onClick={() => handleEdit(n)}
                  className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1 text-sm font-medium"
                >
                  <FiEdit2 size={16} /> Edit
                </button>
                <button
                  onClick={() => setDeleteId(n._id)}
                  className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1 text-sm font-medium"
                >
                  <FiTrash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={closeAndReset} title={editingId ? 'Edit Notice' : 'New Notice'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="e.g. Midterm Exam Schedule"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              >
                <option value="Academic">Academic</option>
                <option value="Administrative">Administrative</option>
                <option value="Event">Event</option>
                <option value="Holiday">Holiday</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Content *</label>
            <textarea
              required
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              rows={4}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Attachment (Optional)</label>
            <input
              type="file"
              onChange={handleFileChange}
              className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {editingId && <p className="text-xs text-slate-500 mt-1">Leave empty to keep existing attachment</p>}
          </div>
          
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
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              {submitting ? <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> Saving...</> : 'Submit'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        message="Are you sure you want to delete this notice?"
      />
    </div>
  );
};

export default Notices;

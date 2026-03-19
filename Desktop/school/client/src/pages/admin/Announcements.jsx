import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiBell } from 'react-icons/fi';
import api from '../../utils/api';
import Modal from '../../components/admin/Modal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { showToast } from '../../components/admin/Toast';
import LoadingSpinner from '../../components/admin/LoadingSpinner';

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  
  // Form state
  const [editingId, setEditingId] = useState(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState('Normal');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const res = await api.get('/announcements');
      setAnnouncements(res.data);
    } catch (err) {
      showToast.error('Failed to load announcements');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      showToast.error('Title and content are required');
      return;
    }

    try {
      setSubmitting(true);
      const payload = { title, content, priority, date };

      if (editingId) {
        await api.put(`/announcements/${editingId}`, payload);
        showToast.success('Announcement updated');
      } else {
        await api.post('/announcements', payload);
        showToast.success('Announcement created');
      }
      
      closeAndReset();
      fetchAnnouncements();
    } catch (err) {
      showToast.error('Failed to save announcement');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (ann) => {
    setEditingId(ann._id);
    setTitle(ann.title);
    setContent(ann.content);
    setPriority(ann.priority || 'Normal');
    setDate(new Date(ann.date).toISOString().split('T')[0]);
    setModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/announcements/${deleteId}`);
      showToast.success('Announcement deleted');
      fetchAnnouncements();
    } catch (err) {
      showToast.error('Failed to delete announcement');
      console.error(err);
    }
  };

  const resetForm = () => {
    setEditingId(null);
    setTitle('');
    setContent('');
    setPriority('Normal');
    setDate(new Date().toISOString().split('T')[0]);
  };

  const closeAndReset = () => {
    setModalOpen(false);
    resetForm();
  };

  const getPriorityColor = (p) => {
    switch (p) {
      case 'Urgent': return 'bg-red-100 text-red-700 border-red-200';
      case 'Important': return 'bg-orange-100 text-orange-700 border-orange-200';
      default: return 'bg-green-100 text-green-700 border-green-200';
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex justify-between items-center bg-white p-5 rounded-xl shadow-sm border border-slate-100">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <FiBell className="text-blue-600" /> Announcements
        </h1>
        <button
          onClick={() => setModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-all shadow-sm hover:shadow active:scale-95"
        >
          <FiPlus size={20} /> New Announcement
        </button>
      </div>

      {/* Grid */}
      {announcements.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-500">
          <FiBell size={48} className="mb-4 text-slate-300" />
          <p className="text-lg">No announcements yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {announcements.map((ann) => (
            <div key={ann._id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow relative group flex flex-col h-full">
              <div className="flex justify-between items-start mb-3">
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getPriorityColor(ann.priority)}`}>
                  {ann.priority || 'Normal'}
                </span>
                <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-100">
                  {new Date(ann.date).toLocaleDateString()}
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-slate-800 mb-2 line-clamp-2">{ann.title}</h3>
              <p className="text-slate-600 text-sm mb-4 flex-1 line-clamp-3">
                {ann.content}
              </p>
              
              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100 mt-auto">
                <button
                  onClick={() => handleEdit(ann)}
                  className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-1 text-sm font-medium"
                >
                  <FiEdit2 size={16} /> Edit
                </button>
                <button
                  onClick={() => setDeleteId(ann._id)}
                  className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1 text-sm font-medium"
                >
                  <FiTrash2 size={16} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={closeAndReset} title={editingId ? 'Edit Announcement' : 'New Announcement'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="e.g. Upcoming Parent-Teacher Meeting"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Priority</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
              >
                <option value="Normal">Normal</option>
                <option value="Important">Important</option>
                <option value="Urgent">Urgent</option>
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
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="Write the announcement details here..."
              rows={4}
            />
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
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400 flex items-center gap-2"
            >
              {submitting ? (
                <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> Saving...</>
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
        message="Are you sure you want to delete this announcement?"
      />
    </div>
  );
};

export default Announcements;

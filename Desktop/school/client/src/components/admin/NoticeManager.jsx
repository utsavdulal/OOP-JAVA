import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

const NoticeManager = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'general',
    targetAudience: 'all',
    attachmentUrl: '',
    expiryDate: '',
  });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/notices`);
      if (response.data.success) {
        setNotices(response.data.notices);
      }
    } catch (error) {
      toast.error('Failed to fetch notices');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.content) {
      toast.error('Title and content are required');
      return;
    }

    try {
      setLoading(true);
       if (editingId) {
         const response = await axios.put(
           `${API_URL}/notices/${editingId}`,
           formData,
           { withCredentials: true }
         );
        if (response.data.success) {
          setNotices(notices.map((n) => (n._id === editingId ? response.data.notice : n)));
          toast.success('Notice updated successfully');
          setEditingId(null);
        }
       } else {
         const response = await axios.post(`${API_URL}/notices`, formData, {
           withCredentials: true,
         });
        if (response.data.success) {
          setNotices([response.data.notice, ...notices]);
          toast.success('Notice posted successfully');
        }
      }
      setFormData({ title: '', content: '', category: 'general', targetAudience: 'all', attachmentUrl: '', expiryDate: '' });
      setShowForm(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save notice');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (notice) => {
    setFormData({
      title: notice.title,
      content: notice.content,
      category: notice.category,
      targetAudience: notice.targetAudience,
      attachmentUrl: notice.attachmentUrl || '',
      expiryDate: notice.expiryDate ? notice.expiryDate.split('T')[0] : '',
    });
    setEditingId(notice._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this notice?')) return;

    try {
      const response = await axios.delete(`${API_URL}/notices/${id}`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setNotices(notices.filter((n) => n._id !== id));
        toast.success('Notice deleted successfully');
      }
    } catch (error) {
      toast.error('Failed to delete notice');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">Notices</h2>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({ title: '', content: '', category: 'general', targetAudience: 'all', attachmentUrl: '', expiryDate: '' });
          }}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {showForm ? 'Cancel' : '+ Post Notice'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                placeholder="e.g., Application Deadline Notice"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content *
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                placeholder="Write your notice here..."
                rows="5"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                >
                  <option value="admission">Admission</option>
                  <option value="examination">Examination</option>
                  <option value="placement">Placement</option>
                  <option value="event">Event</option>
                  <option value="general">General</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Audience
                </label>
                <select
                  name="targetAudience"
                  value={formData.targetAudience}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                >
                  <option value="all">All</option>
                  <option value="students">Students</option>
                  <option value="parents">Parents</option>
                  <option value="staff">Staff</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Attachment URL (Optional)
              </label>
              <input
                type="url"
                name="attachmentUrl"
                value={formData.attachmentUrl}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                placeholder="https://example.com/file.pdf"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expiry Date (Optional)
              </label>
              <input
                type="date"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
              >
                {loading ? 'Posting...' : editingId ? 'Update' : 'Post'}
              </button>
            </div>
          </form>
        </div>
      )}

      {loading && !showForm ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="space-y-4">
          {notices.length > 0 ? (
            notices.map((notice) => (
              <div key={notice._id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-800">{notice.title}</h3>
                    <p className="text-gray-600 mt-2">{notice.content}</p>
                    {notice.attachmentUrl && (
                      <a
                        href={notice.attachmentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-sm mt-2 inline-block"
                      >
                        📎 View Attachment
                      </a>
                    )}
                    <div className="flex gap-2 mt-3 flex-wrap">
                      <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                        {notice.category}
                      </span>
                      <span className="px-3 py-1 text-xs rounded-full bg-purple-100 text-purple-800">
                        {notice.targetAudience}
                      </span>
                      {notice.expiryDate && (
                        <span className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                          Expires: {new Date(notice.expiryDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(notice)}
                      className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
                    >
                      <FiEdit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(notice._id)}
                      className="bg-red-600 text-white p-2 rounded hover:bg-red-700 transition"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600 text-center py-8">No notices posted yet</p>
          )}
        </div>
      )}
    </div>
  );
};

export default NoticeManager;

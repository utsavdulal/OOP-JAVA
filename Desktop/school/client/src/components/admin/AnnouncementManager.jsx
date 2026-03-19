import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiEdit2, FiTrash2 } from 'react-icons/fi';

const AnnouncementManager = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: 'general',
    priority: 'medium',
    expiryDate: '',
  });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/announcements`, {
        withCredentials: true, // Send cookies with request
      });
      if (response.data.success) {
        setAnnouncements(response.data.announcements);
      }
    } catch (error) {
      toast.error('Failed to fetch announcements');
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
          `${API_URL}/announcements/${editingId}`,
          formData,
          { withCredentials: true }
        );
        if (response.data.success) {
          setAnnouncements(announcements.map((a) => (a._id === editingId ? response.data.announcement : a)));
          toast.success('Announcement updated successfully');
          setEditingId(null);
        }
      } else {
        const response = await axios.post(`${API_URL}/announcements`, formData, {
          withCredentials: true,
        });
        if (response.data.success) {
          setAnnouncements([response.data.announcement, ...announcements]);
          toast.success('Announcement created successfully');
        }
      }
      setFormData({ title: '', content: '', category: 'general', priority: 'medium', expiryDate: '' });
      setShowForm(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save announcement');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (announcement) => {
    setFormData({
      title: announcement.title,
      content: announcement.content,
      category: announcement.category,
      priority: announcement.priority,
      expiryDate: announcement.expiryDate ? announcement.expiryDate.split('T')[0] : '',
    });
    setEditingId(announcement._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this announcement?')) return;

    try {
      const response = await axios.delete(`${API_URL}/announcements/${id}`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setAnnouncements(announcements.filter((a) => a._id !== id));
        toast.success('Announcement deleted successfully');
      }
    } catch (error) {
      toast.error('Failed to delete announcement');
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">Announcements</h2>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({ title: '', content: '', category: 'general', priority: 'medium', expiryDate: '' });
          }}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {showForm ? 'Cancel' : '+ New Announcement'}
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
                placeholder="e.g., Semester Exam Schedule"
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
                placeholder="Write your announcement here..."
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
                  <option value="academic">Academic</option>
                  <option value="event">Event</option>
                  <option value="holiday">Holiday</option>
                  <option value="general">General</option>
                  <option value="important">Important</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
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
                {loading ? 'Saving...' : editingId ? 'Update' : 'Create'}
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
          {announcements.length > 0 ? (
            announcements.map((announcement) => (
              <div key={announcement._id} className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-800">{announcement.title}</h3>
                    <p className="text-gray-600 mt-2">{announcement.content}</p>
                    <div className="flex gap-2 mt-3 flex-wrap">
                      <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                        {announcement.category}
                      </span>
                      <span className={`px-3 py-1 text-xs rounded-full ${getPriorityColor(announcement.priority)}`}>
                        {announcement.priority}
                      </span>
                      {announcement.expiryDate && (
                        <span className="px-3 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                          Expires: {new Date(announcement.expiryDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(announcement)}
                      className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
                    >
                      <FiEdit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(announcement._id)}
                      className="bg-red-600 text-white p-2 rounded hover:bg-red-700 transition"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-600 text-center py-8">No announcements yet</p>
          )}
        </div>
      )}
    </div>
  );
};

export default AnnouncementManager;

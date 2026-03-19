import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiTrash2, FiChevronDown, FiChevronUp } from 'react-icons/fi';

const MessagesViewer = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [filter, setFilter] = useState('all');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/messages`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setMessages(response.data.messages);
      }
    } catch (error) {
      toast.error('Failed to fetch messages');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (id, isRead) => {
    if (isRead) return;

    try {
      const response = await axios.put(`${API_URL}/messages/${id}/read`, {}, {
        withCredentials: true,
      });
      if (response.data.success) {
        setMessages(messages.map((m) => (m._id === id ? { ...m, isRead: true } : m)));
        toast.success('Marked as read');
      }
    } catch (error) {
      toast.error('Failed to mark as read');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;

    try {
      const response = await axios.delete(`${API_URL}/messages/${id}`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setMessages(messages.filter((m) => m._id !== id));
        toast.success('Message deleted successfully');
      }
    } catch (error) {
      toast.error('Failed to delete message');
    }
  };

  const filteredMessages = messages.filter((m) => {
    if (filter === 'unread') return !m.isRead;
    if (filter === 'read') return m.isRead;
    return true;
  });

  const unreadCount = messages.filter((m) => !m.isRead).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800">Messages</h2>
          <p className="text-sm text-gray-600 mt-1">
            {unreadCount} unread message{unreadCount !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={fetchMessages}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          🔄 Refresh
        </button>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-lg transition ${
            filter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All Messages ({messages.length})
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={`px-4 py-2 rounded-lg transition ${
            filter === 'unread'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Unread ({unreadCount})
        </button>
        <button
          onClick={() => setFilter('read')}
          className={`px-4 py-2 rounded-lg transition ${
            filter === 'read'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Read ({messages.length - unreadCount})
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredMessages.length > 0 ? (
            filteredMessages.map((message) => (
              <div
                key={message._id}
                className={`rounded-lg shadow hover:shadow-lg transition ${
                  message.isRead ? 'bg-white' : 'bg-blue-50 border-l-4 border-blue-600'
                }`}
              >
                <button
                  onClick={() => {
                    handleMarkAsRead(message._id, message.isRead);
                    setExpandedId(expandedId === message._id ? null : message._id);
                  }}
                  className="w-full p-4 flex justify-between items-center hover:opacity-80 transition"
                >
                  <div className="text-left">
                    <h4 className={`font-semibold ${message.isRead ? 'text-gray-800' : 'text-blue-900'}`}>
                      {message.subject}
                    </h4>
                    <p className={`text-sm ${message.isRead ? 'text-gray-600' : 'text-blue-800'}`}>
                      From: {message.name} ({message.email})
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(message.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    {!message.isRead && <span className="w-3 h-3 bg-blue-600 rounded-full"></span>}
                    {expandedId === message._id ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
                  </div>
                </button>

                {expandedId === message._id && (
                  <div className="p-4 border-t border-gray-200 space-y-4">
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h5 className="font-semibold text-gray-800 mb-2">Full Message:</h5>
                      <p className="text-gray-700 whitespace-pre-wrap break-words">{message.message}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Name</p>
                        <p className="font-medium">{message.name}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Email</p>
                        <p className="font-medium">{message.email}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Phone</p>
                        <p className="font-medium">{message.phone || '-'}</p>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      {!message.isRead && (
                        <button
                          onClick={() => handleMarkAsRead(message._id, false)}
                          className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
                        >
                          ✓ Mark as Read
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(message._id)}
                        className="flex-1 bg-red-600 text-white py-2 rounded hover:bg-red-700 transition flex items-center justify-center gap-1"
                      >
                        <FiTrash2 size={16} /> Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-600 text-center py-8">
              {filter === 'unread'
                ? 'No unread messages'
                : filter === 'read'
                ? 'No read messages'
                : 'No messages yet'}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default MessagesViewer;

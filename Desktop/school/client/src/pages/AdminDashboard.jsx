import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import GalleryManager from '../components/admin/GalleryManager';
import NoticeManager from '../components/admin/NoticeManager';
import MessagesViewer from '../components/admin/MessagesViewer';
import TeacherProfile from '../components/admin/TeacherProfile';
import ProgramImageManager from '../components/admin/ProgramImageManager';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('dashboard');
  const [admin, setAdmin] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [unreadMessages, setUnreadMessages] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const adminData = localStorage.getItem('adminData');

    if (!token) {
      navigate('/admin/login', { state: { from: location } });
      return;
    }

    if (adminData) {
      setAdmin(JSON.parse(adminData));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    toast.success('Logged out successfully');
    navigate('/admin/login');
  };

  const handleSectionChange = (section) => {
    setActiveSection(section);
    setSidebarOpen(false);
  };

  const menuItems = [
    { id: 'dashboard', label: '📊 Dashboard', icon: '📊' },
    { id: 'programs', label: '📚 Program Images', icon: '📚' },
    { id: 'gallery', label: '🖼️ Gallery', icon: '🖼️' },
    { id: 'notices', label: '📋 Notices', icon: '📋' },
    { id: 'messages', label: '💬 Messages', icon: '💬' },
    { id: 'profile', label: '👤 Profile', icon: '👤' },
  ];

  if (!admin) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        className={`fixed md:relative w-64 bg-gray-800 text-white transition-all duration-300 ${
          sidebarOpen ? 'translate-x-0 z-40' : '-translate-x-full md:translate-x-0'
        } h-screen overflow-y-auto`}
      >
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-2xl font-bold">Admin Panel</h2>
          <p className="text-gray-400 text-sm mt-1">
            {admin.firstName} {admin.lastName}
          </p>
        </div>

        <nav className="mt-6">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleSectionChange(item.id)}
              className={`w-full text-left px-6 py-3 transition ${
                activeSection === item.id
                  ? 'bg-blue-600 border-l-4 border-blue-400'
                  : 'hover:bg-gray-700'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 w-full border-t border-gray-700 p-4">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition"
          >
            <FiLogOut /> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-auto">
        {/* Top Bar */}
        <div className="bg-white shadow-sm p-4 flex items-center justify-between md:hidden">
          <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-gray-600 hover:text-gray-900"
          >
            {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-4 md:p-8 overflow-auto">
          {activeSection === 'dashboard' && (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-gray-800">Welcome to Admin Dashboard</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
                  <div className="text-3xl mb-2">📚</div>
                  <h3 className="font-semibold text-gray-800">Program Images</h3>
                  <p className="text-gray-600 text-sm mt-2">Upload program photos</p>
                  <button
                    onClick={() => handleSectionChange('programs')}
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                  >
                    Go to Programs
                  </button>
                </div>

                <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
                  <div className="text-3xl mb-2">🖼️</div>
                  <h3 className="font-semibold text-gray-800">Manage Gallery</h3>
                  <p className="text-gray-600 text-sm mt-2">Upload and manage photos</p>
                  <button
                    onClick={() => handleSectionChange('gallery')}
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                  >
                    Go to Gallery
                  </button>
                </div>
                
                <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
                  <div className="text-3xl mb-2">📋</div>
                  <h3 className="font-semibold text-gray-800">Post Notices</h3>
                  <p className="text-gray-600 text-sm mt-2">Send official notices</p>
                  <button
                    onClick={() => handleSectionChange('notices')}
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                  >
                    Go to Notices
                  </button>
                </div>

                <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
                  <div className="text-3xl mb-2">💬</div>
                  <h3 className="font-semibold text-gray-800">View Messages</h3>
                  <p className="text-gray-600 text-sm mt-2">See student & parent messages</p>
                  <button
                    onClick={() => handleSectionChange('messages')}
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                  >
                    Go to Messages
                  </button>
                </div>

                <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
                  <div className="text-3xl mb-2">👤</div>
                  <h3 className="font-semibold text-gray-800">My Profile</h3>
                  <p className="text-gray-600 text-sm mt-2">Update your information</p>
                  <button
                    onClick={() => handleSectionChange('profile')}
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                  >
                    Go to Profile
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'dashboard' && (
            <div className="space-y-6">
              <h1 className="text-3xl font-bold text-gray-800">Welcome to Admin Dashboard</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
                  <div className="text-3xl mb-2">📚</div>
                  <h3 className="font-semibold text-gray-800">Program Images</h3>
                  <p className="text-gray-600 text-sm mt-2">Upload program photos</p>
                  <button
                    onClick={() => handleSectionChange('programs')}
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                  >
                    Go to Programs
                  </button>
                </div>

                <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
                  <div className="text-3xl mb-2">🖼️</div>
                  <h3 className="font-semibold text-gray-800">Manage Gallery</h3>
                  <p className="text-gray-600 text-sm mt-2">Upload and manage photos</p>
                  <button
                    onClick={() => handleSectionChange('gallery')}
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                  >
                    Go to Gallery
                  </button>
                </div>

                <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
                  <div className="text-3xl mb-2">📋</div>
                  <h3 className="font-semibold text-gray-800">Post Notices</h3>
                  <p className="text-gray-600 text-sm mt-2">Send official notices</p>
                  <button
                    onClick={() => handleSectionChange('notices')}
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                  >
                    Go to Notices
                  </button>
                </div>

                <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
                  <div className="text-3xl mb-2">💬</div>
                  <h3 className="font-semibold text-gray-800">View Messages</h3>
                  <p className="text-gray-600 text-sm mt-2">See student & parent messages</p>
                  <button
                    onClick={() => handleSectionChange('messages')}
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                  >
                    Go to Messages
                  </button>
                </div>

                <div className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition">
                  <div className="text-3xl mb-2">👤</div>
                  <h3 className="font-semibold text-gray-800">My Profile</h3>
                  <p className="text-gray-600 text-sm mt-2">Update your information</p>
                  <button
                    onClick={() => handleSectionChange('profile')}
                    className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                  >
                    Go to Profile
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'programs' && <ProgramImageManager />}
          {activeSection === 'gallery' && <GalleryManager />}
          {activeSection === 'notices' && <NoticeManager />}
          {activeSection === 'messages' && <MessagesViewer />}
          {activeSection === 'profile' && <TeacherProfile admin={admin} setAdmin={setAdmin} />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

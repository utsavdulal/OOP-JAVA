import { useState, useEffect } from 'react';
import { useNavigate, Navigate, Outlet } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { FiLogOut, FiMenu, FiX, FiHome, FiImage, FiBell, FiClipboard, FiUsers, FiFileText, FiCalendar, FiDollarSign, FiMessageSquare, FiUser } from 'react-icons/fi';

const AdminLayout = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    // Fetch admin profile from secure HTTPOnly cookie endpoint
    const fetchAdminProfile = async () => {
      try {
        const response = await fetch('/api/v1/admin/auth/profile', {
          credentials: 'include', // Include cookies in request
        });

        if (!response.ok) {
          if (response.status === 401) {
            navigate('/admin/login');
          }
          return;
        }

        const data = await response.json();
        if (data.success && data.admin) {
          setAdmin(data.admin);
        }
      } catch (err) {
        console.error('Error fetching admin profile:', err);
        navigate('/admin/login');
      }
    };

    fetchAdminProfile();
  }, [navigate]);

  if (!admin) {
    // Check if user is authenticated by attempting to fetch profile
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = async () => {
    try {
      await fetch('/api/v1/admin/auth/logout', {
        method: 'POST',
        credentials: 'include', // Include cookies in request
      });
      toast.success('Logged out successfully');
      navigate('/admin/login');
    } catch (err) {
      console.error('Error logging out:', err);
      toast.error('Error logging out');
    }
  };

  const navItems = [
    { to: '/admin/dashboard', icon: <FiHome />, label: 'Dashboard' },
    { to: '/admin/gallery', icon: <FiImage />, label: 'Gallery' },
    { to: '/admin/announcements', icon: <FiBell />, label: 'Announcements' },
    { to: '/admin/notices', icon: <FiClipboard />, label: 'Notices' },
    { to: '/admin/students', icon: <FiUsers />, label: 'Students' },
    { to: '/admin/results', icon: <FiFileText />, label: 'Results' },
    { to: '/admin/attendance', icon: <FiCalendar />, label: 'Attendance' },
    { to: '/admin/fees', icon: <FiDollarSign />, label: 'Fees' },
    { to: '/admin/messages', icon: <FiMessageSquare />, label: 'Messages' },
    { to: '/admin/profile', icon: <FiUser />, label: 'Profile' },
  ];

  if (!admin) return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <div
        className={`fixed md:relative w-64 bg-slate-800 text-white transition-transform duration-300 z-40 h-full flex flex-col
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}
        `}
      >
        <div className="p-6 border-b border-slate-700 shrink-0">
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-400">Admin Panel</h2>
          <p className="text-slate-400 text-sm mt-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
            {admin.firstName} {admin.lastName}
          </p>
        </div>

        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {navItems.map((item) => (
              <li key={item.to}>
                <button
                  onClick={() => {
                    navigate(item.to);
                    if (window.innerWidth < 768) setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors
                    ${window.location.pathname.startsWith(item.to) 
                      ? 'bg-blue-600 text-white shadow-md' 
                      : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                    }
                  `}
                >
                  <span className={window.location.pathname.startsWith(item.to) ? 'text-white' : 'text-slate-400'}>
                    {item.icon}
                  </span>
                  <span className="font-medium">{item.label}</span>
                </button>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-slate-700 shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 bg-slate-700 hover:bg-red-600 text-white px-4 py-2.5 rounded-lg transition-colors shadow-sm"
          >
            <FiLogOut /> <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-slate-50">
        {/* Mobile Header */}
        <div className="bg-white shadow-sm p-4 flex items-center justify-between md:hidden shrink-0 z-30">
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Kasturi College</h1>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-slate-600 hover:text-slate-900 p-1 bg-slate-100 rounded-md"
          >
            {sidebarOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Dynamic Page Content */}
        <div className="flex-1 overflow-auto p-4 md:p-8">
          <Outlet />
        </div>
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-30 md:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminLayout;

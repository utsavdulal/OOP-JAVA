import { NavLink } from 'react-router-dom';
import { FiHome, FiFileText, FiCalendar, FiDollarSign, FiBell, FiAlertCircle, FiLogOut, FiMenu, FiX } from 'react-icons/fi';
import { useState } from 'react';

const StudentSidebar = ({ student, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  const links = [
    { to: '/student/dashboard', icon: <FiHome />, text: 'Dashboard' },
    { to: '/student/results', icon: <FiFileText />, text: 'My Results' },
    { to: '/student/attendance', icon: <FiCalendar />, text: 'My Attendance' },
    { to: '/student/fees', icon: <FiDollarSign />, text: 'My Fees' },
    { to: '/student/notices', icon: <FiBell />, text: 'Notices' },
    { to: '/student/announcements', icon: <FiAlertCircle />, text: 'Announcements' },
  ];

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-[#064e3b] text-white p-4 flex justify-between items-center fixed w-full z-50">
        <h1 className="font-bold text-lg">Student Portal</h1>
        <button onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Sidebar Content */}
      <div className={`
        ${isOpen ? 'translate-x-0' : '-translate-x-full'} 
        md:translate-x-0 
        fixed md:static inset-y-0 left-0 bg-[#064e3b] text-white w-64 z-40
        transition-transform duration-300 ease-in-out
        flex flex-col h-screen overflow-y-auto pt-16 md:pt-0
      `}>
        <div className="p-6 border-b border-[#047857]">
          <h2 className="text-xl font-bold truncate">{student?.fullName || 'Student'}</h2>
          <p className="text-[#34d399] text-sm mt-1 truncate">
            Class {student?.class} | Sec {student?.section}
          </p>
          <p className="text-[#6ee7b7] text-xs truncate uppercase tracking-widest mt-1">
            Roll: {student?.rollNumber}
          </p>
        </div>

        <nav className="flex-1 py-4">
          <ul className="space-y-1">
            {links.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) => 
                    `flex items-center gap-3 px-6 py-3 transition-colors ${
                      isActive 
                        ? 'bg-[#047857] border-l-4 border-[#34d399]' 
                        : 'hover:bg-[#047857]/50 border-l-4 border-transparent'
                    }`
                  }
                >
                  {link.icon}
                  <span>{link.text}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="p-4 border-t border-[#047857]">
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 bg-[#dc2626] hover:bg-[#b91c1c] px-4 py-2 rounded-lg transition-colors"
          >
            <FiLogOut />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-30 md:hidden" 
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default StudentSidebar;

import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { HiMenu, HiX } from 'react-icons/hi';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Programs', path: '/programs' },
  { name: 'Faculty', path: '/faculty' },
  { name: 'Students', path: '/students' },
  { name: 'Admissions', path: '/admissions' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'Notices', path: '/notices' },
  { name: 'Contact', path: '/contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  useEffect(() => { setIsOpen(false); }, [location]);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-primary-500 shadow-md transition-all duration-300">
      <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-white flex items-center justify-center p-0.5 shadow-sm transition-transform duration-300 group-hover:scale-105">
              <img src="/logo.jpg" alt="Kasturi College Logo" className="w-full h-full object-cover rounded-full" />
            </div>
            <div className="flex flex-col font-display">
              <span className="text-lg font-bold leading-tight text-white tracking-wide">Kasturi College</span>
              <span className="text-[11px] font-medium leading-tight text-primary-100 tracking-wider">कस्तुरी कलेज</span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-1.5">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3.5 py-2 rounded-lg text-sm font-medium font-sans transition-all duration-200
                    ${isActive
                      ? 'bg-primary-600 text-white shadow-inner font-semibold'
                      : 'text-primary-50 hover:bg-primary-600/50 hover:text-white'
                    }`}
                >
                  {link.name}
                </Link>
              );
            })}
            <Link to="/admin/login" className="text-primary-100 hover:text-white text-xs font-medium px-2 py-1 transition-colors">
              👨‍🏫
            </Link>
            <Link to="/admissions" className="ml-3 px-5 py-2 bg-accent-500 text-white text-sm font-medium rounded-lg hover:bg-accent-600 transition-colors shadow-sm font-display tracking-wide">
              Apply Now
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg text-white hover:bg-primary-600 transition-colors"
          >
            {isOpen ? <HiX className="text-2xl" /> : <HiMenu className="text-2xl" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-[500px] pb-4' : 'max-h-0'}`}>
          <div className="bg-primary-600 rounded-xl shadow-xl p-3 mt-1 space-y-1 border border-primary-700">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all
                    ${isActive
                      ? 'bg-primary-500 text-white font-semibold'
                      : 'text-primary-100 hover:bg-primary-500 hover:text-white'
                    }`}
                >
                  {link.name}
                </Link>
              );
            })}
            <Link to="/admissions" className="block text-center px-4 py-3 mt-2 bg-accent-500 text-white text-sm font-semibold rounded-lg hover:bg-accent-600 transition-colors">
              Apply Now
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

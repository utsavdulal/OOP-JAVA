import { Link } from 'react-router-dom';
import { FaGraduationCap, FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaFacebookF, FaInstagram, FaYoutube } from 'react-icons/fa';

const quickLinks = [
  { name: 'About Us', path: '/about' },
  { name: 'Programs', path: '/programs' },
  { name: 'Admissions', path: '/admissions' },
  { name: 'Faculty', path: '/faculty' },
  { name: 'Gallery', path: '/gallery' },
  { name: 'Notice Board', path: '/notices' },
  { name: 'Contact', path: '/contact' },
];

const programs = [
  '+2 Management',
  'BBA (Bachelor of Business Administration)',
  'BBS (Bachelor of Business Studies)',
];

export default function Footer() {
  return (
    <footer className="bg-primary-500 text-white border-t border-primary-600">
      <div className="container-custom mx-auto section-padding !py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center gap-3 mb-5 group">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-white flex items-center justify-center p-0.5 shadow-sm transition-transform duration-300 group-hover:scale-105">
                <img src="/logo.jpg" alt="Kasturi College Logo" className="w-full h-full object-cover rounded-full" />
              </div>
              <div className="flex flex-col font-display">
                <span className="text-lg font-bold leading-tight text-white tracking-wide">Kasturi College</span>
                <span className="text-[11px] font-medium leading-tight text-primary-100 tracking-wider">कस्तुरी कलेज</span>
              </div>
            </Link>
            <p className="text-primary-100 text-sm leading-relaxed mb-6 font-sans">
              One of the leading academic institutions of Nepal for quality education exclusively in Management stream.
            </p>
            <div className="flex gap-3">
              {[FaFacebookF, FaInstagram, FaYoutube].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 rounded-full bg-primary-600 flex items-center justify-center hover:bg-accent-500 hover:text-white transition-all duration-300 hover:scale-110 shadow-sm border border-primary-400">
                  <Icon className="text-sm" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-accent-500 mb-5 font-display">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.path}>
                  <Link to={link.path} className="text-primary-100 hover:text-white text-sm transition-colors duration-200 hover:pl-1 flex items-center gap-2 font-sans before:content-[''] before:w-1 before:h-1 before:bg-accent-500 before:rounded-full before:opacity-0 hover:before:opacity-100 before:transition-opacity">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Programs */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-accent-500 mb-5 font-display">Programs</h4>
            <ul className="space-y-3">
              {programs.map((p, i) => (
                <li key={i} className="text-primary-100 text-sm flex items-start gap-2 font-sans">
                  <span className="text-accent-500 mt-1.5 flex-shrink-0 text-[10px]">■</span>
                  {p}
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-accent-500 mb-5 font-display">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-primary-100 font-sans">
                <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center flex-shrink-0 mt-0.5 border border-primary-400">
                  <FaMapMarkerAlt className="text-accent-500 text-xs" />
                </div>
                <span className="pt-1.5">BP Complex, BP Chowk, Ward No. 8, Itahari 56705, Nepal</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-primary-100 font-sans">
                <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center flex-shrink-0 border border-primary-400">
                  <FaPhoneAlt className="text-accent-500 text-xs" />
                </div>
                <a href="tel:025-583563" className="hover:text-white transition-colors">025-583563</a>
              </li>
              <li className="flex items-center gap-3 text-sm text-primary-100 font-sans">
                <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center flex-shrink-0 border border-primary-400">
                  <FaEnvelope className="text-accent-500 text-xs" />
                </div>
                <a href="mailto:info@kasturicollege.edu.np" className="hover:text-white transition-colors break-all">info@kasturicollege.edu.np</a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-primary-600 bg-primary-800">
        <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-primary-200 text-sm text-center sm:text-left font-sans">
            © {new Date().getFullYear()} Kasturi College. All rights reserved.
          </p>
          <p className="text-primary-300 text-xs font-sans tracking-wide">
            Affiliated with Tribhuvan University & NEB
          </p>
        </div>
      </div>
    </footer>
  );
}

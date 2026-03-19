import { Helmet } from 'react-helmet-async';
import { FaCalendarAlt, FaBullhorn, FaFileAlt, FaExclamationTriangle, FaSearch, FaArrowRight } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import axios from 'axios';

const noticeTypes = {
  general: { icon: FaBullhorn, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200', label: 'General' },
  examination: { icon: FaFileAlt, color: 'text-primary-600', bg: 'bg-primary-50', border: 'border-primary-200', label: 'Examination' },
  admission: { icon: FaCalendarAlt, color: 'text-accent-600', bg: 'bg-accent-50', border: 'border-accent-200', label: 'Admission' },
  event: { icon: FaExclamationTriangle, color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-200', label: 'Event' },
  holiday: { icon: FaCalendarAlt, color: 'text-green-500', bg: 'bg-green-50', border: 'border-green-200', label: 'Holiday' },
};

const categories = ['All', 'General', 'Examination', 'Admission', 'Event', 'Holiday'];

export default function NoticeBoardPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(null);
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      console.log('Fetching notices from:', `${API_URL}/notices`);
      const response = await axios.get(`${API_URL}/notices`);
      console.log('Notices response:', response.data);
      if (response.data.success) {
        setNotices(response.data.notices);
      }
    } catch (error) {
      console.error('Error fetching notices:', error);
      setNotices([]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = notices
    .filter(n => activeCategory === 'All' || (noticeTypes[n.category] && noticeTypes[n.category].label === activeCategory))
    .filter(n => n.title.toLowerCase().includes(search.toLowerCase()) || n.content.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
      <Helmet>
        <title>Notice Board — Kasturi College</title>
        <meta name="description" content="Stay updated with the latest announcements, exam schedules, and notices from Kasturi College." />
      </Helmet>

      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-primary-800 text-white overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{ backgroundImage: `url('/college_front.jpg')` }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/90 via-primary-700/85 to-primary-800/95" />
        <div className="absolute inset-0 pattern-academic opacity-20" />
        <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="inline-flex items-center gap-2 text-accent-500 font-bold text-sm uppercase tracking-widest mb-4">
             <span className="w-8 h-0.5 bg-accent-500 rounded-full"></span>
             Stay Updated
             <span className="w-8 h-0.5 bg-accent-500 rounded-full"></span>
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 font-display tracking-tight border-b-2 border-accent-500/30 inline-block pb-4">Notice Board</h1>
          <p className="text-xl text-primary-50 max-w-2xl mx-auto font-light leading-relaxed">Important announcements, schedules, and updates from the college administration.</p>
        </div>
      </section>

      {/* Notices */}
      <section className="section-padding bg-surface-bg pt-12 relative">
        <div className="absolute top-0 right-0 w-1/4 h-1/2 bg-white rounded-l-[100px] -z-10 opacity-50 hidden lg:block" />
        <div className="container-custom mx-auto max-w-5xl">
          
          {/* Filters & Search UI */}
          <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-primary-100 flex flex-col md:flex-row items-center justify-between gap-6 mb-12 relative z-10">
            <div className="flex flex-wrap gap-2 justify-center w-full md:w-auto">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-5 py-2.5 rounded-full text-sm font-bold tracking-wide transition-all duration-300 font-display border
                    ${activeCategory === cat 
                      ? 'bg-primary-600 text-white border-primary-600 shadow-md' 
                      : 'bg-surface-bg text-text-secondary border-transparent hover:border-primary-200 hover:text-primary-600'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="relative w-full md:w-80">
              <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-primary-300" />
              <input
                type="text" value={search} onChange={(e) => setSearch(e.target.value)}
                placeholder="Search notices..."
                className="w-full pl-12 pr-5 py-3.5 rounded-full border border-primary-100 bg-surface-bg text-sm font-medium focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:bg-white outline-none transition-all text-text-primary"
              />
            </div>
          </div>

          {/* Notice List */}
          {loading ? (
            <div className="space-y-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-white border border-gray-200 rounded-[1.5rem] p-8 animate-pulse">
                  <div className="flex gap-6">
                    <div className="w-14 h-14 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-1/3 mb-3"></div>
                      <div className="h-6 bg-gray-200 rounded w-2/3 mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-[2rem] border border-primary-100 shadow-sm">
              <div className="w-20 h-20 rounded-full bg-primary-50 mx-auto flex items-center justify-center mb-6">
                 <FaSearch className="text-3xl text-primary-300" />
              </div>
              <h3 className="text-xl font-bold text-primary-600 font-display mb-2">No notices found</h3>
              <p className="text-text-secondary font-light">Try adjusting your search criteria or category filter.</p>
              <button onClick={() => { setSearch(''); setActiveCategory('All'); }} className="mt-6 btn-outline text-sm">
                 Reset Filters
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {filtered.map((notice) => {
                const typeInfo = noticeTypes[notice.category] || noticeTypes.general;
                const TypeIcon = typeInfo.icon;
                const isExpanded = expanded === notice._id;

                return (
                  <div
                    key={notice._id}
                    className={`bg-white border rounded-[1.5rem] overflow-hidden transition-all duration-500 cursor-pointer ${isExpanded ? 'border-primary-300 shadow-lg ring-4 ring-primary-50/50' : 'border-primary-100 shadow-sm hover:shadow-md hover:border-primary-200'}`}
                    onClick={() => setExpanded(isExpanded ? null : notice._id)}
                  >
                    <div className="p-6 sm:p-8 flex flex-col sm:flex-row gap-6 relative">
                      {/* Icon Badge */}
                      <div className="hidden sm:flex flex-col items-center flex-shrink-0 w-16">
                        <div className={`w-14 h-14 rounded-full ${typeInfo.bg} ${typeInfo.border} border flex items-center justify-center ${typeInfo.color} mb-3 shadow-inner`}>
                          <TypeIcon className="text-2xl" />
                        </div>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-text-secondary text-center leading-tight">
                           {new Date(notice.createdAt || notice.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                        <span className="text-[10px] font-medium text-text-secondary">
                           {new Date(notice.createdAt || notice.date).getFullYear()}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3 mb-3">
                          <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${typeInfo.bg} ${typeInfo.color} border ${typeInfo.border}`}>
                            {typeInfo.label}
                          </span>
                          <span className="sm:hidden text-xs font-bold text-text-secondary">
                            {new Date(notice.createdAt || notice.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                          </span>
                        </div>

                        <h3 className={`font-bold font-display tracking-tight transition-colors duration-300 ${isExpanded ? 'text-primary-700 text-xl' : 'text-primary-600 text-lg group-hover:text-primary-500'}`}>
                           {notice.title}
                        </h3>

                        <div className={`grid transition-all duration-500 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0'}`}>
                          <div className="overflow-hidden">
                             <div className="pt-4 border-t border-primary-50">
                                <p className="text-text-secondary text-sm leading-relaxed font-light">{notice.content}</p>
                                {notice.attachmentUrl && (
                                  <div className="mt-6 flex justify-end">
                                     <a
                                       href={notice.attachmentUrl}
                                       target="_blank"
                                       rel="noopener noreferrer"
                                       className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-accent-600 hover:text-primary-600 transition-colors"
                                     >
                                        Download Attachment <FaArrowRight />
                                     </a>
                                  </div>
                                )}
                             </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </>
  );
}

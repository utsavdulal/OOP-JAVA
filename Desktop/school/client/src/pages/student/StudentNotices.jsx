import { useState, useEffect } from 'react';
import { FiClipboard, FiPaperclip, FiFilter } from 'react-icons/fi';
import studentApi from '../../utils/studentApi';
import { showToast } from '../../components/admin/Toast';
import LoadingSpinner from '../../components/admin/LoadingSpinner';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const StudentNotices = () => {
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('All');
  
  const categories = ['Academic', 'Administrative', 'Event', 'Holiday'];

  useEffect(() => {
    fetchNotices();
  }, []);

  const fetchNotices = async () => {
    try {
      setLoading(true);
      const res = await studentApi.get('/notices');
      setNotices(res.data);
    } catch (err) {
      showToast.error('Failed to load notices');
    } finally {
      setLoading(false);
    }
  };

  const getCategoryColor = (cat) => {
    switch (cat) {
      case 'Academic': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Administrative': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Event': return 'bg-pink-100 text-pink-700 border-pink-200';
      case 'Holiday': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const filteredNotices = categoryFilter === 'All' 
    ? notices 
    : notices.filter(n => n.category === categoryFilter);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-[#a7f3d0]">
        <h1 className="text-2xl font-black text-[#064e3b] flex items-center gap-3 tracking-tight">
          <div className="bg-[#ecfdf5] p-2 rounded-xl text-[#059669]">
            <FiClipboard size={24} />
          </div>
          Notice Board
        </h1>

        <div className="flex items-center gap-2 bg-[#f0fdf4] px-4 py-2.5 rounded-xl border border-[#a7f3d0] w-full sm:w-auto shadow-sm">
          <FiFilter className="text-[#059669]" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-transparent text-sm font-bold focus:outline-none text-[#064e3b] uppercase tracking-wider w-full"
          >
            <option value="All">All Categories</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {filteredNotices.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-16 bg-white rounded-2xl shadow-sm border border-[#a7f3d0] text-[#064e3b] opacity-60">
          <FiClipboard size={48} className="mb-4 text-[#a7f3d0]" />
          <p className="text-xl font-bold tracking-tight">No notices found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNotices.map((n) => (
            <div key={n._id} className="bg-white p-6 rounded-2xl shadow-sm border border-[#a7f3d0] hover:shadow-md hover:border-[#6ee7b7] transition-all relative group flex flex-col h-full transform hover:-translate-y-1">
              <div className="flex justify-between items-start mb-4">
                <span className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest border shadow-sm ${getCategoryColor(n.category)}`}>
                  {n.category || 'Academic'}
                </span>
                <span className="text-xs font-bold text-[#059669] bg-[#ecfdf5] px-3 py-1.5 rounded-lg border border-[#a7f3d0] font-mono shadow-inner">
                  {new Date(n.date).toLocaleDateString()}
                </span>
              </div>
              
              <h3 className="text-xl font-black text-[#064e3b] mb-3 leading-tight tracking-tight line-clamp-2">{n.title}</h3>
              <p className="text-[#047857] text-sm mb-6 flex-1 opacity-90 leading-relaxed overflow-y-auto max-h-40 custom-scrollbar pr-2 whitespace-pre-wrap">
                {n.content}
              </p>
              
              {n.attachment && (
                <div className="mt-auto pt-4 border-t border-[#a7f3d0]">
                  <a 
                    href={`${API_BASE_URL.replace('/api', '').replace('/student', '')}${n.attachment}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex justify-center items-center gap-2 text-sm font-black text-white bg-[#059669] hover:bg-[#047857] w-full py-3 rounded-xl transition-colors uppercase tracking-widest shadow-md active:scale-[0.98]"
                  >
                    <FiPaperclip size={18} /> View Attachment
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StudentNotices;

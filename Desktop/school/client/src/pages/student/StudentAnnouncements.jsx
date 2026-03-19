import { useState, useEffect } from 'react';
import { FiMegaphone, FiAlertCircle } from 'react-icons/fi';
import studentApi from '../../utils/studentApi';
import { showToast } from '../../components/admin/Toast';
import LoadingSpinner from '../../components/admin/LoadingSpinner';

const StudentAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      setLoading(true);
      const res = await studentApi.get('/announcements');
      setAnnouncements(res.data);
    } catch (err) {
      showToast.error('Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  const getPriorityStyle = (priority) => {
    switch (priority) {
      case 'High': return 'bg-red-500 text-white shadow-md shadow-red-200 border-red-600 scale-105 transform origin-left';
      case 'Medium': return 'bg-orange-500 text-white shadow-md shadow-orange-200 border-orange-600 scale-105 transform origin-left';
      default: return 'bg-blue-500 text-white shadow-md shadow-blue-200 border-blue-600';
    }
  };

  const getContainerStyle = (priority) => {
    switch (priority) {
      case 'High': return 'border-red-300 bg-red-50 hover:bg-red-100 hover:border-red-400';
      case 'Medium': return 'border-orange-300 bg-orange-50 hover:bg-orange-100 hover:border-orange-400';
      default: return 'border-blue-300 bg-blue-50 hover:bg-blue-100 hover:border-blue-400';
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-[#a7f3d0]">
        <h1 className="text-2xl font-black text-[#064e3b] flex items-center gap-3 tracking-tight">
          <div className="bg-[#ecfdf5] p-2 rounded-xl text-[#059669]">
            <FiMegaphone size={24} />
          </div>
          Announcements
        </h1>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-[#a7f3d0] min-h-[400px]">
        {announcements.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-full text-[#064e3b] opacity-60">
            <FiMegaphone size={48} className="mb-4 text-[#a7f3d0]" />
            <p className="text-xl font-bold tracking-tight">No announcements available</p>
          </div>
        ) : (
          <div className="relative border-l-2 border-[#10b981] ml-4 md:ml-6 space-y-8 pl-6 md:pl-10 before:absolute before:top-0 before:left-[-2px] before:w-[2px] before:h-full before:bg-gradient-to-b before:from-[#059669] before:to-transparent">
            {announcements.map((announcement) => (
              <div 
                key={announcement._id} 
                className={`relative rounded-2xl p-6 shadow-sm border transition-all duration-300 transform hover:-translate-y-1 ${getContainerStyle(announcement.priority)}`}
              >
                {/* Timeline Dot */}
                <span className={`absolute -left-7 md:-left-11 top-6 flex h-4 w-4 items-center justify-center rounded-full ring-4 ring-white shadow-sm
                  ${announcement.priority === 'High' ? 'bg-red-500' : announcement.priority === 'Medium' ? 'bg-orange-500' : 'bg-blue-500'}
                `}>
                  {announcement.priority === 'High' && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>}
                </span>
                
                <div className="flex flex-wrap justify-between items-start gap-4 mb-3">
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest border transition-transform ${getPriorityStyle(announcement.priority)}`}>
                      {announcement.priority} Priority
                    </span>
                    {announcement.priority === 'High' && <FiAlertCircle className="text-red-500 animate-pulse" size={18} />}
                  </div>
                  <time className="text-sm font-black text-[#064e3b] bg-white/60 px-3 py-1.5 rounded-lg border border-white/50 shadow-sm font-mono">
                    {new Date(announcement.date).toLocaleDateString(undefined, {
                      weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
                    })}
                  </time>
                </div>
                
                <h3 className="text-xl font-black text-[#064e3b] mb-2 tracking-tight line-clamp-2">
                  {announcement.title}
                </h3>
                <p className="text-[#047857] leading-relaxed whitespace-pre-wrap font-medium">
                  {announcement.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentAnnouncements;

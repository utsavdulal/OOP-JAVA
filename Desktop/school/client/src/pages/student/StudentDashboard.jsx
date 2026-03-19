import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { FiTrendingUp, FiBookOpen, FiDollarSign, FiBell, FiAlertCircle } from 'react-icons/fi';
import studentApi from '../../utils/studentApi';
import LoadingSpinner from '../../components/admin/LoadingSpinner';

const StudentDashboard = () => {
  const { student } = useOutletContext();
  const [loading, setLoading] = useState(true);
  
  // Dashboard Metrics State
  const [attendance, setAttendance] = useState({ percentage: 0 });
  const [subjects, setSubjects] = useState(0);
  const [feeStatus, setFeeStatus] = useState('Paid');
  const [latestNotice, setLatestNotice] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        // Call necessary APIs in parallel
        const [attRes, resRes, feeRes, notRes] = await Promise.all([
          studentApi.get('/attendance'),
          studentApi.get('/results'),
          studentApi.get('/fees'),
          studentApi.get('/notices')
        ]);
        
        // Attendance
        if (attRes.data && attRes.data.summary) {
          setAttendance({ percentage: parseFloat(attRes.data.summary.percentage) || 0 });
        }
        
        // Subjects count from results (assuming one result per subject, or distinct subjects)
        if (resRes.data) {
          const uniqueSubjects = new Set(resRes.data.map(r => r.subject));
          setSubjects(uniqueSubjects.size || resRes.data.length);
        }
        
        // Fee Status (overall worst status)
        if (feeRes.data && feeRes.data.length > 0) {
          const hasUnpaid = feeRes.data.some(f => f.status === 'Unpaid');
          const hasPartial = feeRes.data.some(f => f.status === 'Partial');
          setFeeStatus(hasUnpaid ? 'Unpaid' : hasPartial ? 'Partial' : 'Paid');
        } else {
          setFeeStatus('No Dues');
        }
        
        // Latest Notice
        if (notRes.data && notRes.data.length > 0) {
          setLatestNotice(notRes.data[0]);
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboardData();
  }, []);

  const getAttendanceColor = (pct) => {
    if (pct >= 75) return 'text-[#059669] bg-[#d1fae5] border-[#a7f3d0]';
    if (pct >= 60) return 'text-[#d97706] bg-[#fef3c7] border-[#fde68a]';
    return 'text-[#dc2626] bg-[#fee2e2] border-[#fecaca]';
  };

  const getFeeColor = (status) => {
    if (status === 'Paid' || status === 'No Dues') return 'text-[#059669] bg-[#d1fae5] border-[#a7f3d0]';
    if (status === 'Partial') return 'text-[#d97706] bg-[#fef3c7] border-[#fde68a]';
    return 'text-[#dc2626] bg-[#fee2e2] border-[#fecaca]';
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="bg-white rounded-2xl shadow-sm border border-[#a7f3d0] overflow-hidden">
        <div className="bg-gradient-to-r from-[#059669] to-[#047857] h-32"></div>
        
        <div className="px-8 pb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6 -mt-16 mb-6">
            {/* Student Photo */}
            <div className="relative">
              {student?.photo ? (
                <img
                  src={student.photo}
                  alt={student?.fullName}
                  className="w-32 h-32 rounded-xl object-cover border-4 border-white shadow-lg"
                />
              ) : (
                <div className="w-32 h-32 rounded-xl bg-gradient-to-br from-[#059669] to-[#047857] flex items-center justify-center text-white text-5xl font-bold border-4 border-white shadow-lg">
                  {student?.fullName?.[0]}
                </div>
              )}
            </div>
            
            {/* Student Info */}
            <div className="flex-1">
              <h2 className="text-3xl font-black text-[#064e3b] tracking-tight">{student?.fullName}</h2>
              <p className="text-[#059669] font-bold text-lg mt-1">{student?.rollNumber}</p>
              <div className="flex items-center gap-2 mt-3">
                <span className="bg-[#ecfdf5] px-3 py-1 rounded-lg text-sm font-bold text-[#059669] border border-[#a7f3d0]">
                  {student?.class} {student?.section}
                </span>
                {student?.email && (
                  <span className="text-[#047857] text-sm opacity-75">{student.email}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className={`p-6 rounded-2xl border shadow-sm flex flex-col ${getAttendanceColor(attendance.percentage)}`}>
          <div className="flex items-center gap-3 mb-4 opacity-80">
            <FiTrendingUp size={24} />
            <h3 className="font-bold uppercase tracking-wider text-sm">Attendance</h3>
          </div>
          <p className="text-4xl font-black mt-auto font-mono">{attendance.percentage}%</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#a7f3d0] shadow-sm flex flex-col text-[#064e3b]">
          <div className="flex items-center gap-3 mb-4 opacity-70">
            <FiBookOpen size={24} />
            <h3 className="font-bold uppercase tracking-wider text-sm">Total Subjects</h3>
          </div>
          <p className="text-4xl font-black mt-auto">{subjects}</p>
        </div>

        <div className={`p-6 rounded-2xl border shadow-sm flex flex-col ${getFeeColor(feeStatus)}`}>
          <div className="flex items-center gap-3 mb-4 opacity-80">
            <FiDollarSign size={24} />
            <h3 className="font-bold uppercase tracking-wider text-sm">Fee Status</h3>
          </div>
          <p className="text-2xl font-black mt-auto uppercase tracking-wide">{feeStatus}</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#a7f3d0] shadow-sm flex flex-col text-[#064e3b]">
          <div className="flex items-center gap-3 mb-4 opacity-70">
            <FiBell size={24} />
            <h3 className="font-bold uppercase tracking-wider text-sm">Latest Notice</h3>
          </div>
          <div className="mt-auto">
            {latestNotice ? (
              <p className="font-bold leading-tight line-clamp-2">{latestNotice.title}</p>
            ) : (
              <p className="opacity-50 italic text-sm">No new notices</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Dynamic welcome message or college info below */}
      <div className="bg-white p-8 rounded-2xl border border-[#a7f3d0] shadow-sm mt-8 flex items-center justify-between overflow-hidden relative">
        <div className="relative z-10 max-w-2xl">
          <h2 className="text-2xl font-bold text-[#064e3b] mb-4">Stay updated with your academic progress!</h2>
          <p className="text-[#047857] leading-relaxed">
            Use the sidebar to navigate through your results, attendance records, and fee details. Make sure you check the notices regularly for important announcements.
          </p>
        </div>
        <div className="hidden md:block absolute right-0 bottom-0 opacity-10">
          <FiAlertCircle size={280} className="text-[#059669] transform translate-x-10 translate-y-10" />
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;

import { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { FiCalendar, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import studentApi from '../../utils/studentApi';
import { showToast } from '../../components/admin/Toast';
import LoadingSpinner from '../../components/admin/LoadingSpinner';

const MyAttendance = () => {
  const { student } = useOutletContext();
  const [data, setData] = useState({ summary: {}, records: [] });
  const [loading, setLoading] = useState(true);
  
  // Calendar state
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const res = await studentApi.get('/attendance');
      setData(res.data);
    } catch (err) {
      showToast.error('Failed to load attendance');
    } finally {
      setLoading(false);
    }
  };

  const getPercentageColor = (pct) => {
    if (pct >= 75) return 'text-[#059669]';
    if (pct >= 60) return 'text-[#d97706]';
    return 'text-[#dc2626]';
  };

  const getCalendar = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1).getDay();
    // Number of days in the month
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Create grid
    const blanks = Array.from({ length: firstDay }, (_, i) => null);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const totalSlots = [...blanks, ...days];
    
    // Map records to a fast lookup
    const recordMap = {};
    data.records.forEach(r => {
      const d = new Date(r.date);
      if (d.getFullYear() === year && d.getMonth() === month) {
        recordMap[d.getDate()] = r.status;
      }
    });

    return { blanks, days, totalSlots, recordMap, year, month };
  };

  const { totalSlots, recordMap, month, year } = getCalendar();
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const getStatusColor = (status) => {
    if (status === 'Present') return 'bg-[#10b981] text-white shadow-inner';
    if (status === 'Absent') return 'bg-[#ef4444] text-white shadow-inner';
    if (status === 'Late') return 'bg-[#f59e0b] text-white shadow-inner';
    if (status === 'Leave') return 'bg-[#94a3b8] text-white shadow-inner';
    return 'bg-white hover:bg-[#f0fdf4] text-[#064e3b] border border-[#d1fae5]';
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#a7f3d0] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <h1 className="text-2xl font-black text-[#064e3b] flex items-center gap-3 tracking-tight">
          <div className="bg-[#ecfdf5] p-2 rounded-xl text-[#059669]">
            <FiCalendar size={24} />
          </div>
          My Attendance
        </h1>
        <div className="bg-[#f0fdf4] border border-[#a7f3d0] px-6 py-2 rounded-xl">
          <span className="text-xs uppercase tracking-widest text-[#059669] font-bold block mb-1">Overall Percentage</span>
          <span className={`text-3xl font-black font-mono ${getPercentageColor(data.summary.percentage)}`}>
            {data.summary.percentage}%
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#a7f3d0] text-center shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#064e3b] opacity-60">Total Days</p>
          <p className="text-3xl font-black text-[#064e3b] mt-1 font-mono">{data.summary.total || 0}</p>
        </div>
        <div className="bg-[#ecfdf5] p-5 rounded-2xl border border-[#a7f3d0] text-center shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#059669]">Present</p>
          <p className="text-3xl font-black text-[#10b981] mt-1 font-mono">{data.summary.present || 0}</p>
        </div>
        <div className="bg-[#fee2e2] p-5 rounded-2xl border border-[#fca5a5] text-center shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#b91c1c]">Absent</p>
          <p className="text-3xl font-black text-[#ef4444] mt-1 font-mono">{data.summary.absent || 0}</p>
        </div>
        <div className="bg-[#fef3c7] p-5 rounded-2xl border border-[#fde68a] text-center shadow-sm">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#b45309]">Late</p>
          <p className="text-3xl font-black text-[#f59e0b] mt-1 font-mono">{data.summary.late || 0}</p>
        </div>
        <div className="bg-[#f1f5f9] p-5 rounded-2xl border border-[#cbd5e1] text-center shadow-sm md:col-span-1 col-span-2">
          <p className="text-[10px] font-bold uppercase tracking-widest text-[#475569]">Leave</p>
          <p className="text-3xl font-black text-[#64748b] mt-1 font-mono">{data.summary.leave || 0}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-[#a7f3d0] overflow-hidden">
        {/* Calendar Header */}
        <div className="bg-[#059669] text-white p-4 flex justify-between items-center">
          <button 
            onClick={handlePrevMonth} 
            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
          >
            <FiChevronLeft size={24} />
          </button>
          <h2 className="text-xl font-bold tracking-wide">
            {monthNames[month]} {year}
          </h2>
          <button 
            onClick={handleNextMonth} 
            className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
            disabled={year === new Date().getFullYear() && month === new Date().getMonth()}
          >
            <FiChevronRight size={24} />
          </button>
        </div>

        {/* Legend */}
        <div className="px-6 py-4 border-b border-[#a7f3d0] flex justify-center flex-wrap gap-4 text-xs font-bold uppercase tracking-wider text-[#064e3b]">
          <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#10b981]"></div> Present</span>
          <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#ef4444]"></div> Absent</span>
          <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#f59e0b]"></div> Late</span>
          <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#94a3b8]"></div> Leave</span>
          <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full border border-[#d1fae5]"></div> No Record</span>
        </div>

        {/* Calendar Grid */}
        <div className="p-6">
          <div className="grid grid-cols-7 gap-2 sm:gap-4 mb-2">
            {weekDays.map(day => (
              <div key={day} className="text-center text-xs font-bold text-[#059669] uppercase tracking-wider py-2">
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2 sm:gap-4">
            {totalSlots.map((slot, i) => (
              <div key={`slot-${i}`} className="aspect-square">
                {slot ? (
                  <div className={`w-full h-full p-2 flex flex-col items-center justify-center rounded-2xl transition-all duration-300 shadow-sm
                    ${getStatusColor(recordMap[slot])}
                  `}>
                    <span className="text-sm sm:text-lg font-bold font-mono">{slot}</span>
                  </div>
                ) : (
                  <div className="w-full h-full rounded-2xl bg-slate-50 opacity-50"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyAttendance;

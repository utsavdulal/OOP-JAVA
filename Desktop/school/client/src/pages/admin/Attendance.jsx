import { useState, useEffect } from 'react';
import { FiCalendar, FiSearch, FiSave, FiCheckCircle } from 'react-icons/fi';
import api from '../../utils/api';
import { showToast } from '../../components/admin/Toast';
import LoadingSpinner from '../../components/admin/LoadingSpinner';

const Attendance = () => {
  const [activeTab, setActiveTab] = useState('mark');
  const [loading, setLoading] = useState(false);
  
  // Mark Attendance State
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSection, setSelectedSection] = useState('');
  const [students, setStudents] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [saving, setSaving] = useState(false);

  // View Attendance State
  const [viewDate, setViewDate] = useState(new Date().toISOString().split('T')[0]);
  const [viewClass, setViewClass] = useState('');
  const [records, setRecords] = useState([]);

  // Fetch unique classes for dropdowns
  const [allClasses, setAllClasses] = useState([]);

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (activeTab === 'view') {
      fetchRecords();
    }
  }, [activeTab, viewDate, viewClass]);

  const fetchClasses = async () => {
    try {
      const res = await api.get('/students');
      const uniqueClasses = [...new Set(res.data.map(s => s.class))];
      setAllClasses(uniqueClasses);
    } catch (err) {}
  };

  const loadStudents = async () => {
    if (!selectedClass || !selectedSection) {
      showToast.error('Please select both class and section');
      return;
    }
    
    try {
      setLoading(true);
      const res = await api.get(`/students?search=${selectedSection}`);
      const filtered = res.data.filter(s => s.class === selectedClass && s.section === selectedSection);
      setStudents(filtered);
      
      // Initialize attendance data payload
      const initialData = {};
      filtered.forEach(s => {
        initialData[s._id] = 'Present'; // Default status
      });
      setAttendanceData(initialData);
      
      if (filtered.length === 0) {
        showToast.error('No students found for this class and section');
      }
    } catch (err) {
      showToast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (studentId, status) => {
    setAttendanceData(prev => ({ ...prev, [studentId]: status }));
  };

  const markAllAs = (status) => {
    const newData = {};
    students.forEach(s => {
      newData[s._id] = status;
    });
    setAttendanceData(newData);
  };

  const saveBulkAttendance = async () => {
    if (students.length === 0) return;
    
    try {
      setSaving(true);
      const payload = students.map(s => ({
        studentId: s._id,
        date: date,
        status: attendanceData[s._id],
        class: s.class,
        section: s.section
      }));

      await api.post('/attendance/bulk', payload);
      showToast.success('Attendance saved successfully');
    } catch (err) {
      showToast.error('Failed to save attendance');
    } finally {
      setSaving(false);
    }
  };

  const fetchRecords = async () => {
    try {
      setLoading(true);
      let query = `date=${viewDate}`;
      if (viewClass) query += `&class=${viewClass}`;
      
      const res = await api.get(`/attendance?${query}`);
      setRecords(res.data);
    } catch (err) {
      showToast.error('Failed to load attendance records');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 bg-white p-5 rounded-xl shadow-sm border border-slate-100">
        <FiCalendar className="text-blue-600 text-2xl" />
        <h1 className="text-2xl font-bold text-slate-800">Attendance Management</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="flex border-b border-slate-200">
          <button
            onClick={() => setActiveTab('mark')}
            className={`flex-1 py-4 text-sm font-medium transition-colors ${
              activeTab === 'mark' ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            Mark Attendance
          </button>
          <button
            onClick={() => setActiveTab('view')}
            className={`flex-1 py-4 text-sm font-medium transition-colors ${
              activeTab === 'view' ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            View Attendance
          </button>
        </div>

        <div className="p-6">
          {activeTab === 'mark' ? (
            <div className="space-y-6">
              <div className="flex flex-wrap items-end gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
                <div className="flex-1 min-w-[150px]">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                  <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full px-3 py-2 border rounded-lg outline-none bg-white" />
                </div>
                <div className="flex-1 min-w-[150px]">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Class</label>
                  <select value={selectedClass} onChange={e => setSelectedClass(e.target.value)} className="w-full px-3 py-2 border rounded-lg outline-none bg-white">
                    <option value="">Select Class</option>
                    {allClasses.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div className="flex-1 min-w-[150px]">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Section</label>
                  <select value={selectedSection} onChange={e => setSelectedSection(e.target.value)} className="w-full px-3 py-2 border rounded-lg outline-none bg-white">
                    <option value="">Select Section</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                  </select>
                </div>
                <div>
                  <button onClick={loadStudents} disabled={loading} className="px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 transition-colors flex items-center gap-2 h-10">
                    <FiSearch /> Load Students
                  </button>
                </div>
              </div>

              {loading ? <LoadingSpinner /> : students.length > 0 && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center bg-blue-50 p-3 rounded-lg border border-blue-100">
                    <div className="text-sm text-blue-800 font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                      Marking attendance for <strong>Class {selectedClass} - {selectedSection}</strong> on <strong>{new Date(date).toLocaleDateString()}</strong>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => markAllAs('Present')} className="text-xs bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-md hover:bg-emerald-200 font-bold whitespace-nowrap">All Present</button>
                      <button onClick={() => markAllAs('Absent')} className="text-xs bg-red-100 text-red-700 px-3 py-1.5 rounded-md hover:bg-red-200 font-bold hidden sm:block whitespace-nowrap">All Absent</button>
                    </div>
                  </div>

                  <div className="border border-slate-200 rounded-lg overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                      <thead className="bg-slate-50 border-b border-slate-200 uppercase text-xs font-semibold text-slate-600 tracking-wider">
                        <tr>
                          <th className="px-5 py-3">Roll No</th>
                          <th className="px-5 py-3">Student Name</th>
                          <th className="px-5 py-3 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {students.map(s => (
                          <tr key={s._id} className="hover:bg-slate-50 transition-colors">
                            <td className="px-5 py-3 font-mono text-slate-600">{s.rollNumber}</td>
                            <td className="px-5 py-3 font-medium text-slate-800">{s.fullName}</td>
                            <td className="px-5 py-3">
                              <div className="flex justify-center gap-2 sm:gap-4">
                                {['Present', 'Absent', 'Late', 'Leave'].map(status => (
                                  <label key={status} className={`flex items-center gap-1.5 cursor-pointer 
                                    ${attendanceData[s._id] === status ? 'text-slate-900 font-bold' : 'text-slate-500'}
                                  `}>
                                    <input 
                                      type="radio" 
                                      name={`status-${s._id}`} 
                                      value={status}
                                      checked={attendanceData[s._id] === status}
                                      onChange={() => handleStatusChange(s._id, status)}
                                      className={`w-4 h-4 cursor-pointer accent-blue-600`}
                                    />
                                    <span className="text-xs">{status}</span>
                                  </label>
                                ))}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button 
                      onClick={saveBulkAttendance} 
                      disabled={saving}
                      className="bg-blue-600 text-white px-8 py-2.5 rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2 transition-all shadow-sm"
                    >
                      {saving ? <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> Saving...</> : <><FiSave /> Save Attendance</>}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="flex flex-wrap items-end gap-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                  <input type="date" value={viewDate} onChange={e => setViewDate(e.target.value)} className="w-full px-3 py-2 border rounded-lg outline-none bg-white" />
                </div>
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Class Filter (Optional)</label>
                  <select value={viewClass} onChange={e => setViewClass(e.target.value)} className="w-full px-3 py-2 border rounded-lg outline-none bg-white">
                    <option value="">All Classes</option>
                    {allClasses.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {loading ? <LoadingSpinner /> : (
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                      <thead className="bg-slate-50 border-b border-slate-200 uppercase text-xs font-semibold text-slate-600 tracking-wider">
                        <tr>
                          <th className="px-5 py-3">Roll No</th>
                          <th className="px-5 py-3">Student Name</th>
                          <th className="px-5 py-3">Class/Sec</th>
                          <th className="px-5 py-3 text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {records.length === 0 ? (
                          <tr><td colSpan="4" className="px-5 py-10 text-center text-slate-500">No attendance records found for this date</td></tr>
                        ) : (
                          records.map(r => (
                            <tr key={r._id} className="hover:bg-slate-50 transition-colors">
                              <td className="px-5 py-3 font-mono text-slate-600">{r.studentId?.rollNumber}</td>
                              <td className="px-5 py-3 font-medium text-slate-800">{r.studentId?.fullName}</td>
                              <td className="px-5 py-3"><span className="bg-slate-100 px-2 py-1 rounded text-xs">{r.class} - {r.section}</span></td>
                              <td className="px-5 py-3 text-center">
                                <span className={`px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5
                                  ${r.status === 'Present' ? 'bg-emerald-100 text-emerald-700' : 
                                    r.status === 'Absent' ? 'bg-red-100 text-red-700' : 
                                    r.status === 'Late' ? 'bg-orange-100 text-orange-700' : 
                                    'bg-slate-100 text-slate-700'}`
                                }>
                                  {r.status === 'Present' && <FiCheckCircle size={12}/>} {r.status}
                                </span>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Attendance;

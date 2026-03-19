import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiUser, FiActivity, FiCalendar, FiDollarSign, FiPlus, FiEdit2, FiTrash2 } from 'react-icons/fi';
import api from '../../utils/api';
import Modal from '../../components/admin/Modal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { showToast } from '../../components/admin/Toast';
import LoadingSpinner from '../../components/admin/LoadingSpinner';

const StudentProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  // Data states for tabs
  const [results, setResults] = useState([]);
  const [attendance, setAttendance] = useState({ summary: {}, records: [] });
  const [fees, setFees] = useState([]);

  // Modals
  const [resultModalOpen, setResultModalOpen] = useState(false);
  const [feeModalOpen, setFeeModalOpen] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, type: '', id: null });

  useEffect(() => {
    fetchStudentProfile();
  }, [id]);

  useEffect(() => {
    if (student) {
      if (activeTab === 'results') fetchResults();
      if (activeTab === 'attendance') fetchAttendance();
      if (activeTab === 'fees') fetchFees();
    }
  }, [activeTab, student]);

  const fetchStudentProfile = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/students/${id}`);
      setStudent(res.data);
    } catch (err) {
      showToast.error('Failed to load student profile');
      navigate('/admin/students');
    } finally {
      setLoading(false);
    }
  };

  const fetchResults = async () => {
    try {
      const res = await api.get(`/results?studentId=${id}`);
      setResults(res.data);
    } catch (err) { showToast.error('Failed to load results'); }
  };

  const fetchAttendance = async () => {
    try {
      const res = await api.get(`/attendance/summary/${id}`);
      setAttendance(res.data);
    } catch (err) { showToast.error('Failed to load attendance'); }
  };

  const fetchFees = async () => {
    try {
      const res = await api.get(`/fees?studentId=${id}`);
      setFees(res.data);
    } catch (err) { showToast.error('Failed to load fees'); }
  };

  if (loading || !student) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {/* Header Profile Section */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="h-24 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
        <div className="px-6 sm:px-10 pb-6 relative flex flex-col sm:flex-row gap-6 items-start sm:items-end">
          <button 
            onClick={() => navigate('/admin/students')}
            className="absolute top-4 right-6 text-white/80 hover:text-white flex items-center gap-1 font-medium transition-colors"
          >
            <FiArrowLeft /> Back to List
          </button>
          
          <div className="-mt-12 bg-white p-1.5 rounded-full border border-slate-200 shadow-md">
            <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center text-slate-400 overflow-hidden">
              {student.photo ? (
                <img src={student.photo} alt={student.fullName} className="w-full h-full object-cover" />
              ) : (
                <FiUser size={40} />
              )}
            </div>
          </div>
          
          <div className="flex-1 pb-1">
            <h1 className="text-2xl font-bold text-slate-800">{student.fullName}</h1>
            <div className="flex flex-wrap items-center gap-3 mt-1.5 text-sm text-slate-600">
              <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-md font-semibold">
                Class {student.class} - {student.section}
              </span>
              <span className="bg-slate-100 px-2.5 py-1 rounded-md font-medium font-mono">
                Roll: {student.rollNumber}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-white px-2 pt-2 gap-1 overflow-x-auto rounded-t-xl border border-slate-100 border-b-0">
        {[
          { id: 'overview', icon: <FiUser />, label: 'Overview' },
          { id: 'results', icon: <FiActivity />, label: 'Results' },
          { id: 'attendance', icon: <FiCalendar />, label: 'Attendance' },
          { id: 'fees', icon: <FiDollarSign />, label: 'Fees' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-5 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap
              ${activeTab === tab.id 
                ? 'border-blue-600 text-blue-600 bg-blue-50/50 rounded-t-lg'
                : 'border-transparent text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-t-lg'
              }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content Container */}
      <div className="bg-white p-6 rounded-b-xl rounded-tr-xl shadow-sm border border-slate-100 min-h-[400px]">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-800 border-b pb-2">Personal Details</h3>
              <div className="grid grid-cols-3 gap-y-3 gap-x-4 text-sm">
                <div className="text-slate-500 font-medium">DOB:</div>
                <div className="col-span-2 text-slate-800">{new Date(student.dateOfBirth).toLocaleDateString()}</div>
                <div className="text-slate-500 font-medium">Gender:</div>
                <div className="col-span-2 text-slate-800">{student.gender}</div>
                <div className="text-slate-500 font-medium">Email:</div>
                <div className="col-span-2 text-slate-800">{student.email || '-'}</div>
                <div className="text-slate-500 font-medium">Phone:</div>
                <div className="col-span-2 text-slate-800">{student.phone || '-'}</div>
              </div>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-800 border-b pb-2">Guardian & Address</h3>
              <div className="grid grid-cols-3 gap-y-3 gap-x-4 text-sm">
                <div className="text-slate-500 font-medium">Guardian:</div>
                <div className="col-span-2 text-slate-800">{student.guardianName || '-'}</div>
                <div className="text-slate-500 font-medium">Phone:</div>
                <div className="col-span-2 text-slate-800">{student.guardianPhone || '-'}</div>
                <div className="text-slate-500 font-medium">Address:</div>
                <div className="col-span-2 text-slate-800">{student.address || '-'}</div>
                <div className="text-slate-500 font-medium">Joined:</div>
                <div className="col-span-2 text-slate-800">{new Date(student.createdAt).toLocaleDateString()}</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'results' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-800">Academic Results</h3>
              <button onClick={() => navigate('/admin/results')} className="text-sm font-medium text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">
                Manage Results
              </button>
            </div>
            
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase text-xs font-semibold">
                  <tr>
                    <th className="px-4 py-3">Subject</th>
                    <th className="px-4 py-3">Exam</th>
                    <th className="px-4 py-3 text-center">Marks</th>
                    <th className="px-4 py-3 text-center">Grade</th>
                    <th className="px-4 py-3">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {results.length === 0 ? (
                    <tr><td colSpan="5" className="px-4 py-8 text-center text-slate-500">No results recorded</td></tr>
                  ) : (
                    results.map(r => (
                      <tr key={r._id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-medium text-slate-900">{r.subject}</td>
                        <td className="px-4 py-3"><span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs">{r.examType}</span></td>
                        <td className="px-4 py-3 text-center font-mono">{r.marksObtained} / {r.fullMarks}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${['A+','A'].includes(r.grade) ? 'bg-emerald-100 text-emerald-700' : ['F','D'].includes(r.grade) ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                            {r.grade}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-600 text-xs">{r.remarks || '-'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'attendance' && (
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-800">Attendance Summary</h3>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-blue-50 p-4 rounded-xl text-center border border-blue-100">
                <p className="text-xs text-blue-800 font-bold uppercase tracking-wider">Total Days</p>
                <h4 className="text-3xl font-black text-blue-600 mt-1">{attendance.summary.total || 0}</h4>
              </div>
              <div className="bg-emerald-50 p-4 rounded-xl text-center border border-emerald-100">
                <p className="text-xs text-emerald-800 font-bold uppercase tracking-wider">Present</p>
                <h4 className="text-3xl font-black text-emerald-600 mt-1">{attendance.summary.present || 0}</h4>
              </div>
              <div className="bg-red-50 p-4 rounded-xl text-center border border-red-100">
                <p className="text-xs text-red-800 font-bold uppercase tracking-wider">Absent</p>
                <h4 className="text-3xl font-black text-red-600 mt-1">{attendance.summary.absent || 0}</h4>
              </div>
              <div className="bg-orange-50 p-4 rounded-xl text-center border border-orange-100">
                <p className="text-xs text-orange-800 font-bold uppercase tracking-wider">Late</p>
                <h4 className="text-3xl font-black text-orange-600 mt-1">{attendance.summary.late || 0}</h4>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl text-center border border-slate-200 shadow-inner">
                <p className="text-xs text-slate-600 font-bold uppercase tracking-wider">%</p>
                <h4 className="text-3xl font-black text-slate-700 mt-1">{attendance.summary.percentage || 0}%</h4>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'fees' && (
          <div className="space-y-4">
             <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-800">Fee Records</h3>
              <button onClick={() => navigate('/admin/fees')} className="text-sm font-medium text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1">
                Manage Fees
              </button>
            </div>
            
            <div className="overflow-x-auto border border-slate-200 rounded-lg">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase text-xs font-semibold">
                  <tr>
                    <th className="px-4 py-3">Fee Type</th>
                    <th className="px-4 py-3 text-right">Total</th>
                    <th className="px-4 py-3 text-right">Paid</th>
                    <th className="px-4 py-3 text-center">Status</th>
                    <th className="px-4 py-3">Due Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {fees.length === 0 ? (
                    <tr><td colSpan="5" className="px-4 py-8 text-center text-slate-500">No fee records</td></tr>
                  ) : (
                    fees.map(f => (
                      <tr key={f._id} className="hover:bg-slate-50">
                        <td className="px-4 py-3 font-medium text-slate-900">{f.feeType}</td>
                        <td className="px-4 py-3 text-right font-mono text-slate-600">Rs. {f.totalAmount}</td>
                        <td className="px-4 py-3 text-right font-mono text-emerald-600">Rs. {f.paidAmount}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                            f.status === 'Paid' ? 'bg-emerald-100 text-emerald-700' : 
                            f.status === 'Partial' ? 'bg-orange-100 text-orange-700' : 
                            'bg-red-100 text-red-700'
                          }`}>
                            {f.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-600 text-xs">{new Date(f.dueDate).toLocaleDateString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentProfile;

import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiArrowLeft, FiUser, FiBook, FiCalendar, FiDollarSign, FiEdit2 } from 'react-icons/fi';

const StudentProfile = ({ studentId, onBack, onEditStudent }) => {
  const [student, setStudent] = useState(null);
  const [results, setResults] = useState([]);
  const [resultStats, setResultStats] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [attendanceStats, setAttendanceStats] = useState(null);
  const [feeData, setFeeData] = useState({ payments: [], summary: null });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    if (studentId) {
      fetchStudentData();
    }
  }, [studentId]);

  const fetchStudentData = async () => {
    try {
      setLoading(true);
      const [studentRes, resultsRes, attendanceRes, feesRes] = await Promise.all([
         axios.get(`${API_URL}/students/${studentId}`, { withCredentials: true }),
         axios.get(`${API_URL}/results/student/${studentId}`, { withCredentials: true }),
         axios.get(`${API_URL}/attendance/student/${studentId}`, { withCredentials: true }),
         axios.get(`${API_URL}/fees/payments/student/${studentId}`, { withCredentials: true }),
       ]);

      if (studentRes.data.success) setStudent(studentRes.data.student);
      if (resultsRes.data.success) {
        setResults(resultsRes.data.results);
        setResultStats(resultsRes.data.stats);
      }
      if (attendanceRes.data.success) {
        setAttendance(attendanceRes.data.attendance);
        setAttendanceStats(attendanceRes.data.stats);
      }
      if (feesRes.data.success) {
        setFeeData({ payments: feesRes.data.payments, summary: feesRes.data.summary });
      }
    } catch (error) {
      toast.error('Failed to fetch student data');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getGradeColor = (grade) => {
    switch (grade) {
      case 'A+':
      case 'A':
        return 'bg-green-100 text-green-800';
      case 'B+':
      case 'B':
        return 'bg-blue-100 text-blue-800';
      case 'C+':
      case 'C':
        return 'bg-yellow-100 text-yellow-800';
      case 'F':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800';
      case 'absent':
        return 'bg-red-100 text-red-800';
      case 'late':
        return 'bg-yellow-100 text-yellow-800';
      case 'leave':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview', icon: <FiUser /> },
    { id: 'results', label: 'Results', icon: <FiBook /> },
    { id: 'attendance', label: 'Attendance', icon: <FiCalendar /> },
    { id: 'fees', label: 'Fees', icon: <FiDollarSign /> },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Student not found</p>
        <button onClick={onBack} className="mt-4 text-blue-600 hover:underline">
          Go back to students list
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition"
          >
            <FiArrowLeft size={24} />
          </button>
          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              {student.firstName} {student.lastName}
            </h2>
            <p className="text-gray-500">{student.rollNumber} | {student.program} - Semester {student.semester}</p>
          </div>
        </div>
        <button
          onClick={() => onEditStudent(student)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          <FiEdit2 /> Edit Profile
        </button>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 border-b-2 transition ${
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Personal Info */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Email</span>
                <span className="font-medium">{student.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Phone</span>
                <span className="font-medium">{student.phone || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Date of Birth</span>
                <span className="font-medium">
                  {student.dateOfBirth ? new Date(student.dateOfBirth).toLocaleDateString() : '-'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Gender</span>
                <span className="font-medium capitalize">{student.gender || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  student.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                }`}>
                  {student.status}
                </span>
              </div>
            </div>
          </div>

          {/* Guardian Info */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Guardian Information</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-500">Parent Phone</span>
                <span className="font-medium">{student.parentPhone || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Address</span>
                <span className="font-medium">{student.address || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">City</span>
                <span className="font-medium">{student.city || '-'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">State</span>
                <span className="font-medium">{student.state || '-'}</span>
              </div>
            </div>
          </div>

          {/* Academic Summary */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Academic Summary</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{resultStats?.overallPercentage || 0}%</div>
                <div className="text-sm text-gray-500">Overall Percentage</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{resultStats?.passedSubjects || 0}</div>
                <div className="text-sm text-gray-500">Subjects Passed</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{resultStats?.failedSubjects || 0}</div>
                <div className="text-sm text-gray-500">Subjects Failed</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{student.gpa || 0}</div>
                <div className="text-sm text-gray-500">GPA</div>
              </div>
            </div>
          </div>

          {/* Attendance Summary */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Attendance Summary</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{attendanceStats?.percentage || 0}%</div>
                <div className="text-sm text-gray-500">Attendance Rate</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{attendanceStats?.present || 0}</div>
                <div className="text-sm text-gray-500">Days Present</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">{attendanceStats?.absent || 0}</div>
                <div className="text-sm text-gray-500">Days Absent</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">{attendanceStats?.late || 0}</div>
                <div className="text-sm text-gray-500">Days Late</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'results' && (
        <div className="space-y-4">
          {/* Stats Cards */}
          {resultStats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg shadow text-center">
                <div className="text-2xl font-bold text-blue-600">{results.length}</div>
                <div className="text-sm text-gray-500">Total Exams</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow text-center">
                <div className="text-2xl font-bold text-green-600">{resultStats.overallPercentage}%</div>
                <div className="text-sm text-gray-500">Overall %</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow text-center">
                <div className="text-2xl font-bold text-green-600">{resultStats.passedSubjects}</div>
                <div className="text-sm text-gray-500">Passed</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow text-center">
                <div className="text-2xl font-bold text-red-600">{resultStats.failedSubjects}</div>
                <div className="text-sm text-gray-500">Failed</div>
              </div>
            </div>
          )}

          {/* Results Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Exam Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Marks</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grade</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {results.length > 0 ? (
                  results.map((result) => (
                    <tr key={result._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{result.subject}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 capitalize">
                          {result.examType.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {result.marksObtained} / {result.fullMarks} ({result.percentage}%)
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full font-semibold ${getGradeColor(result.grade)}`}>
                          {result.grade}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${result.isPassed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {result.isPassed ? 'Passed' : 'Failed'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No results recorded yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'attendance' && (
        <div className="space-y-4">
          {/* Stats Cards */}
          {attendanceStats && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="bg-white p-4 rounded-lg shadow text-center">
                <div className="text-2xl font-bold text-blue-600">{attendanceStats.total}</div>
                <div className="text-sm text-gray-500">Total Days</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow text-center">
                <div className="text-2xl font-bold text-green-600">{attendanceStats.present}</div>
                <div className="text-sm text-gray-500">Present</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow text-center">
                <div className="text-2xl font-bold text-red-600">{attendanceStats.absent}</div>
                <div className="text-sm text-gray-500">Absent</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow text-center">
                <div className="text-2xl font-bold text-yellow-600">{attendanceStats.late}</div>
                <div className="text-sm text-gray-500">Late</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow text-center">
                <div className="text-2xl font-bold text-purple-600">{attendanceStats.percentage}%</div>
                <div className="text-sm text-gray-500">Attendance %</div>
              </div>
            </div>
          )}

          {/* Attendance Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Remarks</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {attendance.length > 0 ? (
                  attendance.map((record) => (
                    <tr key={record._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(record.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full capitalize ${getStatusColor(record.status)}`}>
                          {record.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.remarks || '-'}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-6 py-8 text-center text-gray-500">No attendance records yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'fees' && (
        <div className="space-y-4">
          {/* Fee Summary */}
          {feeData.summary && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg shadow text-center">
                <div className="text-2xl font-bold text-blue-600">NPR {feeData.summary.totalFees?.toLocaleString() || 0}</div>
                <div className="text-sm text-gray-500">Total Fees</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow text-center">
                <div className="text-2xl font-bold text-green-600">NPR {feeData.summary.totalPaid?.toLocaleString() || 0}</div>
                <div className="text-sm text-gray-500">Total Paid</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow text-center">
                <div className="text-2xl font-bold text-red-600">NPR {feeData.summary.outstanding?.toLocaleString() || 0}</div>
                <div className="text-sm text-gray-500">Outstanding</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow text-center">
                <span className={`px-3 py-1 text-sm rounded-full capitalize ${
                  feeData.summary.status === 'paid' ? 'bg-green-100 text-green-800' :
                  feeData.summary.status === 'partial' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {feeData.summary.status || 'unpaid'}
                </span>
                <div className="text-sm text-gray-500 mt-2">Status</div>
              </div>
            </div>
          )}

          {/* Payment History */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-4 border-b bg-gray-50">
              <h3 className="font-semibold text-gray-800">Payment History</h3>
            </div>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fee Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Receipt</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {feeData.payments.length > 0 ? (
                  feeData.payments.map((payment) => (
                    <tr key={payment._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(payment.paymentDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {payment.feeStructure?.name || 'N/A'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        NPR {payment.amountPaid.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                        {payment.paymentMethod.replace('_', ' ')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.receiptNumber}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-8 text-center text-gray-500">No payment records yet</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentProfile;

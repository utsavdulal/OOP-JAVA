import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiCheck, FiX, FiClock, FiCalendar } from 'react-icons/fi';

const AttendanceManager = () => {
  const [students, setStudents] = useState([]);
  const [attendanceData, setAttendanceData] = useState([]);
  const [existingAttendance, setExistingAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [filters, setFilters] = useState({
    program: '',
    semester: '',
  });
  const [programs, setPrograms] = useState([]);
  const [viewMode, setViewMode] = useState('mark'); // 'mark' or 'history'
  const [historyFilters, setHistoryFilters] = useState({
    student: '',
    startDate: '',
    endDate: '',
  });
  const [attendanceHistory, setAttendanceHistory] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchAllStudents();
  }, []);

  const fetchAllStudents = async () => {
    try {
      const response = await axios.get(`${API_URL}/students`, {
        withCredentials: true,
      });
      if (response.data.success) {
        const uniquePrograms = [...new Set(response.data.students.map((s) => s.program).filter(Boolean))];
        setPrograms(uniquePrograms);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchStudentsForAttendance = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.program) params.append('program', filters.program);
      if (filters.semester) params.append('semester', filters.semester);

      const response = await axios.get(`${API_URL}/attendance/students?${params}`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setStudents(response.data.students);
        // Initialize attendance data
        const initialData = response.data.students.map((s) => ({
          student: s._id,
          status: 'present',
          remarks: '',
        }));
        setAttendanceData(initialData);

        // Fetch existing attendance for the date
        fetchExistingAttendance();
      }
    } catch (error) {
      toast.error('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  const fetchExistingAttendance = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.program) params.append('program', filters.program);
      if (filters.semester) params.append('semester', filters.semester);

      const response = await axios.get(`${API_URL}/attendance/date/${selectedDate}?${params}`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setExistingAttendance(response.data.attendance);
        // Update attendance data with existing records
        if (response.data.attendance.length > 0) {
          setAttendanceData((prev) =>
            prev.map((item) => {
              const existing = response.data.attendance.find((a) => a.student?._id === item.student);
              if (existing) {
                return { ...item, status: existing.status, remarks: existing.remarks || '' };
              }
              return item;
            })
          );
        }
      }
    } catch (error) {
      console.error('Error fetching existing attendance:', error);
    }
  };

  useEffect(() => {
    if (filters.program || filters.semester) {
      fetchStudentsForAttendance();
    }
  }, [filters, selectedDate]);

  const fetchAttendanceHistory = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (historyFilters.student) params.append('student', historyFilters.student);
      if (historyFilters.startDate) params.append('startDate', historyFilters.startDate);
      if (historyFilters.endDate) params.append('endDate', historyFilters.endDate);

      const response = await axios.get(`${API_URL}/attendance?${params}`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setAttendanceHistory(response.data.attendance);
      }
    } catch (error) {
      toast.error('Failed to fetch attendance history');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (studentId, status) => {
    setAttendanceData((prev) => prev.map((item) => (item.student === studentId ? { ...item, status } : item)));
  };

  const handleRemarksChange = (studentId, remarks) => {
    setAttendanceData((prev) => prev.map((item) => (item.student === studentId ? { ...item, remarks } : item)));
  };

  const handleSubmitAttendance = async () => {
    if (!filters.program && !filters.semester) {
      toast.error('Please select program and semester first');
      return;
    }

    try {
      setLoading(true);
       const response = await axios.post(
         `${API_URL}/attendance/bulk`,
         {
           date: selectedDate,
           attendanceData,
           program: filters.program,
           semester: parseInt(filters.semester),
         },
         { withCredentials: true }
       );

      if (response.data.success) {
        toast.success(`Attendance marked for ${response.data.count} students`);
        fetchExistingAttendance();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to mark attendance');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'absent':
        return 'bg-red-100 text-red-800 border-red-300';
      case 'late':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'leave':
        return 'bg-purple-100 text-purple-800 border-purple-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'present':
        return <FiCheck className="inline" />;
      case 'absent':
        return <FiX className="inline" />;
      case 'late':
        return <FiClock className="inline" />;
      case 'leave':
        return <FiCalendar className="inline" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">Attendance Management</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('mark')}
            className={`px-4 py-2 rounded-lg transition ${
              viewMode === 'mark' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Mark Attendance
          </button>
          <button
            onClick={() => {
              setViewMode('history');
              fetchAttendanceHistory();
            }}
            className={`px-4 py-2 rounded-lg transition ${
              viewMode === 'history' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            View History
          </button>
        </div>
      </div>

      {viewMode === 'mark' ? (
        <>
          {/* Filters for marking */}
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Program *</label>
                <select
                  value={filters.program}
                  onChange={(e) => setFilters((prev) => ({ ...prev, program: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                >
                  <option value="">Select Program</option>
                  {programs.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Semester *</label>
                <select
                  value={filters.semester}
                  onChange={(e) => setFilters((prev) => ({ ...prev, semester: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                >
                  <option value="">Select Semester</option>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                    <option key={s} value={s}>
                      Semester {s}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Students List for Attendance */}
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : students.length > 0 ? (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="p-4 border-b bg-gray-50">
                <div className="flex justify-between items-center">
                  <span className="font-medium">
                    {students.length} students found for {filters.program} - Semester {filters.semester}
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setAttendanceData((prev) => prev.map((item) => ({ ...item, status: 'present' })))}
                      className="px-3 py-1 text-sm bg-green-100 text-green-800 rounded hover:bg-green-200"
                    >
                      Mark All Present
                    </button>
                    <button
                      onClick={() => setAttendanceData((prev) => prev.map((item) => ({ ...item, status: 'absent' })))}
                      className="px-3 py-1 text-sm bg-red-100 text-red-800 rounded hover:bg-red-200"
                    >
                      Mark All Absent
                    </button>
                  </div>
                </div>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Roll No.</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {students.map((student) => {
                      const attendance = attendanceData.find((a) => a.student === student._id);
                      return (
                        <tr key={student._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {student.rollNumber}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {student.firstName} {student.lastName}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex gap-2">
                              {['present', 'absent', 'late', 'leave'].map((status) => (
                                <button
                                  key={status}
                                  onClick={() => handleStatusChange(student._id, status)}
                                  className={`px-3 py-1 text-xs rounded-full border-2 capitalize transition ${
                                    attendance?.status === status
                                      ? getStatusColor(status) + ' border-2'
                                      : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
                                  }`}
                                >
                                  {getStatusIcon(status)} {status}
                                </button>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <input
                              type="text"
                              value={attendance?.remarks || ''}
                              onChange={(e) => handleRemarksChange(student._id, e.target.value)}
                              placeholder="Optional remarks"
                              className="w-full px-2 py-1 text-sm border border-gray-300 rounded focus:ring-1 focus:ring-blue-600"
                            />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="p-4 border-t bg-gray-50">
                <button
                  onClick={handleSubmitAttendance}
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Save Attendance'}
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white p-8 rounded-lg shadow text-center text-gray-500">
              {filters.program && filters.semester
                ? 'No students found for the selected program and semester.'
                : 'Select a program and semester to mark attendance.'}
            </div>
          )}
        </>
      ) : (
        <>
          {/* History View */}
          <div className="bg-white p-4 rounded-lg shadow">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Student</label>
                <select
                  value={historyFilters.student}
                  onChange={(e) => setHistoryFilters((prev) => ({ ...prev, student: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                >
                  <option value="">All Students</option>
                  {students.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.rollNumber} - {s.firstName} {s.lastName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                <input
                  type="date"
                  value={historyFilters.startDate}
                  onChange={(e) => setHistoryFilters((prev) => ({ ...prev, startDate: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                <input
                  type="date"
                  value={historyFilters.endDate}
                  onChange={(e) => setHistoryFilters((prev) => ({ ...prev, endDate: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                />
              </div>
              <div className="flex items-end">
                <button
                  onClick={fetchAttendanceHistory}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Search
                </button>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Program</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {attendanceHistory.length > 0 ? (
                      attendanceHistory.map((record) => (
                        <tr key={record._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {new Date(record.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {record.student?.firstName} {record.student?.lastName}
                            </div>
                            <div className="text-sm text-gray-500">{record.student?.rollNumber}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {record.program} - Sem {record.semester}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 py-1 text-xs rounded-full capitalize ${getStatusColor(record.status)}`}>
                              {getStatusIcon(record.status)} {record.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{record.remarks || '-'}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                          No attendance records found. Use filters to search.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AttendanceManager;

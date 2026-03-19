import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiEdit2, FiTrash2, FiX } from 'react-icons/fi';

const ResultsManager = () => {
  const [results, setResults] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [filters, setFilters] = useState({
    student: '',
    examType: '',
    semester: '',
  });
  const [formData, setFormData] = useState({
    student: '',
    subject: '',
    examType: 'midterm',
    marksObtained: '',
    fullMarks: '100',
    remarks: '',
    semester: '1',
    academicYear: new Date().getFullYear().toString(),
  });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchResults();
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const response = await axios.get(`${API_URL}/students`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setStudents(response.data.students);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchResults = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.student) params.append('student', filters.student);
      if (filters.examType) params.append('examType', filters.examType);
      if (filters.semester) params.append('semester', filters.semester);

      const response = await axios.get(`${API_URL}/results?${params}`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setResults(response.data.results);
      }
    } catch (error) {
      toast.error('Failed to fetch results');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults();
  }, [filters]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.student || !formData.subject || !formData.marksObtained || !formData.fullMarks) {
      toast.error('Student, subject, marks obtained, and full marks are required');
      return;
    }

    try {
      setLoading(true);
       if (editingId) {
         const response = await axios.put(`${API_URL}/results/${editingId}`, formData, {
           withCredentials: true,
         });
        if (response.data.success) {
          setResults(results.map((r) => (r._id === editingId ? response.data.result : r)));
          toast.success('Result updated successfully');
          setEditingId(null);
        }
       } else {
         const response = await axios.post(`${API_URL}/results`, formData, {
           withCredentials: true,
         });
        if (response.data.success) {
          setResults([response.data.result, ...results]);
          toast.success('Result added successfully');
        }
      }
      resetForm();
      setShowForm(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save result');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      student: '',
      subject: '',
      examType: 'midterm',
      marksObtained: '',
      fullMarks: '100',
      remarks: '',
      semester: '1',
      academicYear: new Date().getFullYear().toString(),
    });
  };

  const handleEdit = (result) => {
    setFormData({
      student: result.student?._id || '',
      subject: result.subject,
      examType: result.examType,
      marksObtained: result.marksObtained.toString(),
      fullMarks: result.fullMarks.toString(),
      remarks: result.remarks || '',
      semester: result.semester?.toString() || '1',
      academicYear: result.academicYear || new Date().getFullYear().toString(),
    });
    setEditingId(result._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this result?')) return;

    try {
      const response = await axios.delete(`${API_URL}/results/${id}`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setResults(results.filter((r) => r._id !== id));
        toast.success('Result deleted successfully');
      }
    } catch (error) {
      toast.error('Failed to delete result');
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">Results Management</h2>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            resetForm();
          }}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {showForm ? 'Cancel' : '+ Add Result'}
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Student</label>
            <select
              name="student"
              value={filters.student}
              onChange={handleFilterChange}
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Exam Type</label>
            <select
              name="examType"
              value={filters.examType}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
            >
              <option value="">All Exams</option>
              <option value="midterm">Midterm</option>
              <option value="final">Final</option>
              <option value="unit_test">Unit Test</option>
              <option value="practical">Practical</option>
              <option value="assignment">Assignment</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Semester</label>
            <select
              name="semester"
              value={filters.semester}
              onChange={handleFilterChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
            >
              <option value="">All Semesters</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                <option key={s} value={s}>
                  Semester {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold">{editingId ? 'Edit Result' : 'Add New Result'}</h3>
            <button onClick={() => setShowForm(false)} className="text-gray-500 hover:text-gray-700">
              <FiX size={24} />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Student *</label>
                <select
                  name="student"
                  value={formData.student}
                  onChange={handleChange}
                  disabled={editingId}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 disabled:bg-gray-100"
                >
                  <option value="">Select Student</option>
                  {students.map((s) => (
                    <option key={s._id} value={s._id}>
                      {s.rollNumber} - {s.firstName} {s.lastName}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                  placeholder="e.g., Mathematics"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Exam Type *</label>
                <select
                  name="examType"
                  value={formData.examType}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                >
                  <option value="midterm">Midterm</option>
                  <option value="final">Final</option>
                  <option value="unit_test">Unit Test</option>
                  <option value="practical">Practical</option>
                  <option value="assignment">Assignment</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                <select
                  name="semester"
                  value={formData.semester}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                    <option key={s} value={s}>
                      Semester {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Marks Obtained *</label>
                <input
                  type="number"
                  name="marksObtained"
                  value={formData.marksObtained}
                  onChange={handleChange}
                  min="0"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                  placeholder="e.g., 85"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Marks *</label>
                <input
                  type="number"
                  name="fullMarks"
                  value={formData.fullMarks}
                  onChange={handleChange}
                  min="1"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                  placeholder="e.g., 100"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year</label>
                <input
                  type="text"
                  name="academicYear"
                  value={formData.academicYear}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                  placeholder="e.g., 2024"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
              <textarea
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                placeholder="Any additional remarks..."
                rows="2"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Saving...' : editingId ? 'Update Result' : 'Add Result'}
            </button>
          </form>
        </div>
      )}

      {/* Results Table */}
      {loading && !showForm ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Exam Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Marks
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Grade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {results.length > 0 ? (
                  results.map((result) => (
                    <tr key={result._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {result.student?.firstName} {result.student?.lastName}
                        </div>
                        <div className="text-sm text-gray-500">{result.student?.rollNumber}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{result.subject}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 capitalize">
                          {result.examType.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {result.marksObtained} / {result.fullMarks}
                        <span className="text-gray-500 ml-1">({result.percentage}%)</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full font-semibold ${getGradeColor(result.grade)}`}>
                          {result.grade}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            result.isPassed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {result.isPassed ? 'Passed' : 'Failed'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEdit(result)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          <FiEdit2 size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(result._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <FiTrash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                      No results found. Add a result to get started.
                    </td>
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

export default ResultsManager;

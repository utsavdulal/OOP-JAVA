import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiEdit2, FiTrash2, FiChevronDown, FiChevronUp, FiUser } from 'react-icons/fi';
import PhotoUploadInput from '../PhotoUploadInput';

const StudentDetailsManager = ({ onViewProfile, editingStudent, clearEditingStudent }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [expandedId, setExpandedId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    rollNumber: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    parentPhone: '',
    dateOfBirth: '',
    gender: '',
    program: '',
    semester: '1',
    address: '',
    city: '',
    state: '',
    pincode: '',
    status: 'active',
    gpa: '',
    notes: '',
    photo: null,
  });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchStudents();
  }, []);

  // Handle editing student from profile page
  useEffect(() => {
    if (editingStudent) {
      handleEdit(editingStudent);
      if (clearEditingStudent) clearEditingStudent();
    }
  }, [editingStudent]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/students`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setStudents(response.data.students);
      }
    } catch (error) {
      toast.error('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.rollNumber || !formData.firstName || !formData.lastName || !formData.email) {
      toast.error('Roll number, name, and email are required');
      return;
    }

    try {
      setLoading(true);
       if (editingId) {
         const response = await axios.put(
           `${API_URL}/students/${editingId}`,
           formData,
           { withCredentials: true }
         );
        if (response.data.success) {
          setStudents(students.map((s) => (s._id === editingId ? response.data.student : s)));
          toast.success('Student updated successfully');
          setEditingId(null);
        }
       } else {
         const response = await axios.post(`${API_URL}/students`, formData, {
           withCredentials: true,
         });
        if (response.data.success) {
          setStudents([response.data.student, ...students]);
          toast.success('Student added successfully');
        }
      }
      resetForm();
      setShowForm(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save student');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      rollNumber: '',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      parentPhone: '',
      dateOfBirth: '',
      gender: '',
      program: '',
      semester: '1',
      address: '',
      city: '',
      state: '',
      pincode: '',
      status: 'active',
      gpa: '',
      notes: '',
      photo: null,
    });
  };

  const handleEdit = (student) => {
    setFormData({
      rollNumber: student.rollNumber,
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      phone: student.phone || '',
      parentPhone: student.parentPhone || '',
      dateOfBirth: student.dateOfBirth ? student.dateOfBirth.split('T')[0] : '',
      gender: student.gender || '',
      program: student.program || '',
      semester: student.semester || '1',
      address: student.address || '',
      city: student.city || '',
      state: student.state || '',
      pincode: student.pincode || '',
      status: student.status || 'active',
      gpa: student.gpa || '',
      notes: student.notes || '',
      photo: student.photo || null,
    });
    setEditingId(student._id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this student?')) return;

    try {
      const response = await axios.delete(`${API_URL}/students/${id}`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setStudents(students.filter((s) => s._id !== id));
        toast.success('Student deleted successfully');
      }
    } catch (error) {
      toast.error('Failed to delete student');
    }
  };

  const filteredStudents = students.filter(
    (s) =>
      s.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">Student Records</h2>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            resetForm();
          }}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {showForm ? 'Cancel' : '+ Add Student'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">{editingId ? 'Edit Student' : 'Add New Student'}</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Roll Number *</label>
                <input
                  type="text"
                  name="rollNumber"
                  value={formData.rollNumber}
                  onChange={handleChange}
                  disabled={editingId}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 disabled:bg-gray-100"
                  placeholder="e.g., CS2024001"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                  placeholder="student@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                  placeholder="First name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                  placeholder="Last name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600" placeholder="Student phone" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Parent Phone</label>
                <input type="tel" name="parentPhone" value={formData.parentPhone} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600" placeholder="Parent phone" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <input type="date" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600">
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Program</label>
                <input type="text" name="program" value={formData.program} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600" placeholder="e.g., Computer Science" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Semester</label>
                <select name="semester" value={formData.semester} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600">
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                    <option key={s} value={s}>
                      Semester {s}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600">
                  <option value="active">Active</option>
                  <option value="graduated">Graduated</option>
                  <option value="dropped">Dropped</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">GPA</label>
                <input type="number" name="gpa" value={formData.gpa} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600" placeholder="0.00" step="0.01" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input type="text" name="address" value={formData.address} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600" placeholder="Street address" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600" placeholder="City" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
                <input type="text" name="state" value={formData.state} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600" placeholder="State" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
                <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600" placeholder="Pincode" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
              <textarea name="notes" value={formData.notes} onChange={handleChange} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600" placeholder="Additional notes..." rows="3" />
            </div>

            <div>
              <PhotoUploadInput
                value={formData.photo}
                onChange={(photo) => setFormData(prev => ({ ...prev, photo }))}
                label="Student Photo"
              />
            </div>

            <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50">
              {loading ? 'Saving...' : editingId ? 'Update' : 'Add'} Student
            </button>
          </form>
        </div>
      )}

      <div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
          placeholder="Search by roll number, name, or email..."
        />
      </div>

      {loading && !showForm ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredStudents.length > 0 ? (
            filteredStudents.map((student) => (
              <div key={student._id} className="bg-white rounded-lg shadow hover:shadow-lg transition">
                <button
                  onClick={() => setExpandedId(expandedId === student._id ? null : student._id)}
                  className="w-full p-4 flex justify-between items-center hover:bg-gray-50 transition"
                >
                  <div className="text-left flex items-center gap-4">
                    <div className="relative w-12 h-12 flex-shrink-0">
                      {student.photo ? (
                        <img
                          src={student.photo}
                          alt={`${student.firstName} ${student.lastName}`}
                          className="w-full h-full rounded-full object-cover border-2 border-blue-200"
                        />
                      ) : (
                        <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                          {student.firstName?.[0]}{student.lastName?.[0]}
                        </div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800">
                        {student.rollNumber} - {student.firstName} {student.lastName}
                      </h4>
                      <p className="text-sm text-gray-600">{student.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 text-xs rounded-full ${student.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                      {student.status}
                    </span>
                    {expandedId === student._id ? <FiChevronUp /> : <FiChevronDown />}
                  </div>
                </button>

                {expandedId === student._id && (
                  <div className="p-4 border-t border-gray-200 space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div>
                        <p className="text-gray-600">Phone:</p>
                        <p className="font-medium">{student.phone || '-'}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Parent Phone:</p>
                        <p className="font-medium">{student.parentPhone || '-'}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Program:</p>
                        <p className="font-medium">{student.program || '-'}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Semester:</p>
                        <p className="font-medium">{student.semester}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">GPA:</p>
                        <p className="font-medium">{student.gpa || '-'}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Location:</p>
                        <p className="font-medium">
                          {student.city || student.state || student.address || '-'}
                        </p>
                      </div>
                    </div>
                    {student.notes && (
                      <div>
                        <p className="text-gray-600 text-sm">Notes:</p>
                        <p className="text-sm">{student.notes}</p>
                      </div>
                    )}
                    <div className="flex gap-2 pt-3">
                      {onViewProfile && (
                        <button
                          onClick={() => onViewProfile(student._id)}
                          className="flex-1 bg-green-600 text-white p-2 rounded hover:bg-green-700 transition flex items-center justify-center gap-1"
                        >
                          <FiUser size={16} /> View Profile
                        </button>
                      )}
                      <button
                        onClick={() => handleEdit(student)}
                        className="flex-1 bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition flex items-center justify-center gap-1"
                      >
                        <FiEdit2 size={16} /> Edit
                      </button>
                      <button
                        onClick={() => handleDelete(student._id)}
                        className="flex-1 bg-red-600 text-white p-2 rounded hover:bg-red-700 transition flex items-center justify-center gap-1"
                      >
                        <FiTrash2 size={16} /> Delete
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-600 text-center py-8">
              {searchTerm ? 'No students found matching your search' : 'No students added yet'}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentDetailsManager;

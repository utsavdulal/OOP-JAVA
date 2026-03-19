import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiEdit2, FiTrash2, FiEye, FiUsers, FiSearch } from 'react-icons/fi';
import api from '../../utils/api';
import Modal from '../../components/admin/Modal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { showToast } from '../../components/admin/Toast';
import LoadingSpinner from '../../components/admin/LoadingSpinner';

const Students = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [search, setSearch] = useState('');
  
  // Form State
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '', rollNumber: '', email: '', phone: '',
    dateOfBirth: '', gender: 'Male', class: '', section: '',
    guardianName: '', guardianPhone: '', address: ''
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchStudents = async (searchQuery = '') => {
    try {
      setLoading(true);
      const res = await api.get(`/students${searchQuery ? `?search=${searchQuery}` : ''}`);
      setStudents(res.data);
    } catch (err) {
      showToast.error('Failed to load students');
    } finally {
      setLoading(false);
    }
  };

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchStudents(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      if (editingId) {
        await api.put(`/students/${editingId}`, formData);
        showToast.success('Student updated successfully');
      } else {
        await api.post('/students', formData);
        showToast.success('Student added successfully');
      }
      closeAndReset();
      fetchStudents(search);
    } catch (err) {
      showToast.error(err.response?.data?.message || 'Failed to save student');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (s) => {
    setEditingId(s._id);
    setFormData({
      fullName: s.fullName || '', rollNumber: s.rollNumber || '',
      email: s.email || '', phone: s.phone || '',
      dateOfBirth: s.dateOfBirth ? new Date(s.dateOfBirth).toISOString().split('T')[0] : '',
      gender: s.gender || 'Male', class: s.class || '',
      section: s.section || '', guardianName: s.guardianName || '',
      guardianPhone: s.guardianPhone || '', address: s.address || ''
    });
    setModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/students/${deleteId}`);
      showToast.success('Student deleted');
      fetchStudents(search);
    } catch (err) {
      showToast.error('Failed to delete student');
    }
  };

  const closeAndReset = () => {
    setModalOpen(false);
    setEditingId(null);
    setFormData({
      fullName: '', rollNumber: '', email: '', phone: '',
      dateOfBirth: '', gender: 'Male', class: '', section: '',
      guardianName: '', guardianPhone: '', address: ''
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-xl shadow-sm border border-slate-100">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <FiUsers className="text-blue-600" /> Student Records
        </h1>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search students..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full sm:w-64 pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <button
            onClick={() => setModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg flex items-center justify-center gap-2 font-medium transition-all shadow-sm flex-shrink-0"
          >
            <FiPlus size={20} /> Add Student
          </button>
        </div>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 uppercase text-xs font-semibold">
                <tr>
                  <th className="px-6 py-4">Roll No</th>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Class</th>
                  <th className="px-6 py-4">Section</th>
                  <th className="px-6 py-4">Phone</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-8 text-center text-slate-500">
                      No students found
                    </td>
                  </tr>
                ) : (
                  students.map((s) => (
                    <tr key={s._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-slate-900">{s.rollNumber}</td>
                      <td className="px-6 py-4">{s.fullName}</td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-semibold">{s.class}</span>
                      </td>
                      <td className="px-6 py-4">{s.section}</td>
                      <td className="px-6 py-4 text-slate-600">{s.phone || '-'}</td>
                      <td className="px-6 py-4 text-slate-600">{s.email || '-'}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-3">
                          <button 
                            onClick={() => navigate(`/admin/students/${s._id}/profile`)}
                            className="text-blue-600 hover:bg-blue-50 p-1.5 rounded-md transition-colors" title="View Profile"
                          >
                            <FiEye size={18} />
                          </button>
                          <button 
                            onClick={() => handleEdit(s)}
                            className="text-emerald-600 hover:bg-emerald-50 p-1.5 rounded-md transition-colors" title="Edit"
                          >
                            <FiEdit2 size={18} />
                          </button>
                          <button 
                            onClick={() => setDeleteId(s._id)}
                            className="text-red-600 hover:bg-red-50 p-1.5 rounded-md transition-colors" title="Delete"
                          >
                            <FiTrash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={closeAndReset} title={editingId ? 'Edit Student' : 'Add New Student'} size="xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-800 border-b pb-2">Personal Information</h3>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name *</label>
                <input type="text" name="fullName" required value={formData.fullName} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Roll Number *</label>
                <input type="text" name="rollNumber" required value={formData.rollNumber} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Date of Birth *</label>
                <input type="date" name="dateOfBirth" required value={formData.dateOfBirth} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Gender *</label>
                <select name="gender" value={formData.gender} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-4">
              <h3 className="font-semibold text-slate-800 border-b pb-2">Academic & Guardian Details</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Class *</label>
                  <input type="text" name="class" required value={formData.class} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. 11" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Section *</label>
                  <input type="text" name="section" required value={formData.section} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. A" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Guardian Name</label>
                <input type="text" name="guardianName" value={formData.guardianName} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Guardian Phone</label>
                <input type="text" name="guardianPhone" value={formData.guardianPhone} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                <textarea name="address" value={formData.address} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" rows={3}></textarea>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-5 border-t">
            <button type="button" onClick={closeAndReset} className="px-4 py-2 border rounded-lg text-slate-700 hover:bg-slate-50">Cancel</button>
            <button type="submit" disabled={submitting} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
              {submitting ? <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> Saving...</> : 'Save Student'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        message="Are you sure you want to delete this student record? This will also remove their results, attendance, and fee history."
      />
    </div>
  );
};

export default Students;

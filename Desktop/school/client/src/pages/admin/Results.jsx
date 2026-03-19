import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiFileText, FiFilter } from 'react-icons/fi';
import api from '../../utils/api';
import Modal from '../../components/admin/Modal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { showToast } from '../../components/admin/Toast';
import LoadingSpinner from '../../components/admin/LoadingSpinner';

const Results = () => {
  const [results, setResults] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  
  // Filters
  const [filterClass, setFilterClass] = useState('');
  const [filterExam, setFilterExam] = useState('');
  
  // Form State
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    studentId: '', subject: '', examType: 'Unit Test',
    marksObtained: '', fullMarks: '100', academicYear: '', remarks: ''
  });
  const [submitting, setSubmitting] = useState(false);
  
  useEffect(() => {
    fetchResults();
    fetchStudents();
  }, [filterClass, filterExam]);

  const fetchResults = async () => {
    try {
      setLoading(true);
      let query = '';
      if (filterClass) query += `class=${filterClass}&`;
      if (filterExam) query += `examType=${filterExam}&`;
      
      const res = await api.get(`/results?${query}`);
      setResults(res.data);
    } catch (err) {
      showToast.error('Failed to load results');
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await api.get('/students');
      setStudents(res.data);
    } catch (err) { }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const calculateGrade = (marks, full) => {
    const percentage = (marks / full) * 100;
    if (isNaN(percentage)) return '-';
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B+';
    if (percentage >= 60) return 'B';
    if (percentage >= 50) return 'C';
    if (percentage >= 40) return 'D';
    return 'F';
  };

  const currentGrade = editingId 
    ? calculateGrade(Number(formData.marksObtained), Number(formData.fullMarks))
    : formData.marksObtained && formData.fullMarks 
      ? calculateGrade(Number(formData.marksObtained), Number(formData.fullMarks))
      : '-';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      if (editingId) {
        await api.put(`/results/${editingId}`, formData);
        showToast.success('Result updated successfully');
      } else {
        await api.post('/results', formData);
        showToast.success('Result added successfully');
      }
      closeAndReset();
      fetchResults();
    } catch (err) {
      showToast.error(err.response?.data?.message || 'Failed to save result');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (r) => {
    setEditingId(r._id);
    setFormData({
      studentId: r.studentId?._id || '', subject: r.subject || '', 
      examType: r.examType || 'Unit Test', marksObtained: r.marksObtained || '', 
      fullMarks: r.fullMarks || '100', academicYear: r.academicYear || '', 
      remarks: r.remarks || ''
    });
    setModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/results/${deleteId}`);
      showToast.success('Result deleted');
      fetchResults();
    } catch (err) {
      showToast.error('Failed to delete result');
    }
  };

  const closeAndReset = () => {
    setModalOpen(false);
    setEditingId(null);
    setFormData({
      studentId: '', subject: '', examType: 'Unit Test',
      marksObtained: '', fullMarks: '100', academicYear: '', remarks: ''
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-5 rounded-xl shadow-sm border border-slate-100">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <FiFileText className="text-blue-600" /> Results Management
        </h1>
        
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200">
            <FiFilter className="text-slate-400" />
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="bg-transparent text-sm focus:outline-none text-slate-700"
            >
              <option value="">All Classes</option>
              {Array.from(new Set(students.map(s => s.class))).map(c => (
                <option key={c} value={c}>Class {c}</option>
              ))}
            </select>
            <div className="w-px h-4 bg-slate-300 mx-1"></div>
            <select
              value={filterExam}
              onChange={(e) => setFilterExam(e.target.value)}
              className="bg-transparent text-sm focus:outline-none text-slate-700"
            >
              <option value="">All Exams</option>
              <option value="Unit Test">Unit Test</option>
              <option value="Midterm">Midterm</option>
              <option value="Final">Final</option>
            </select>
          </div>
          
          <button
            onClick={() => setModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg flex items-center justify-center gap-2 font-medium transition-all shadow-sm"
          >
            <FiPlus size={20} /> Add Result
          </button>
        </div>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 text-xs font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-5 py-4">Student</th>
                  <th className="px-5 py-4">Roll No</th>
                  <th className="px-5 py-4">Subject</th>
                  <th className="px-5 py-4">Exam</th>
                  <th className="px-5 py-4 text-center">Marks</th>
                  <th className="px-5 py-4 text-center">Grade</th>
                  <th className="px-5 py-4 text-center">Status</th>
                  <th className="px-5 py-4 text-center border-l border-slate-200">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {results.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="px-5 py-10 text-center text-slate-500">
                      No results found matching the filters
                    </td>
                  </tr>
                ) : (
                  results.map((r) => {
                    const isPass = currentGrade !== 'F' && r.grade !== 'F' && r.grade !== 'D';
                    return (
                    <tr key={r._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-4 font-medium text-slate-800">{r.studentId?.fullName || '-'}</td>
                      <td className="px-5 py-4 text-slate-600 font-mono">{r.studentId?.rollNumber || '-'}</td>
                      <td className="px-5 py-4">{r.subject}</td>
                      <td className="px-5 py-4"><span className="px-2 py-1 bg-slate-100 text-slate-700 rounded text-xs">{r.examType}</span></td>
                      <td className="px-5 py-4 text-center font-mono font-medium text-slate-700">{r.marksObtained} <span className="text-slate-400">/ {r.fullMarks}</span></td>
                      <td className="px-5 py-4 text-center font-bold text-slate-800">{r.grade}</td>
                      <td className="px-5 py-4 text-center">
                        {r.grade === 'F' ? (
                          <span className="text-red-600 font-semibold text-xs px-2 py-1 bg-red-50 rounded uppercase">Fail</span>
                        ) : (
                          <span className="text-emerald-600 font-semibold text-xs px-2 py-1 bg-emerald-50 rounded uppercase">Pass</span>
                        )}
                      </td>
                      <td className="px-5 py-4 text-center border-l border-slate-100">
                        <div className="flex justify-center gap-3">
                          <button onClick={() => handleEdit(r)} className="text-slate-400 hover:text-blue-600 transition-colors" title="Edit">
                            <FiEdit2 size={16} />
                          </button>
                          <button onClick={() => setDeleteId(r._id)} className="text-slate-400 hover:text-red-600 transition-colors" title="Delete">
                            <FiTrash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={closeAndReset} title={editingId ? 'Edit Result' : 'Add New Result'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Student *</label>
            <select
              name="studentId"
              required
              value={formData.studentId}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option value="">Select a student</option>
              {students.map(s => (
                <option key={s._id} value={s._id}>
                  {s.fullName} ({s.rollNumber}) - Class {s.class} {s.section}
                </option>
              ))}
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Subject *</label>
              <input type="text" name="subject" required value={formData.subject} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. Mathematics" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Exam Type *</label>
              <select name="examType" value={formData.examType} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                <option value="Unit Test">Unit Test</option>
                <option value="Midterm">Midterm</option>
                <option value="Final">Final</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Marks Obtained *</label>
              <input type="number" step="0.5" name="marksObtained" required value={formData.marksObtained} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Marks *</label>
              <input type="number" name="fullMarks" required value={formData.fullMarks} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-center flex flex-col justify-center h-[42px]">
              <span className="text-xs text-slate-500 font-semibold leading-none mb-1">Grade</span>
              <span className={`font-bold leading-none ${currentGrade === 'F' ? 'text-red-600' : 'text-emerald-600'}`}>
                {currentGrade}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Academic Year *</label>
              <input type="text" name="academicYear" required value={formData.academicYear} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. 2081-82" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Remarks</label>
            <textarea name="remarks" value={formData.remarks} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" rows={2}></textarea>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button type="button" onClick={closeAndReset} className="px-4 py-2 border rounded-lg text-slate-700 hover:bg-slate-50">Cancel</button>
            <button type="submit" disabled={submitting} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
              {submitting ? <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> Saving...</> : 'Save Result'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        message="Are you sure you want to delete this result?"
      />
    </div>
  );
};

export default Results;

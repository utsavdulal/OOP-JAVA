import { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiDollarSign, FiFilter, FiTrendingUp, FiAlertCircle } from 'react-icons/fi';
import api from '../../utils/api';
import Modal from '../../components/admin/Modal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import { showToast } from '../../components/admin/Toast';
import LoadingSpinner from '../../components/admin/LoadingSpinner';

const Fees = () => {
  const [fees, setFees] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  
  // Filters
  const [filterClass, setFilterClass] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  
  // Form State
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    studentId: '', feeType: 'Tuition', totalAmount: '',
    paidAmount: '', dueDate: new Date().toISOString().split('T')[0], academicYear: '',
    paymentMethod: 'Cash', receiptNumber: ''
  });
  const [submitting, setSubmitting] = useState(false);
  
  // Calculate summary
  const summary = {
    collected: fees.reduce((acc, f) => acc + (f.paidAmount || 0), 0),
    pending: fees.reduce((acc, f) => acc + ((f.totalAmount || 0) - (f.paidAmount || 0)), 0),
    dueStudents: new Set(fees.filter(f => f.status !== 'Paid').map(f => f.studentId?._id)).size
  };

  useEffect(() => {
    fetchFees();
    fetchStudents();
  }, [filterClass, filterStatus]);

  const fetchFees = async () => {
    try {
      setLoading(true);
      let query = '';
      if (filterClass) query += `class=${filterClass}&`;
      if (filterStatus) query += `status=${filterStatus}&`;
      
      const res = await api.get(`/fees?${query}`);
      setFees(res.data);
    } catch (err) {
      showToast.error('Failed to load fees');
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

  const calculateStatusPreview = () => {
    const paid = Number(formData.paidAmount) || 0;
    const total = Number(formData.totalAmount) || 0;
    if (paid <= 0) return 'Unpaid';
    if (paid >= total) return 'Paid';
    return 'Partial';
  };
  const currentStatus = calculateStatusPreview();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.studentId || !formData.totalAmount || !formData.dueDate) {
      showToast.error('Please fill required fields');
      return;
    }

    try {
      setSubmitting(true);
      const payload = { ...formData };
      if (payload.paidAmount > 0) {
        payload.paymentDate = new Date();
      }

      if (editingId) {
        await api.put(`/fees/${editingId}`, payload);
        showToast.success('Fee record updated');
      } else {
        await api.post('/fees', payload);
        showToast.success('Fee record created');
      }
      closeAndReset();
      fetchFees();
    } catch (err) {
      showToast.error(err.response?.data?.message || 'Failed to save fee record');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (f) => {
    setEditingId(f._id);
    setFormData({
      studentId: f.studentId?._id || '', 
      feeType: f.feeType || 'Tuition', 
      totalAmount: f.totalAmount || '',
      paidAmount: f.paidAmount || 0, 
      dueDate: f.dueDate ? new Date(f.dueDate).toISOString().split('T')[0] : '', 
      academicYear: f.academicYear || '',
      paymentMethod: f.paymentMethod || 'Cash', 
      receiptNumber: f.receiptNumber || ''
    });
    setModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/fees/${deleteId}`);
      showToast.success('Fee record deleted');
      fetchFees();
    } catch (err) {
      showToast.error('Failed to delete fee record');
    }
  };

  const closeAndReset = () => {
    setModalOpen(false);
    setEditingId(null);
    setFormData({
      studentId: '', feeType: 'Tuition', totalAmount: '',
      paidAmount: '', dueDate: new Date().toISOString().split('T')[0], academicYear: '',
      paymentMethod: 'Cash', receiptNumber: ''
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-5 rounded-xl shadow-sm border border-slate-100">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <FiDollarSign className="text-blue-600" /> Fees Management
        </h1>
        
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto mt-4 md:mt-0">
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200 w-full sm:w-auto">
            <FiFilter className="text-slate-400" />
            <select value={filterClass} onChange={(e) => setFilterClass(e.target.value)} className="bg-transparent text-sm focus:outline-none text-slate-700 w-full sm:w-auto">
              <option value="">All Classes</option>
              {Array.from(new Set(students.map(s => s.class))).map(c => <option key={c} value={c}>Class {c}</option>)}
            </select>
            <div className="w-px h-4 bg-slate-300 mx-1"></div>
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="bg-transparent text-sm focus:outline-none text-slate-700 w-full sm:w-auto">
              <option value="">All Statuses</option>
              <option value="Paid">Paid</option>
              <option value="Partial">Partial</option>
              <option value="Unpaid">Unpaid</option>
            </select>
          </div>
          
          <button onClick={() => setModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg flex items-center justify-center gap-2 font-medium transition-all shadow-sm flex-shrink-0 w-full md:w-auto">
            <FiPlus size={20} /> Add Fee Record
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-emerald-50 rounded-xl p-5 border border-emerald-100 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
            <FiTrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm font-semibold text-emerald-800 uppercase tracking-widest text-opacity-80">Total Collected</p>
            <p className="text-2xl font-black text-emerald-700 mt-0.5 font-mono">Rs. {summary.collected.toLocaleString()}</p>
          </div>
        </div>
        
        <div className="bg-red-50 rounded-xl p-5 border border-red-100 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
            <FiAlertCircle size={24} />
          </div>
          <div>
            <p className="text-sm font-semibold text-red-800 uppercase tracking-widest text-opacity-80">Total Pending</p>
            <p className="text-2xl font-black text-red-700 mt-0.5 font-mono">Rs. {summary.pending.toLocaleString()}</p>
          </div>
        </div>
        
        <div className="bg-orange-50 rounded-xl p-5 border border-orange-100 flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center">
            <FiDollarSign size={24} />
          </div>
          <div>
            <p className="text-sm font-semibold text-orange-800 uppercase tracking-widest text-opacity-80">Students with Dues</p>
            <p className="text-2xl font-black text-orange-700 mt-0.5">{summary.dueStudents}</p>
          </div>
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
                  <th className="px-5 py-4">Fee Type</th>
                  <th className="px-5 py-4 text-right">Total</th>
                  <th className="px-5 py-4 text-right">Paid</th>
                  <th className="px-5 py-4 text-right">Due</th>
                  <th className="px-5 py-4 text-center">Status</th>
                  <th className="px-5 py-4 text-center border-l border-slate-200">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {fees.length === 0 ? (
                  <tr><td colSpan="8" className="px-5 py-10 text-center text-slate-500">No fee records found</td></tr>
                ) : (
                  fees.map((f) => {
                    const due = (f.totalAmount || 0) - (f.paidAmount || 0);
                    return (
                    <tr key={f._id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-5 py-4 font-medium text-slate-800">{f.studentId?.fullName || '-'}</td>
                      <td className="px-5 py-4 text-slate-600 font-mono">{f.studentId?.rollNumber || '-'}</td>
                      <td className="px-5 py-4">
                        <span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded text-xs font-semibold border border-indigo-100">
                          {f.feeType}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right font-mono text-slate-600">Rs. {f.totalAmount}</td>
                      <td className="px-5 py-4 text-right font-mono text-emerald-600 font-medium">Rs. {f.paidAmount}</td>
                      <td className="px-5 py-4 text-right font-mono text-red-600 font-medium">Rs. {due}</td>
                      <td className="px-5 py-4 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold shadow-sm border
                          ${f.status === 'Paid' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 
                            f.status === 'Partial' ? 'bg-orange-50 text-orange-700 border-orange-200' : 
                            'bg-red-50 text-red-700 border-red-200'}`}>
                          {f.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-center border-l border-slate-100">
                        <div className="flex justify-center gap-3">
                          <button onClick={() => handleEdit(f)} className="text-slate-400 hover:text-blue-600 transition-colors bg-blue-50/50 hover:bg-blue-100 p-1.5 rounded-lg" title="Edit">
                            <FiEdit2 size={16} />
                          </button>
                          <button onClick={() => setDeleteId(f._id)} className="text-slate-400 hover:text-red-600 transition-colors bg-red-50/50 hover:bg-red-100 p-1.5 rounded-lg" title="Delete">
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

      <Modal isOpen={modalOpen} onClose={closeAndReset} title={editingId ? 'Edit Fee Record' : 'Add Fee Record'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Student *</label>
            <select name="studentId" required value={formData.studentId} onChange={handleInputChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
              <option value="">Select a student</option>
              {students.map(s => <option key={s._id} value={s._id}>{s.fullName} ({s.rollNumber}) - Class {s.class} {s.section}</option>)}
            </select>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Fee Type *</label>
              <select name="feeType" required value={formData.feeType} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                <option value="Tuition">Tuition</option>
                <option value="Exam">Exam</option>
                <option value="Library">Library</option>
                <option value="Sports">Sports</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Academic Year *</label>
              <input type="text" name="academicYear" required value={formData.academicYear} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" placeholder="e.g. 2081-82" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Total Amount *</label>
              <input type="number" required name="totalAmount" value={formData.totalAmount} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Paid Amount *</label>
              <input type="number" name="paidAmount" value={formData.paidAmount} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono" />
            </div>
            <div className="bg-white border border-slate-200 rounded-lg px-3 py-2 h-[42px] flex items-center justify-between shadow-sm">
              <span className="text-xs text-slate-500 font-semibold uppercase">Status</span>
              <span className={`text-sm font-bold ${currentStatus === 'Paid' ? 'text-emerald-600' : currentStatus === 'Partial' ? 'text-orange-600' : 'text-red-600'}`}>
                {currentStatus}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Due Date *</label>
              <input type="date" required name="dueDate" value={formData.dueDate} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white font-mono" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Payment Method</label>
              <select name="paymentMethod" value={formData.paymentMethod} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white">
                <option value="Cash">Cash</option>
                <option value="Online">Online</option>
                <option value="Cheque">Cheque</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Receipt No</label>
              <input type="text" name="receiptNumber" value={formData.receiptNumber} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none font-mono" placeholder="Optional" />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-5 border-t">
            <button type="button" onClick={closeAndReset} className="px-5 py-2.5 border rounded-lg text-slate-700 hover:bg-slate-50 font-medium transition-colors">Cancel</button>
            <button type="submit" disabled={submitting} className="px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2 font-medium shadow-sm transition-all focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-75 disabled:cursor-not-allowed">
              {submitting ? <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> Saving...</> : 'Save Fee Record'}
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        message="Are you sure you want to delete this fee record?"
      />
    </div>
  );
};

export default Fees;

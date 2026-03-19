import { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiEdit2, FiTrash2, FiX, FiDollarSign, FiFileText } from 'react-icons/fi';

const FeesManager = () => {
  const [structures, setStructures] = useState([]);
  const [payments, setPayments] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('structures'); // 'structures' or 'payments'
  const [showStructureForm, setShowStructureForm] = useState(false);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [editingStructureId, setEditingStructureId] = useState(null);
  const [editingPaymentId, setEditingPaymentId] = useState(null);

  const [structureForm, setStructureForm] = useState({
    feeType: 'tuition',
    name: '',
    amount: '',
    dueDate: '',
    academicYear: new Date().getFullYear().toString(),
    applicableProgram: 'all',
    applicableSemester: '',
    description: '',
  });

  const [paymentForm, setPaymentForm] = useState({
    student: '',
    feeStructure: '',
    amountPaid: '',
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'cash',
    receiptNumber: '',
    remarks: '',
  });

  const [filters, setFilters] = useState({
    student: '',
    feeType: '',
    status: '',
  });

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchStructures();
    fetchPayments();
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

  const fetchStructures = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/fees/structures`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setStructures(response.data.structures);
      }
    } catch (error) {
      toast.error('Failed to fetch fee structures');
    } finally {
      setLoading(false);
    }
  };

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.student) params.append('student', filters.student);
      if (filters.feeType) params.append('feeType', filters.feeType);
      if (filters.status) params.append('status', filters.status);

      const response = await axios.get(`${API_URL}/fees/payments?${params}`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setPayments(response.data.payments);
      }
    } catch (error) {
      toast.error('Failed to fetch payments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'payments') {
      fetchPayments();
    }
  }, [filters, activeTab]);

  const handleStructureSubmit = async (e) => {
    e.preventDefault();
    if (!structureForm.name || !structureForm.amount || !structureForm.dueDate || !structureForm.academicYear) {
      toast.error('Name, amount, due date, and academic year are required');
      return;
    }

    try {
      setLoading(true);
       if (editingStructureId) {
         const response = await axios.put(`${API_URL}/fees/structures/${editingStructureId}`, structureForm, {
           withCredentials: true,
         });
        if (response.data.success) {
          setStructures(structures.map((s) => (s._id === editingStructureId ? response.data.structure : s)));
          toast.success('Fee structure updated successfully');
          setEditingStructureId(null);
        }
       } else {
         const response = await axios.post(`${API_URL}/fees/structures`, structureForm, {
           withCredentials: true,
         });
        if (response.data.success) {
          setStructures([response.data.structure, ...structures]);
          toast.success('Fee structure created successfully');
        }
      }
      resetStructureForm();
      setShowStructureForm(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save fee structure');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    if (!paymentForm.student || !paymentForm.feeStructure || !paymentForm.amountPaid || !paymentForm.receiptNumber) {
      toast.error('Student, fee type, amount, and receipt number are required');
      return;
    }

    try {
      setLoading(true);
       if (editingPaymentId) {
         const response = await axios.put(`${API_URL}/fees/payments/${editingPaymentId}`, paymentForm, {
           withCredentials: true,
         });
        if (response.data.success) {
          setPayments(payments.map((p) => (p._id === editingPaymentId ? response.data.payment : p)));
          toast.success('Payment updated successfully');
          setEditingPaymentId(null);
        }
       } else {
         const response = await axios.post(`${API_URL}/fees/payments`, paymentForm, {
           withCredentials: true,
         });
        if (response.data.success) {
          setPayments([response.data.payment, ...payments]);
          toast.success('Payment recorded successfully');
        }
      }
      resetPaymentForm();
      setShowPaymentForm(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to record payment');
    } finally {
      setLoading(false);
    }
  };

  const resetStructureForm = () => {
    setStructureForm({
      feeType: 'tuition',
      name: '',
      amount: '',
      dueDate: '',
      academicYear: new Date().getFullYear().toString(),
      applicableProgram: 'all',
      applicableSemester: '',
      description: '',
    });
  };

  const resetPaymentForm = () => {
    setPaymentForm({
      student: '',
      feeStructure: '',
      amountPaid: '',
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod: 'cash',
      receiptNumber: '',
      remarks: '',
    });
  };

  const handleEditStructure = (structure) => {
    setStructureForm({
      feeType: structure.feeType,
      name: structure.name,
      amount: structure.amount.toString(),
      dueDate: structure.dueDate.split('T')[0],
      academicYear: structure.academicYear,
      applicableProgram: structure.applicableProgram || 'all',
      applicableSemester: structure.applicableSemester?.toString() || '',
      description: structure.description || '',
    });
    setEditingStructureId(structure._id);
    setShowStructureForm(true);
  };

  const handleDeleteStructure = async (id) => {
    if (!window.confirm('Are you sure you want to delete this fee structure?')) return;
    try {
      const response = await axios.delete(`${API_URL}/fees/structures/${id}`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setStructures(structures.filter((s) => s._id !== id));
        toast.success('Fee structure deleted successfully');
      }
    } catch (error) {
      toast.error('Failed to delete fee structure');
    }
  };

  const handleDeletePayment = async (id) => {
    if (!window.confirm('Are you sure you want to delete this payment record?')) return;
    try {
      const response = await axios.delete(`${API_URL}/fees/payments/${id}`, {
        withCredentials: true,
      });
      if (response.data.success) {
        setPayments(payments.filter((p) => p._id !== id));
        toast.success('Payment deleted successfully');
      }
    } catch (error) {
      toast.error('Failed to delete payment');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'partial':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-orange-100 text-orange-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const feeTypes = ['tuition', 'exam', 'library', 'sports', 'lab', 'transport', 'hostel', 'other'];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-gray-800">Fees Management</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('structures')}
            className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${
              activeTab === 'structures' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <FiFileText /> Fee Structures
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`px-4 py-2 rounded-lg transition flex items-center gap-2 ${
              activeTab === 'payments' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <FiDollarSign /> Payments
          </button>
        </div>
      </div>

      {activeTab === 'structures' ? (
        <>
          {/* Fee Structures Tab */}
          <div className="flex justify-end">
            <button
              onClick={() => {
                setShowStructureForm(!showStructureForm);
                setEditingStructureId(null);
                resetStructureForm();
              }}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              {showStructureForm ? 'Cancel' : '+ Add Fee Structure'}
            </button>
          </div>

          {showStructureForm && (
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">{editingStructureId ? 'Edit Fee Structure' : 'Add New Fee Structure'}</h3>
                <button onClick={() => setShowStructureForm(false)} className="text-gray-500 hover:text-gray-700">
                  <FiX size={24} />
                </button>
              </div>
              <form onSubmit={handleStructureSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fee Type *</label>
                    <select
                      value={structureForm.feeType}
                      onChange={(e) => setStructureForm({ ...structureForm, feeType: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                    >
                      {feeTypes.map((type) => (
                        <option key={type} value={type} className="capitalize">
                          {type.charAt(0).toUpperCase() + type.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fee Name *</label>
                    <input
                      type="text"
                      value={structureForm.name}
                      onChange={(e) => setStructureForm({ ...structureForm, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                      placeholder="e.g., Tuition Fee - Semester 1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount (NPR) *</label>
                    <input
                      type="number"
                      value={structureForm.amount}
                      onChange={(e) => setStructureForm({ ...structureForm, amount: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                      placeholder="e.g., 50000"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Due Date *</label>
                    <input
                      type="date"
                      value={structureForm.dueDate}
                      onChange={(e) => setStructureForm({ ...structureForm, dueDate: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Academic Year *</label>
                    <input
                      type="text"
                      value={structureForm.academicYear}
                      onChange={(e) => setStructureForm({ ...structureForm, academicYear: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                      placeholder="e.g., 2024"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Applicable Program</label>
                    <input
                      type="text"
                      value={structureForm.applicableProgram}
                      onChange={(e) => setStructureForm({ ...structureForm, applicableProgram: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                      placeholder="all or specific program"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={structureForm.description}
                    onChange={(e) => setStructureForm({ ...structureForm, description: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                    placeholder="Additional details about this fee..."
                    rows="2"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {loading ? 'Saving...' : editingStructureId ? 'Update Fee Structure' : 'Create Fee Structure'}
                </button>
              </form>
            </div>
          )}

          {/* Fee Structures List */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fee Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Due Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Year</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {structures.length > 0 ? (
                    structures.map((structure) => (
                      <tr key={structure._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800 capitalize">
                            {structure.feeType}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{structure.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          NPR {structure.amount.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(structure.dueDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{structure.academicYear}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button onClick={() => handleEditStructure(structure)} className="text-blue-600 hover:text-blue-900 mr-3">
                            <FiEdit2 size={18} />
                          </button>
                          <button onClick={() => handleDeleteStructure(structure._id)} className="text-red-600 hover:text-red-900">
                            <FiTrash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                        No fee structures found. Create one to get started.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Payments Tab */}
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <select
                value={filters.student}
                onChange={(e) => setFilters({ ...filters, student: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
              >
                <option value="">All Students</option>
                {students.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.rollNumber} - {s.firstName} {s.lastName}
                  </option>
                ))}
              </select>
              <select
                value={filters.status}
                onChange={(e) => setFilters({ ...filters, status: e.target.value })}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
              >
                <option value="">All Status</option>
                <option value="paid">Paid</option>
                <option value="partial">Partial</option>
                <option value="pending">Pending</option>
              </select>
            </div>
            <button
              onClick={() => {
                setShowPaymentForm(!showPaymentForm);
                setEditingPaymentId(null);
                resetPaymentForm();
              }}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              {showPaymentForm ? 'Cancel' : '+ Record Payment'}
            </button>
          </div>

          {showPaymentForm && (
            <div className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">{editingPaymentId ? 'Edit Payment' : 'Record New Payment'}</h3>
                <button onClick={() => setShowPaymentForm(false)} className="text-gray-500 hover:text-gray-700">
                  <FiX size={24} />
                </button>
              </div>
              <form onSubmit={handlePaymentSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Student *</label>
                    <select
                      value={paymentForm.student}
                      onChange={(e) => setPaymentForm({ ...paymentForm, student: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">Fee Type *</label>
                    <select
                      value={paymentForm.feeStructure}
                      onChange={(e) => setPaymentForm({ ...paymentForm, feeStructure: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="">Select Fee</option>
                      {structures.map((s) => (
                        <option key={s._id} value={s._id}>
                          {s.name} - NPR {s.amount.toLocaleString()}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount Paid (NPR) *</label>
                    <input
                      type="number"
                      value={paymentForm.amountPaid}
                      onChange={(e) => setPaymentForm({ ...paymentForm, amountPaid: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                      placeholder="e.g., 50000"
                      min="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Date</label>
                    <input
                      type="date"
                      value={paymentForm.paymentDate}
                      onChange={(e) => setPaymentForm({ ...paymentForm, paymentDate: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method *</label>
                    <select
                      value={paymentForm.paymentMethod}
                      onChange={(e) => setPaymentForm({ ...paymentForm, paymentMethod: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                    >
                      <option value="cash">Cash</option>
                      <option value="online">Online</option>
                      <option value="cheque">Cheque</option>
                      <option value="bank_transfer">Bank Transfer</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Receipt Number *</label>
                    <input
                      type="text"
                      value={paymentForm.receiptNumber}
                      onChange={(e) => setPaymentForm({ ...paymentForm, receiptNumber: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                      placeholder="e.g., RCP-2024-001"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                  <textarea
                    value={paymentForm.remarks}
                    onChange={(e) => setPaymentForm({ ...paymentForm, remarks: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600"
                    placeholder="Additional notes..."
                    rows="2"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {loading ? 'Saving...' : editingPaymentId ? 'Update Payment' : 'Record Payment'}
                </button>
              </form>
            </div>
          )}

          {/* Payments List */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Student</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Fee Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Method</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Receipt</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {payments.length > 0 ? (
                    payments.map((payment) => (
                      <tr key={payment._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {payment.student?.firstName} {payment.student?.lastName}
                          </div>
                          <div className="text-sm text-gray-500">{payment.student?.rollNumber}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {payment.feeStructure?.name || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          NPR {payment.amountPaid.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(payment.paymentDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                          {payment.paymentMethod.replace('_', ' ')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.receiptNumber}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full capitalize ${getStatusColor(payment.status)}`}>
                            {payment.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button onClick={() => handleDeletePayment(payment._id)} className="text-red-600 hover:text-red-900">
                            <FiTrash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="px-6 py-8 text-center text-gray-500">
                        No payment records found. Record a payment to get started.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default FeesManager;

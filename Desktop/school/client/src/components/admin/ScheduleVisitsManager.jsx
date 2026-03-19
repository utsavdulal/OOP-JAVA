import { useState, useEffect } from 'react';
import { FiTrash2, FiCheck, FiX, FiEye, FiDownload } from 'react-icons/fi';
import api from '../../utils/api';
import Modal from './Modal';
import ConfirmDialog from './ConfirmDialog';
import { showToast } from './Toast';
import LoadingSpinner from './LoadingSpinner';

const ScheduleVisitsManager = () => {
  const [visits, setVisits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [statusForm, setStatusForm] = useState({ id: null, status: '', adminNotes: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchVisits();
  }, [filter]);

  const fetchVisits = async () => {
    try {
      setLoading(true);
      const query = filter !== 'all' ? `?status=${filter}` : '';
      const res = await api.get(`/schedule-visits${query}`);
      setVisits(res.data.visits || []);
    } catch (err) {
      showToast.error('Failed to load visit requests');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (visit) => {
    setSelectedVisit(visit);
    setDetailsModalOpen(true);
  };

  const handleStatusChange = (visit) => {
    setStatusForm({
      id: visit._id,
      status: visit.status,
      adminNotes: visit.adminNotes || '',
    });
    setStatusModalOpen(true);
  };

  const handleSubmitStatus = async (e) => {
    e.preventDefault();
    if (!statusForm.status) {
      showToast.error('Please select a status');
      return;
    }

    try {
      setSubmitting(true);
      await api.put(`/schedule-visits/${statusForm.id}/status`, {
        status: statusForm.status,
        adminNotes: statusForm.adminNotes,
      });
      showToast.success('Status updated successfully');
      setStatusModalOpen(false);
      fetchVisits();
    } catch (err) {
      showToast.error('Failed to update status');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.delete(`/schedule-visits/${deleteId}`);
      showToast.success('Visit request deleted');
      setDeleteId(null);
      fetchVisits();
    } catch (err) {
      showToast.error('Failed to delete visit request');
      console.error(err);
    }
  };

  const handleExportCSV = () => {
    if (visits.length === 0) {
      showToast.error('No data to export');
      return;
    }

    const headers = ['Name', 'Email', 'Phone', 'Program', 'Visit Date', 'Time Slot', 'Status', 'Message', 'Admin Notes'];
    const rows = visits.map((v) => [
      v.fullName,
      v.email,
      v.phone,
      v.program,
      new Date(v.visitDate).toLocaleDateString(),
      v.timeSlot,
      v.status,
      v.message || '',
      v.adminNotes || '',
    ]);

    let csvContent = [headers, ...rows].map((row) => row.map((cell) => `"${cell}"`).join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `campus-visits-${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    showToast.success('CSV exported successfully');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'confirmed':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'completed':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'cancelled':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return '⏳';
      case 'confirmed':
        return '✅';
      case 'completed':
        return '✔️';
      case 'cancelled':
        return '❌';
      default:
        return '❓';
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 rounded-xl shadow-sm border border-slate-100">
        <h1 className="text-2xl font-bold text-slate-800">Campus Visit Requests</h1>
        <button
          onClick={handleExportCSV}
          className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-all shadow-sm hover:shadow active:scale-95 whitespace-nowrap"
        >
          <FiDownload size={20} /> Export CSV
        </button>
      </div>

      {/* Filter Section */}
      <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
        <h3 className="text-sm font-semibold text-slate-700 mb-3">Filter by Status</h3>
        <div className="flex flex-wrap gap-2">
          {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                filter === status
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Visits List */}
      {visits.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl shadow-sm border border-slate-100 text-slate-500">
          <div className="text-5xl mb-4">📋</div>
          <p className="text-lg">No visit requests found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {visits.map((visit) => (
            <div
              key={visit._id}
              className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-slate-800">{visit.fullName}</h3>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-semibold border flex items-center gap-1 ${getStatusColor(
                        visit.status
                      )}`}
                    >
                      {getStatusIcon(visit.status)} {visit.status.charAt(0).toUpperCase() + visit.status.slice(1)}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-slate-600 mb-3">
                    <div>
                      <span className="font-medium text-slate-700">Email:</span> {visit.email}
                    </div>
                    <div>
                      <span className="font-medium text-slate-700">Phone:</span> {visit.phone}
                    </div>
                    <div>
                      <span className="font-medium text-slate-700">Program:</span> {visit.program}
                    </div>
                    <div>
                      <span className="font-medium text-slate-700">Visit Date:</span>{' '}
                      {new Date(visit.visitDate).toLocaleDateString()}
                    </div>
                    <div>
                      <span className="font-medium text-slate-700">Time Slot:</span> {visit.timeSlot}
                    </div>
                    <div>
                      <span className="font-medium text-slate-700">Requested:</span>{' '}
                      {new Date(visit.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  {visit.message && (
                    <div className="mb-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
                      <span className="text-xs font-medium text-slate-700">Message:</span>
                      <p className="text-sm text-slate-600 mt-1">{visit.message}</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => handleViewDetails(visit)}
                    className="flex-1 sm:flex-none p-2.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center gap-1.5 text-sm font-medium bg-slate-50 hover:bg-blue-50 border border-slate-200"
                  >
                    <FiEye size={16} /> Details
                  </button>
                  <button
                    onClick={() => handleStatusChange(visit)}
                    className="flex-1 sm:flex-none p-2.5 text-slate-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors flex items-center justify-center gap-1.5 text-sm font-medium bg-slate-50 hover:bg-purple-50 border border-slate-200"
                  >
                    <FiCheck size={16} /> Status
                  </button>
                  <button
                    onClick={() => setDeleteId(visit._id)}
                    className="flex-1 sm:flex-none p-2.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center gap-1.5 text-sm font-medium bg-slate-50 hover:bg-red-50 border border-slate-200"
                  >
                    <FiTrash2 size={16} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Details Modal */}
      <Modal isOpen={detailsModalOpen} onClose={() => setDetailsModalOpen(false)} title="Visit Request Details">
        {selectedVisit && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
              <p className="text-slate-900">{selectedVisit.fullName}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                <p className="text-slate-900 break-all">{selectedVisit.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                <p className="text-slate-900">{selectedVisit.phone}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Program</label>
                <p className="text-slate-900">{selectedVisit.program}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <p
                  className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(
                    selectedVisit.status
                  )}`}
                >
                  {getStatusIcon(selectedVisit.status)} {selectedVisit.status.charAt(0).toUpperCase() + selectedVisit.status.slice(1)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Visit Date</label>
                <p className="text-slate-900">{new Date(selectedVisit.visitDate).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Time Slot</label>
                <p className="text-slate-900">{selectedVisit.timeSlot}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Request Date</label>
              <p className="text-slate-900">{new Date(selectedVisit.createdAt).toLocaleString()}</p>
            </div>

            {selectedVisit.message && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                <p className="text-slate-900 bg-slate-50 p-3 rounded-lg border border-slate-200">{selectedVisit.message}</p>
              </div>
            )}

            {selectedVisit.adminNotes && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Admin Notes</label>
                <p className="text-slate-900 bg-blue-50 p-3 rounded-lg border border-blue-200">{selectedVisit.adminNotes}</p>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Status Update Modal */}
      <Modal isOpen={statusModalOpen} onClose={() => setStatusModalOpen(false)} title="Update Visit Status">
        <form onSubmit={handleSubmitStatus} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Status *</label>
            <select
              value={statusForm.status}
              onChange={(e) => setStatusForm({ ...statusForm, status: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option value="">Select Status</option>
              <option value="pending">⏳ Pending</option>
              <option value="confirmed">✅ Confirmed</option>
              <option value="completed">✔️ Completed</option>
              <option value="cancelled">❌ Cancelled</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Admin Notes (Optional)</label>
            <textarea
              value={statusForm.adminNotes}
              onChange={(e) => setStatusForm({ ...statusForm, adminNotes: e.target.value })}
              placeholder="Add notes about this visit..."
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              rows={4}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={() => setStatusModalOpen(false)}
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Updating...
                </>
              ) : (
                'Update Status'
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        message="Are you sure you want to delete this visit request?"
      />
    </div>
  );
};

export default ScheduleVisitsManager;

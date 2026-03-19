import { useState, useEffect } from 'react';
import { FiDollarSign, FiFilter, FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import studentApi from '../../utils/studentApi';
import { showToast } from '../../components/admin/Toast';
import LoadingSpinner from '../../components/admin/LoadingSpinner';

const MyFees = () => {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    fetchFees();
  }, [statusFilter]);

  const fetchFees = async () => {
    try {
      setLoading(true);
      const query = statusFilter !== 'All' ? `?status=${statusFilter}` : '';
      const res = await studentApi.get(`/fees${query}`);
      setFees(res.data);
    } catch (err) {
      showToast.error('Failed to load fee details');
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    if (status === 'Paid') return { bg: 'bg-[#d1fae5]', text: 'text-[#059669]', border: 'border-[#6ee7b7]', icon: <FiCheckCircle /> };
    if (status === 'Partial') return { bg: 'bg-[#fef3c7]', text: 'text-[#d97706]', border: 'border-[#fde68a]', icon: <FiAlertCircle /> };
    return { bg: 'bg-[#fee2e2]', text: 'text-[#dc2626]', border: 'border-[#fca5a5]', icon: <FiAlertCircle /> };
  };

  const summary = {
    totalPaid: fees.reduce((acc, f) => acc + (f.paidAmount || 0), 0),
    totalDue: fees.reduce((acc, f) => acc + ((f.totalAmount || 0) - (f.paidAmount || 0)), 0),
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-[#a7f3d0]">
        <h1 className="text-2xl font-black text-[#064e3b] flex items-center gap-3 tracking-tight">
          <div className="bg-[#ecfdf5] p-2 rounded-xl text-[#059669]">
            <FiDollarSign size={24} />
          </div>
          Fee Details
        </h1>
        
        <div className="flex items-center gap-2 bg-[#f0fdf4] px-4 py-2 rounded-lg border border-[#a7f3d0] w-full md:w-auto">
          <FiFilter className="text-[#059669]" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-transparent text-sm font-medium focus:outline-none text-[#064e3b] w-full"
          >
            <option value="All">All Statuses</option>
            <option value="Paid">Paid Only</option>
            <option value="Partial">Partial Only</option>
            <option value="Unpaid">Unpaid Only</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-[#059669] to-[#047857] p-6 rounded-2xl text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full transform translate-x-8 -translate-y-8"></div>
          <p className="text-sm font-bold uppercase tracking-widest text-[#a7f3d0] opacity-80 mb-1">Total Amount Paid</p>
          <p className="text-4xl font-black font-mono">Rs. {summary.totalPaid.toLocaleString()}</p>
        </div>
        
        <div className="bg-gradient-to-br from-[#dc2626] to-[#b91c1c] p-6 rounded-2xl text-white shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full transform translate-x-8 -translate-y-8"></div>
          <p className="text-sm font-bold uppercase tracking-widest text-[#fca5a5] opacity-80 mb-1">Remaining Dues</p>
          <p className="text-4xl font-black font-mono">Rs. {summary.totalDue.toLocaleString()}</p>
        </div>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="space-y-4">
          {fees.length === 0 ? (
            <div className="bg-white p-16 rounded-2xl border border-[#a7f3d0] text-center text-[#064e3b] opacity-60 flex flex-col items-center">
              <FiDollarSign size={48} className="mb-4 text-[#a7f3d0]" />
              <p className="text-xl font-medium">No fee records found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {fees.map(f => {
                const style = getStatusStyle(f.status);
                const due = (f.totalAmount || 0) - (f.paidAmount || 0);
                
                return (
                  <div key={f._id} className="bg-white rounded-2xl border border-[#a7f3d0] shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col">
                    <div className="p-5 border-b border-[#a7f3d0] bg-[#f0fdf4] flex justify-between items-start">
                      <div>
                        <span className="px-3 py-1 bg-[#10b981] text-white rounded-lg text-xs font-black uppercase tracking-wider shadow-sm block w-max mb-2">
                          {f.feeType}
                        </span>
                        <p className="text-[#064e3b] text-sm font-bold">Academic Year: {f.academicYear}</p>
                      </div>
                      <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-black uppercase tracking-widest border ${style.bg} ${style.text} ${style.border}`}>
                        {style.icon} {f.status}
                      </span>
                    </div>
                    
                    <div className="p-5 grid grid-cols-3 gap-4 border-b border-[#a7f3d0] divide-x divide-[#a7f3d0]">
                      <div className="text-center">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#059669] opacity-80 mb-1">Total</p>
                        <p className="text-lg font-black font-mono text-[#064e3b]">Rs. {f.totalAmount}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#059669] opacity-80 mb-1">Paid</p>
                        <p className="text-lg font-black font-mono text-[#10b981]">Rs. {f.paidAmount}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] font-bold uppercase tracking-widest text-[#dc2626] opacity-80 mb-1">Due</p>
                        <p className="text-lg font-black font-mono text-[#ef4444]">Rs. {due}</p>
                      </div>
                    </div>

                    <div className="p-4 bg-[#f8fafc] text-xs space-y-2 font-medium text-[#475569] mt-auto">
                      <div className="flex justify-between items-center px-2">
                        <span>Due Date:</span>
                        <strong className="text-[#0f172a]">{new Date(f.dueDate).toLocaleDateString()}</strong>
                      </div>
                      <div className="flex justify-between items-center px-2">
                        <span>Payment Method:</span>
                        <strong className="text-[#0f172a]">{f.paymentMethod || '-'}</strong>
                      </div>
                      {f.receiptNumber && (
                        <div className="flex justify-between items-center px-2 pt-2 border-t border-[#cbd5e1] mt-2">
                          <span>Receipt No:</span>
                          <span className="bg-slate-200 px-2 py-0.5 rounded font-mono font-bold text-[#0f172a]">{f.receiptNumber}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MyFees;

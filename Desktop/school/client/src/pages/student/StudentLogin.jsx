import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiArrowLeft, FiUser, FiCalendar } from 'react-icons/fi';
import studentApi from '../../utils/studentApi';
import { showToast } from '../../components/admin/Toast';

const StudentLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ rollNumber: '', dateOfBirth: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.rollNumber || !formData.dateOfBirth) {
      showToast.error('Please enter both roll number and date of birth');
      return;
    }

    try {
      setLoading(true);
      const res = await studentApi.post('/login', formData);
      localStorage.setItem('studentToken', res.data.token);
      showToast.success('Login successful');
      navigate('/student/dashboard');
    } catch (err) {
      showToast.error(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#ecfdf5] flex flex-col justify-center items-center p-4">
      <div className="w-full justify-start max-w-md mb-6">
        <Link to="/" className="text-[#047857] hover:text-[#065f46] flex items-center gap-2 font-medium transition-colors">
          <FiArrowLeft /> Back to Website
        </Link>
      </div>
      
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-[#a7f3d0]">
        <div className="bg-[#059669] p-8 text-center">
          <div className="w-20 h-20 bg-white rounded-full mx-auto flex items-center justify-center mb-4 shadow-inner">
             <span className="text-[#059669] text-3xl font-black">KC</span>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Student Portal</h2>
          <p className="text-[#a7f3d0] text-sm mt-2">Kasturi College</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-[#064e3b] mb-2 uppercase tracking-wide">Roll Number</label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-[#10b981]" size={18} />
              <input
                type="text"
                required
                value={formData.rollNumber}
                onChange={(e) => setFormData({...formData, rollNumber: e.target.value})}
                className="w-full pl-10 pr-4 py-3 bg-[#f0fdf4] border border-[#a7f3d0] rounded-xl focus:ring-2 focus:ring-[#059669] outline-none transition-all font-mono placeholder:font-sans"
                placeholder="Enter your Roll No"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-[#064e3b] mb-2 uppercase tracking-wide">Date of Birth</label>
            <div className="relative">
              <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-[#10b981]" size={18} />
              <input
                type="date"
                required
                value={formData.dateOfBirth}
                onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                className="w-full pl-10 pr-4 py-3 bg-[#f0fdf4] border border-[#a7f3d0] rounded-xl focus:ring-2 focus:ring-[#059669] outline-none transition-all font-mono"
              />
            </div>
            <p className="text-xs text-[#047857] mt-2 font-medium">Use your date of birth as password.</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#059669] text-white py-3.5 rounded-xl font-bold hover:bg-[#047857] transition-colors flex justify-center items-center shadow-md active:scale-[0.98]"
          >
            {loading ? <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> : 'Login to Portal'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentLogin;

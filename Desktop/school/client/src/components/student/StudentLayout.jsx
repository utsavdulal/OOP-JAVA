import { useState, useEffect } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import StudentSidebar from '../../components/student/StudentSidebar';
import studentApi from '../../utils/studentApi';
import { showToast } from '../../components/admin/Toast';

const StudentLayout = () => {
  const navigate = useNavigate();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!localStorage.getItem('studentToken')) {
        navigate('/student/login');
        return;
      }
      try {
        const res = await studentApi.get('/profile');
        setStudent(res.data);
      } catch (err) {
        showToast.error('Session expired');
        localStorage.removeItem('studentToken');
        navigate('/student/login');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  if (!localStorage.getItem('studentToken')) {
    return <Navigate to="/student/login" replace />;
  }

  const handleLogout = () => {
    localStorage.removeItem('studentToken');
    showToast.success('Logged out successfully');
    navigate('/student/login');
  };

  if (loading) {
    return <div className="min-h-screen bg-[#ecfdf5] flex justify-center items-center"><div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#059669]"></div></div>;
  }

  return (
    <div className="flex h-screen bg-[#f0fdf4] font-sans">
      <StudentSidebar student={student} onLogout={handleLogout} />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Pass down student context to Outlet */}
        <div className="flex-1 overflow-auto p-4 md:p-8 mt-16 md:mt-0">
          <Outlet context={{ student }} />
        </div>
      </div>
    </div>
  );
};

export default StudentLayout;

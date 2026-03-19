import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import axios from 'axios';
import LoadingSpinner from '../components/admin/LoadingSpinner';

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [classFilter, setClassFilter] = useState('All');

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      // Try to fetch from the students endpoint (without authentication for public view)
      // If this doesn't work, we'll use fallback data
      try {
        const response = await axios.get(`${API_URL}/students`);
        if (Array.isArray(response.data)) {
          setStudents(response.data);
        } else if (response.data.success && Array.isArray(response.data.students)) {
          setStudents(response.data.students);
        }
      } catch (error) {
        // If API fails, we'll just show a message
        console.error('Failed to fetch students from API:', error);
      }
    } catch (error) {
      console.error('Error fetching students:', error);
    } finally {
      setLoading(false);
    }
  };

  const uniqueClasses = ['All', ...new Set(students.map(s => s.class || 'Unknown'))];

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesClass = classFilter === 'All' || student.class === classFilter;
    
    return matchesSearch && matchesClass;
  });

  return (
    <>
      <Helmet>
        <title>Our Students — Kasturi College</title>
        <meta name="description" content="Meet our talented and dedicated students at Kasturi College." />
      </Helmet>

      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-primary-800 text-white overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{ backgroundImage: `url('/college_front.jpg')` }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/90 via-primary-700/85 to-primary-800/95" />
        <div className="absolute inset-0 pattern-academic opacity-20" />
        <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="inline-flex items-center gap-2 text-accent-500 font-bold text-sm uppercase tracking-widest mb-4">
             <span className="w-8 h-0.5 bg-accent-500 rounded-full"></span>
             Our Community
             <span className="w-8 h-0.5 bg-accent-500 rounded-full"></span>
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 font-display tracking-tight">Our Students</h1>
          <p className="text-xl text-primary-50 max-w-2xl mx-auto font-light leading-relaxed">Talented individuals committed to academic excellence and personal growth.</p>
        </div>
      </section>

      {/* Students Showcase */}
      <section className="section-padding bg-surface-bg relative">
        <div className="absolute left-0 top-1/4 w-1/4 h-1/2 bg-primary-100/50 rounded-r-full blur-3xl -z-10 mix-blend-multiply" />
        <div className="absolute right-0 bottom-1/4 w-1/3 h-1/3 bg-accent-100/30 rounded-l-full blur-3xl -z-10 mix-blend-multiply" />
        
        <div className="container-custom mx-auto relative z-10">
          {/* Section Heading */}
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-primary-600 font-display tracking-tight inline-block relative">
              Student Community
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-24 h-1 bg-accent-500 rounded-full"></span>
            </h2>
          </div>

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            <div>
              <input
                type="text"
                placeholder="Search by name or roll number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-primary-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white shadow-sm"
              />
            </div>
            <div>
              <select
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-primary-100 focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white shadow-sm"
              >
                {uniqueClasses.map(cls => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Students Grid */}
          {loading ? (
            <LoadingSpinner />
          ) : filteredStudents.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredStudents.map((student) => (
                <div key={student._id} className="card p-6 text-center group bg-white border border-primary-50 hover:border-primary-200 shadow-sm hover:shadow-lg transition-all duration-300 rounded-xl overflow-hidden flex flex-col h-full">
                  {/* Photo Section */}
                  <div className="relative mb-4">
                    <div className="w-24 h-24 mx-auto mb-4">
                      {student.photo ? (
                        <img
                          src={student.photo}
                          alt={student.fullName}
                          className="w-full h-full rounded-lg object-cover shadow-md border-2 border-primary-100 group-hover:border-accent-500 transition-colors duration-300"
                        />
                      ) : (
                        <div className="w-full h-full rounded-lg bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-3xl font-bold shadow-md">
                          {student.fullName?.[0]}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Student Info */}
                  <h3 className="font-bold text-primary-600 text-lg mb-1 font-display tracking-tight">
                    {student.fullName}
                  </h3>
                  <p className="text-accent-600 text-xs font-bold uppercase tracking-widest mb-2">
                    {student.rollNumber}
                  </p>
                  
                  <div className="space-y-1 mb-4 flex-1">
                    {student.class && (
                      <p className="text-primary-400 text-xs font-medium uppercase tracking-wider">
                        {student.class} {student.section}
                      </p>
                    )}
                    {student.email && (
                      <p className="text-text-secondary text-xs truncate">{student.email}</p>
                    )}
                    {student.gender && (
                      <p className="text-text-secondary text-xs">{student.gender}</p>
                    )}
                  </div>

                  {/* Badge */}
                  <div className="pt-3 border-t border-primary-50">
                    <span className="inline-block bg-primary-100 text-primary-600 text-xs font-bold px-3 py-1 rounded-full">
                      Active Student
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="col-span-full text-center py-16">
              <div className="text-gray-400 text-6xl mb-4">👥</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No Students Found</h3>
              <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
            </div>
          )}

          {/* Result Count */}
          {filteredStudents.length > 0 && (
            <div className="text-center mt-8 text-sm text-gray-600">
              Showing {filteredStudents.length} of {students.length} students
            </div>
          )}
        </div>
      </section>
    </>
  );
}

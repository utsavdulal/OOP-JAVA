import { Helmet } from 'react-helmet-async';
import { FaLinkedinIn, FaEnvelope } from 'react-icons/fa';
import { useState, useEffect } from 'react';
import axios from 'axios';

const departments = ['All', 'Management', 'Accounting', 'Economics', 'English', 'Nepali', 'Mathematics', 'Administration'];

export default function FacultyPage() {
  const [active, setActive] = useState('All');
  const [faculty, setFaculty] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

  useEffect(() => {
    fetchFaculty();
  }, []);

  const fetchFaculty = async () => {
    try {
      setLoading(true);
      console.log('Fetching faculty from:', `${API_URL}/admin/auth/faculty`);
      const response = await axios.get(`${API_URL}/admin/auth/faculty`);
      console.log('Faculty response:', response.data);
      if (response.data.success) {
        setFaculty(response.data.faculty);
      }
    } catch (error) {
      console.error('Error fetching faculty:', error);
      // Fallback to static data if API fails
      setFaculty([
        { firstName: 'Admin', lastName: 'Teacher', department: 'Administration', qualification: 'Administrative Officer' },
        { firstName: 'Dr. Ramesh', lastName: 'Sharma', department: 'Management', qualification: 'PhD in Business Administration' },
        { firstName: 'Prof. Sunita', lastName: 'Adhikari', department: 'Accounting', qualification: 'M.Com, CA Finalist' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = active === 'All' ? faculty : faculty.filter(f => f.department === active);

  return (
    <>
      <Helmet>
        <title>Faculty — Kasturi College</title>
        <meta name="description" content="Meet our experienced and dedicated faculty members at Kasturi College." />
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
             Our Team
             <span className="w-8 h-0.5 bg-accent-500 rounded-full"></span>
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 font-display tracking-tight">Meet Our Faculty</h1>
          <p className="text-xl text-primary-50 max-w-2xl mx-auto font-light leading-relaxed">Experienced educators dedicated to shaping the future of management professionals.</p>
        </div>
      </section>

      {/* Faculty Grid */}
      <section className="section-padding bg-surface-bg relative">
        <div className="absolute left-0 top-1/4 w-1/4 h-1/2 bg-primary-100/50 rounded-r-full blur-3xl -z-10 mix-blend-multiply" />
        <div className="absolute right-0 bottom-1/4 w-1/3 h-1/3 bg-accent-100/30 rounded-l-full blur-3xl -z-10 mix-blend-multiply" />
        
        <div className="container-custom mx-auto relative z-10">
          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-16">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setActive(dept)}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 shadow-sm border
                  ${active === dept 
                    ? 'bg-primary-600 text-white border-primary-600 font-display tracking-wide shadow-md transform -translate-y-0.5' 
                    : 'bg-white text-text-secondary border-primary-100 hover:border-primary-300 hover:text-primary-600'}`}
              >
                {dept}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {loading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="card p-8 text-center bg-white border border-primary-50 shadow-sm animate-pulse">
                  <div className="w-28 h-28 mx-auto mb-6 bg-gray-200 rounded-full"></div>
                  <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto mb-1"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mx-auto"></div>
                </div>
              ))
            ) : filtered.length > 0 ? (
              filtered.map((member, i) => (
                <div key={member._id || i} className="card p-8 text-center group bg-white border border-primary-50 hover:border-primary-200 shadow-sm hover:shadow-lg transition-all duration-300">
                  <div className="relative w-28 h-28 mx-auto mb-6">
                    {/* Avatar ring */}
                    <div className="absolute inset-0 rounded-full border-2 border-primary-100 group-hover:border-accent-500 transition-colors duration-500 scale-110" />

                    {member.photo ? (
                      <img
                        src={member.photo}
                        alt={`${member.firstName} ${member.lastName}`}
                        className="w-full h-full rounded-full object-cover shadow-inner"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                    ) : null}

                    <div className={`w-full h-full rounded-full bg-gradient-to-br from-primary-400 to-primary-600 ${member.photo ? 'hidden' : 'flex'} items-center justify-center text-white text-4xl font-bold font-display shadow-inner`}>
                      {member.firstName?.[0]}{member.lastName?.[0]}
                    </div>
                  </div>

                  <h3 className="font-bold text-primary-600 text-xl mb-1 font-display tracking-tight">
                    {member.firstName} {member.lastName}
                  </h3>
                  <p className="text-accent-600 text-xs font-bold uppercase tracking-widest mb-3">
                    {member.department ? `${member.department} Faculty` : 'Faculty Member'}
                  </p>
                  <div className="space-y-1 mb-6">
                    <p className="text-primary-400 text-xs font-medium uppercase tracking-wider">{member.department}</p>
                    <p className="text-text-secondary text-sm font-light">{member.qualification}</p>
                    {member.bio && (
                      <p className="text-text-secondary text-xs mt-2">{member.bio}</p>
                    )}
                  </div>

                  {/* Social Actions */}
                  <div className="flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pt-6 border-t border-primary-50">
                    <a href="#" className="w-10 h-10 rounded-full border border-primary-100 bg-primary-50 flex items-center justify-center text-primary-600 hover:bg-primary-600 hover:text-white hover:border-primary-600 transition-colors shadow-sm">
                      <FaEnvelope className="text-sm" />
                    </a>
                    <a href="#" className="w-10 h-10 rounded-full border border-primary-100 bg-primary-50 flex items-center justify-center text-primary-600 hover:bg-primary-600 hover:text-white hover:border-primary-600 transition-colors shadow-sm">
                      <FaLinkedinIn className="text-sm" />
                    </a>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-16">
                <div className="text-gray-400 text-6xl mb-4">👨‍🏫</div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No Faculty Members Yet</h3>
                <p className="text-gray-500">Faculty profiles will appear here once added by administrators.</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}

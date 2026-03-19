import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { FaClock, FaBookOpen, FaChartLine, FaLaptopCode, FaUsers, FaArrowRight, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useRef, useEffect, useState } from 'react';

const programs = [
  {
    id: 'plus-two',
    title: '+2 Management',
    nepali: 'उच्च माध्यमिक (व्यवस्थापन)',
    duration: '2 Years',
    affiliation: 'NEB (National Examination Board)',
    icon: FaBookOpen,
    description: 'Build a strong foundation in commerce, accounting, economics, and business studies. This program prepares students for higher education in management and business fields.',
    subjects: ['Accountancy', 'Business Studies', 'Economics', 'English', 'Nepali', 'Mathematics / Hotel Management'],
    highlights: ['NEB affiliated curriculum', 'Experienced faculty', 'Regular mock exams', 'Career counselling'],
  },
  {
    id: 'bba',
    title: 'BBA (Bachelor of Business Administration)',
    nepali: 'व्यवसाय प्रशासन स्नातक',
    duration: '4 Years (8 Semesters)',
    affiliation: 'Tribhuvan University',
    icon: FaLaptopCode,
    description: 'A comprehensive undergraduate program designed to develop management, leadership, and entrepreneurial skills. BBA prepares you for careers in the corporate world and business ownership.',
    subjects: ['Financial Management', 'Marketing Management', 'Human Resource Management', 'Organizational Behavior', 'Business Law', 'Strategic Management'],
    highlights: ['Semester-based system', 'Industry internships', 'Project-based learning', 'Guest lectures from industry experts'],
  },
  {
    id: 'bbs',
    title: 'BBS (Bachelor of Business Studies)',
    nepali: 'व्यवसाय अध्ययन स्नातक',
    duration: '4 Years',
    affiliation: 'Tribhuvan University',
    icon: FaChartLine,
    description: 'An in-depth academic program focusing on business, finance, and economics. BBS provides strong theoretical knowledge combined with practical business applications.',
    subjects: ['Business Finance', 'Macro/Micro Economics', 'Business Statistics', 'Cost & Management Accounting', 'Auditing', 'Taxation'],
    highlights: ['TU affiliated', 'Strong theoretical foundation', 'Exam-focused preparation', 'Library & research resources'],
  },
];

// Student photos for carousel (placeholder URLs)
const studentPhotos = [
  { id: 1, src: 'https://picsum.photos/seed/prog1/280/200', alt: 'Students studying' },
  { id: 2, src: 'https://picsum.photos/seed/prog2/280/200', alt: 'Classroom session' },
  { id: 3, src: 'https://picsum.photos/seed/prog3/280/200', alt: 'Group discussion' },
  { id: 4, src: 'https://picsum.photos/seed/prog4/280/200', alt: 'Campus activities' },
  { id: 5, src: 'https://picsum.photos/seed/prog5/280/200', alt: 'Library study' },
  { id: 6, src: 'https://picsum.photos/seed/prog6/280/200', alt: 'Project work' },
  { id: 7, src: 'https://picsum.photos/seed/prog7/280/200', alt: 'Presentation' },
  { id: 8, src: 'https://picsum.photos/seed/prog8/280/200', alt: 'Team activities' },
];

export default function ProgramsPage() {
  const carouselRef = useRef(null);
  const [isPaused, setIsPaused] = useState(false);

  // Auto-scroll effect
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;

    const scrollSpeed = 1;
    let animationId;

    const autoScroll = () => {
      if (!isPaused && carousel) {
        carousel.scrollLeft += scrollSpeed;
        // Reset to start when reaching end
        if (carousel.scrollLeft >= carousel.scrollWidth - carousel.clientWidth) {
          carousel.scrollLeft = 0;
        }
      }
      animationId = requestAnimationFrame(autoScroll);
    };

    animationId = requestAnimationFrame(autoScroll);
    return () => cancelAnimationFrame(animationId);
  }, [isPaused]);

  const scrollCarousel = (direction) => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    const scrollAmount = 300;
    carousel.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  return (
    <>
      <Helmet>
        <title>Programs — Kasturi College | +2 Management, BBA, BBS</title>
        <meta name="description" content="Explore academic programs at Kasturi College: +2 Management, BBA, and BBS. Affiliated with NEB and Tribhuvan University." />
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
             Academics
             <span className="w-8 h-0.5 bg-accent-500 rounded-full"></span>
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 font-display tracking-tight">Our Programs</h1>
          <p className="text-xl text-primary-50 max-w-2xl mx-auto font-light leading-relaxed">Comprehensive management education programs affiliated with NEB and Tribhuvan University.</p>
        </div>
      </section>

      {/* Programs */}
      <section className="section-padding bg-surface-bg relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-white rounded-l-[100px] -z-10 opacity-50 hidden lg:block" />

        <div className="container-custom mx-auto space-y-16">
          {programs.map((prog, i) => (
            <div key={prog.id} id={prog.id} className={`grid lg:grid-cols-5 gap-8 lg:gap-12 items-start ${i % 2 === 1 ? 'lg:direction-rtl' : ''}`}>
              {/* Info */}
              <div className={`lg:col-span-3 card p-8 sm:p-10 border border-primary-50 hover:border-primary-200 transition-colors shadow-sm hover:shadow-md bg-white ${i % 2 === 1 ? 'lg:order-last' : ''}`}>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center border border-primary-100 flex-shrink-0">
                    <prog.icon className="text-3xl text-primary-500" />
                  </div>
                  <div>
                    <h2 className="text-3xl font-bold text-primary-600 font-display tracking-tight leading-none mb-1">{prog.title}</h2>
                    <p className="text-sm font-medium text-text-secondary tracking-widest uppercase">{prog.nepali}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4 mb-8">
                  <span className="inline-flex items-center gap-2 text-sm bg-primary-50 border border-primary-100 text-primary-600 px-4 py-1.5 rounded-full font-medium">
                    <FaClock className="text-accent-500 text-xs" /> {prog.duration}
                  </span>
                  <span className="inline-flex items-center gap-2 text-sm bg-accent-500/10 border border-accent-500/20 text-accent-700 px-4 py-1.5 rounded-full font-medium">
                    <FaUsers className="text-accent-500 text-xs" /> {prog.affiliation}
                  </span>
                </div>

                <p className="text-text-primary leading-relaxed font-light mb-8 text-lg">{prog.description}</p>

                <div className="pt-8 border-t border-primary-50">
                   <h4 className="font-bold text-primary-600 mb-4 font-display uppercase tracking-widest text-sm">Key Subjects</h4>
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                     {prog.subjects.map((s, j) => (
                       <div key={j} className="flex items-center gap-3 text-sm text-text-secondary font-light">
                         <span className="w-1.5 h-1.5 rounded-full bg-accent-500 flex-shrink-0" />
                         {s}
                       </div>
                     ))}
                   </div>
                </div>
              </div>

              {/* Highlights Card */}
              <div className="lg:col-span-2">
                <div className="bg-primary-600 rounded-[2rem] p-8 sm:p-10 text-white shadow-xl relative overflow-hidden border border-primary-500">
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary-500 rounded-full blur-2xl opacity-50" />

                  <h4 className="font-bold text-white mb-6 font-display text-xl tracking-wide relative z-10">Program Highlights</h4>
                  <ul className="space-y-4 mb-10 relative z-10">
                    {prog.highlights.map((h, j) => (
                      <li key={j} className="flex items-start gap-4 text-sm font-light text-primary-50">
                        <span className="w-6 h-6 rounded-full bg-accent-500/20 text-accent-500 flex items-center justify-center text-xs flex-shrink-0 mt-0.5 border border-accent-500/30">✓</span>
                        <span className="leading-relaxed pt-0.5">{h}</span>
                      </li>
                    ))}
                  </ul>

                  <Link to="/admissions" className="btn-primary w-full shadow-md text-sm relative z-10">
                    Apply Now <FaArrowRight className="ml-2" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>


    </>
  );
}

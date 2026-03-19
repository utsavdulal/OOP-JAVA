import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { FaGraduationCap, FaUsers, FaAward, FaBookOpen, FaStar, FaArrowRight, FaQuoteLeft, FaChevronRight } from 'react-icons/fa';
import { useEffect, useRef, useState } from 'react';

/* ─── Animated Counter ─── */
function Counter({ end, label, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const counted = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !counted.current) {
        counted.current = true;
        let start = 0;
        const step = Math.ceil(end / 60);
        const timer = setInterval(() => {
          start += step;
          if (start >= end) { setCount(end); clearInterval(timer); }
          else setCount(start);
        }, 25);
      }
    }, { threshold: 0.5 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [end]);

  return (
    <div ref={ref} className="text-center group p-6 rounded-2xl hover:bg-white/5 transition-colors">
      <div className="text-4xl sm:text-5xl font-bold text-accent-500 mb-2 font-display">{count}{suffix}</div>
      <div className="text-white text-sm font-medium tracking-wide uppercase">{label}</div>
    </div>
  );
}

/* ─── Animate on scroll hook ─── */
function useAnimateOnScroll() {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.15 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return [ref, visible];
}

/* ─── Testimonial Data ─── */
const testimonials = [
  { name: 'Anish Luitel', rating: 5, text: 'Kasturi Academy is one of the leading academic institutions of Nepal for the quality education exclusively in Management stream. From the view point of results, placements, attractions of the academicians and teachers, academic performance is outstanding.', time: '4 years ago' },
  { name: 'Nick Fab', rating: 5, text: 'Having more experienced teachers working over here, Kasturi College continuously gives huge contribution in the field of education. It mostly regulates management faculty course — high school education, BBA, and more.', time: '7 years ago' },
  { name: 'Aameer Ansari', rating: 5, text: 'World class college to pursue education in the field of management. Highly recommended for anyone seeking quality education in a supportive environment.', time: '7 months ago' },
];

const programs = [
  { title: '+2 Management', desc: 'A strong foundation in commerce, accounting, economics and business studies.', icon: FaBookOpen, duration: '2 Years' },
  { title: 'BBA', desc: 'Bachelor of Business Administration — develop leadership and management skills.', icon: FaGraduationCap, duration: '4 Years' },
  { title: 'BBS', desc: 'Bachelor of Business Studies — in-depth knowledge of business and finance.', icon: FaAward, duration: '4 Years' },
];

export default function HomePage() {
  const [aboutRef, aboutVisible] = useAnimateOnScroll();
  const [progRef, progVisible] = useAnimateOnScroll();
  const [testRef, testVisible] = useAnimateOnScroll();

  return (
    <>
      <Helmet>
        <title>Kasturi College — Quality Education in Management | Itahari, Nepal</title>
        <meta name="description" content="Kasturi College is one of the leading academic institutions in Nepal for quality management education. Located in Itahari, offering +2 Management, BBA, and BBS programs." />
      </Helmet>

      {/* ═══════════ HERO ═══════════ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-primary-800">
        {/* Real Background Image Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50 mix-blend-overlay"
          style={{ backgroundImage: `url('/college_front.jpg')` }}
        />
        {/* Soft Green Gradient overlaid on top */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary-900/80 via-primary-500/80 to-primary-600/95" />

        {/* Subtle Pattern */}
        <div className="absolute inset-0 pattern-academic" />

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto pt-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/20 bg-white/5 backdrop-blur-md text-white/90 text-sm mb-8 animate-fade-in shadow-lg">
            <FaStar className="text-accent-500" />
            <span className="font-medium tracking-wide">Rated 4.5 ★ by 84+ students & parents</span>
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 animate-fade-in-up leading-tight tracking-tight font-display drop-shadow-md">
            Kasturi College
          </h1>
          <p className="text-xl sm:text-2xl text-primary-200 font-medium mb-4 animate-fade-in-up animate-delay-100 tracking-[0.2em]">
            कस्तुरी कलेज
          </p>
          <p className="text-lg sm:text-xl text-white/90 max-w-2xl mx-auto mb-10 animate-fade-in-up animate-delay-200 leading-relaxed font-sans font-light">
            One of the leading academic institutions of Nepal for quality education exclusively in
            <span className="text-accent-500 font-medium"> Management</span> stream
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 animate-fade-in-up animate-delay-300">
            <Link to="/programs" className="btn-primary text-base shadow-[0_0_30px_-5px_rgba(224,168,0,0.4)]">
              Explore Programs <FaArrowRight className="ml-2" />
            </Link>
            <Link to="/contact" className="btn-secondary text-base border-transparent hover:border-white text-primary-600">
              Contact Us
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce opacity-70">
          <div className="w-6 h-10 rounded-full border-2 border-white/40 flex items-start justify-center p-2">
            <div className="w-1 h-2 rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
          </div>
        </div>
      </section>

      {/* ═══════════ ABOUT PREVIEW ═══════════ */}
      <section ref={aboutRef} className="section-padding bg-surface-bg">
        <div className={`container-custom mx-auto transition-all duration-700 ${aboutVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* College Image Section */}
            <div className="relative order-2 lg:order-1">
              <div className="bg-gradient-to-br from-primary-100 to-primary-50 rounded-[2rem] p-8 relative overflow-hidden border border-primary-100 shadow-lg h-80 flex items-center justify-center">
                {/* Subtle background pattern */}
                <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle, #666 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                
                <div className="text-center relative z-10">
                  <div className="text-8xl mb-4">🏫</div>
                  <p className="text-primary-600 font-semibold text-lg">College Image</p>
                </div>
              </div>
              <div className="absolute -bottom-4 -right-4 w-full h-full border-2 border-accent-500/30 rounded-[2rem] -z-10" />
            </div>

            {/* About Text and Why Choose Section */}
            <div className="order-1 lg:order-2">
              <span className="inline-flex items-center gap-2 text-accent-600 font-bold text-sm uppercase tracking-widest mb-4">
                <span className="w-8 h-0.5 bg-accent-500 rounded-full"></span>
                About Us
              </span>
              <h2 className="section-title text-primary-600">Shaping Future Leaders in <span className="text-primary-500 relative after:content-[''] after:absolute after:bottom-1 after:left-0 after:w-full after:h-2 after:bg-accent-500/20 after:-z-10">Management</span></h2>
              <p className="section-subtitle !mx-0 mb-6 text-text-primary">
                Established with a vision to provide world-class management education, Kasturi College stands as one of
                the premier educational institutions in eastern Nepal. Located in the vibrant city of Itahari, we are
                committed to nurturing the next generation of business leaders and entrepreneurs.
              </p>
              <p className="text-text-secondary leading-relaxed mb-8 font-light">
                Our experienced faculty, modern teaching methodologies, and industry-focused curriculum ensure that every
                student receives the knowledge and skills needed to succeed in today&apos;s competitive world.
              </p>
              <Link to="/about" className="btn-outline group text-sm !px-6 !py-3">
                Learn More <FaChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
               </Link>
            </div>
          </div>

          {/* Why Choose Us Section Below */}
          <div className="mt-16">
            <div className="relative max-w-2xl mx-auto">
              <div className="bg-primary-500 rounded-[2rem] p-10 text-white shadow-2xl relative z-10 overflow-hidden border border-primary-400">
                {/* Decorative background circle */}
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary-400 rounded-full opacity-50 blur-3xl mix-blend-screen" />
                
                <h3 className="text-3xl font-bold mb-8 font-display tracking-tight">Why Choose Us?</h3>
                <ul className="space-y-5 relative z-10">
                  {['Experienced & dedicated faculty', 'Modern teaching methodologies', 'Strong academic results', 'Industry-focused curriculum', 'Supportive learning environment', 'Affordable quality education'].map((item, i) => (
                    <li key={i} className="flex items-center gap-4 text-primary-50 font-medium">
                      <span className="w-8 h-8 rounded-full bg-accent-500/20 text-accent-500 flex items-center justify-center text-sm flex-shrink-0 border border-accent-500/30">✓</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="absolute -bottom-6 -right-6 w-full h-full border-2 border-accent-500 rounded-[2rem] -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ STRIPE / STATS ═══════════ */}
      <section className="py-20 bg-primary-600 relative overflow-hidden border-y border-primary-700">
        <div className="absolute inset-0 pattern-academic opacity-20" />
        <div className="absolute -left-20 top-0 w-64 h-64 bg-primary-500 rounded-full blur-3xl opacity-50 mix-blend-screen" />
        <div className="absolute -right-20 bottom-0 w-64 h-64 bg-primary-700 rounded-full blur-3xl opacity-50 mix-blend-multiply" />
        
        <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 divide-x divide-primary-500/50 -mx-4">
            <div className="px-4"><Counter end={20} suffix="+" label="Years of Excellence" /></div>
            <div className="px-4"><Counter end={1500} suffix="+" label="Students Enrolled" /></div>
            <div className="px-4"><Counter end={50} suffix="+" label="Expert Faculty" /></div>
            <div className="px-4"><Counter end={95} suffix="%" label="Success Rate" /></div>
          </div>
        </div>
      </section>

      {/* ═══════════ PROGRAMS PREVIEW ═══════════ */}
      <section ref={progRef} className="section-padding bg-white relative">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-surface-bg rounded-l-[100px] -z-10 opacity-50 hidden lg:block" />
        
        <div className={`container-custom mx-auto transition-all duration-700 ${progVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 text-accent-600 font-bold text-sm uppercase tracking-widest mb-4">
               <span className="w-8 h-0.5 bg-accent-500 rounded-full"></span>
               Academic Programs
               <span className="w-8 h-0.5 bg-accent-500 rounded-full"></span>
            </span>
            <h2 className="section-title text-primary-600">Programs We Offer</h2>
            <p className="section-subtitle">Comprehensive management education programs designed to prepare you for a successful career.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {programs.map((prog, i) => (
              <div key={i} className="card overflow-hidden group hover:-translate-y-2 transition-all duration-300 border border-primary-100 bg-white" style={{ animationDelay: `${i * 100}ms` }}>
                {/* Image Container */}
                <div className="w-full h-48 bg-gradient-to-br from-primary-100 to-primary-50 border-b border-primary-100 flex items-center justify-center overflow-hidden relative group-hover:shadow-lg transition-shadow">
                  <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity bg-pattern-dots" />
                  <div className="text-center relative z-10">
                    <div className="text-6xl text-primary-300 mb-3">📚</div>
                    <p className="text-sm text-primary-400 font-medium">Program Image</p>
                  </div>
                </div>

                <div className="p-8">
                  <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center mb-8 group-hover:bg-primary-500 transition-colors duration-300 border border-primary-100">
                    <prog.icon className="text-3xl text-primary-500 group-hover:text-accent-500 transition-colors" />
                  </div>
                  <div className="flex items-center justify-between mb-4">
                     <h3 className="text-2xl font-bold text-primary-600 font-display tracking-tight">{prog.title}</h3>
                     <span className="text-xs font-bold text-accent-600 bg-accent-500/10 px-3 py-1 rounded-full">{prog.duration}</span>
                  </div>
                  <p className="text-text-secondary text-sm leading-relaxed font-light mb-6">{prog.desc}</p>
                  <Link to="/programs" className="inline-flex items-center text-sm font-semibold text-primary-500 group-hover:text-accent-600 transition-colors">
                    Learn more <FaArrowRight className="ml-2 w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-16">
            <Link to="/programs" className="btn-outline text-sm !px-8 hover:border-transparent">
              View All Programs
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════ TESTIMONIALS ═══════════ */}
      <section ref={testRef} className="section-padding bg-surface-bg relative overflow-hidden">
        {/* Subtle background circles */}
        <div className="absolute top-20 left-10 w-64 h-64 border-[40px] border-primary-100 rounded-full opacity-20" />
        <div className="absolute bottom-20 right-10 w-96 h-96 border-[60px] border-primary-100 rounded-full opacity-20" />
        
        <div className={`container-custom mx-auto transition-all duration-700 relative z-10 ${testVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 text-accent-600 font-bold text-sm uppercase tracking-widest mb-4">
               <span className="w-8 h-0.5 bg-accent-500 rounded-full"></span>
               Testimonials
               <span className="w-8 h-0.5 bg-accent-500 rounded-full"></span>
            </span>
            <h2 className="section-title text-primary-600">What People Say</h2>
            <p className="section-subtitle">Hear from our students and community about their experience at Kasturi College.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <div key={i} className="card p-10 relative bg-white border border-primary-50" style={{ animationDelay: `${i * 150}ms` }}>
                <FaQuoteLeft className="text-5xl text-primary-100 absolute top-8 right-8" />
                <div className="flex items-center gap-1 mb-6 relative z-10">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <FaStar key={j} className="text-accent-500 text-sm" />
                  ))}
                </div>
                <p className="text-text-primary text-sm leading-relaxed mb-8 relative z-10 italic font-light">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-4 relative z-10 pt-6 border-t border-primary-50">
                  <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-lg font-display">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-primary-600 text-sm tracking-wide">{t.name}</p>
                    <p className="text-text-secondary text-xs">{t.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ CTA ═══════════ */}
      <section className="py-24 bg-primary-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 pattern-academic opacity-30" />
        <div className="absolute right-0 top-0 w-1/2 h-full bg-primary-500 rounded-l-full blur-3xl opacity-50 mix-blend-screen pointer-events-none" />
        <div className="absolute left-0 bottom-0 w-1/3 h-full bg-primary-700 rounded-r-full blur-3xl opacity-50 mix-blend-multiply pointer-events-none" />
        
        <div className="container-custom mx-auto text-center relative z-10">
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 font-display tracking-tight text-white drop-shadow-sm">Ready to Build Your Future?</h2>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto mb-12 font-light tracking-wide">Join Kasturi College and take the first step towards a successful career in management.</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <Link to="/admissions" className="btn-primary text-base px-10 shadow-[0_4px_20px_-2px_rgba(224,168,0,0.4)]">
              Apply for Admission
            </Link>
            <Link to="/contact" className="btn-outline text-white border-white hover:bg-white hover:text-primary-600 text-base px-10">
              Get in Touch
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

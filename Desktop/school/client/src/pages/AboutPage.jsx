import { Helmet } from 'react-helmet-async';
import { FaEye, FaBullseye, FaGraduationCap, FaUsers, FaLightbulb, FaHandshake, FaQuoteLeft, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useRef, useEffect, useState } from 'react';

const values = [
  { icon: FaGraduationCap, title: 'Academic Excellence', desc: 'Commitment to the highest standards of teaching and learning in management education.' },
  { icon: FaUsers, title: 'Student-Centered', desc: 'Every decision we make is guided by the best interests and growth of our students.' },
  { icon: FaLightbulb, title: 'Innovation', desc: 'Embracing modern teaching methodologies and technology-driven education practices.' },
  { icon: FaHandshake, title: 'Integrity', desc: 'Fostering honesty, transparency, and ethical behaviour in all aspects of our institution.' },
];

const milestones = [
  { year: 'Est.', title: 'Founded', desc: 'Kasturi College was established in Itahari with a vision to provide quality management education in eastern Nepal.' },
  { year: '+2', title: '+2 Management Program', desc: 'Launched the Higher Secondary (+2) Management program, laying a strong academic foundation for students.' },
  { year: 'BBA', title: 'Bachelor Programs', desc: 'Introduced BBA and BBS programs affiliated with Tribhuvan University to expand academic horizons.' },
  { year: 'Now', title: 'Leading Institution', desc: 'Recognized as one of the premier management colleges in the region with 1500+ students and 50+ faculty.' },
];

// Student photos for carousel (placeholder URLs)
const studentPhotos = [
  { id: 1, src: 'https://picsum.photos/seed/kasturi1/280/200', alt: 'Students at Kasturi College' },
  { id: 2, src: 'https://picsum.photos/seed/kasturi2/280/200', alt: 'Campus Life' },
  { id: 3, src: 'https://picsum.photos/seed/kasturi3/280/200', alt: 'Classroom Activities' },
  { id: 4, src: 'https://picsum.photos/seed/kasturi4/280/200', alt: 'Student Events' },
  { id: 5, src: 'https://picsum.photos/seed/kasturi5/280/200', alt: 'Group Study' },
  { id: 6, src: 'https://picsum.photos/seed/kasturi6/280/200', alt: 'College Activities' },
  { id: 7, src: 'https://picsum.photos/seed/kasturi7/280/200', alt: 'Student Life' },
  { id: 8, src: 'https://picsum.photos/seed/kasturi8/280/200', alt: 'Campus Events' },
];

export default function AboutPage() {
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
        <title>About Us — Kasturi College | कस्तुरी कलेज</title>
        <meta name="description" content="Learn about Kasturi College's history, mission, vision, and values. One of the leading management colleges in Itahari, Nepal." />
      </Helmet>

      {/* Hero Banner */}
      <section className="relative pt-32 pb-20 bg-primary-800 text-white overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{ backgroundImage: `url('/college_front.jpg')` }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/90 via-primary-700/85 to-primary-800/95" />
        <div className="absolute inset-0 pattern-academic opacity-20" />
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-400 rounded-full blur-3xl opacity-30 mix-blend-screen" />
        <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="inline-flex items-center gap-2 text-accent-500 font-bold text-sm uppercase tracking-widest mb-4">
             <span className="w-8 h-0.5 bg-accent-500 rounded-full"></span>
             Our Story
             <span className="w-8 h-0.5 bg-accent-500 rounded-full"></span>
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 font-display tracking-tight drop-shadow-sm">About Kasturi College</h1>
          <p className="text-xl text-primary-50 max-w-2xl mx-auto font-light leading-relaxed">Building tomorrow's leaders through quality management education since our founding in Itahari, Nepal.</p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="section-padding bg-surface-bg">
        <div className="container-custom mx-auto">
          <div className="relative">
            {/* Cards Grid */}
            <div className="grid md:grid-cols-2 gap-6 md:gap-[360px] lg:gap-[420px]">
              {/* Vision Card */}
              <div className="bg-primary-600 rounded-2xl p-8 text-white relative overflow-hidden shadow-xl border border-primary-500">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500 rounded-full -translate-y-1/2 translate-x-1/2 opacity-50 blur-xl" />
                <div className="w-14 h-14 rounded-2xl bg-primary-500 flex items-center justify-center mb-5 shadow-inner border border-primary-400">
                   <FaEye className="text-2xl text-accent-500" />
                </div>
                <h3 className="text-2xl font-bold mb-3 font-display tracking-tight">Our Vision</h3>
                <p className="text-primary-100 leading-relaxed font-light">
                  To be the most trusted and preferred management college in Nepal, producing competent professionals
                  who contribute to national and global development through ethical business practices.
                </p>
              </div>

              {/* Mission Card */}
              <div className="bg-white rounded-2xl p-8 relative overflow-hidden shadow-lg border border-primary-50">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-full -translate-y-1/2 translate-x-1/2 blur-xl" />
                <div className="w-14 h-14 rounded-2xl bg-primary-50 flex items-center justify-center mb-5 border border-primary-100">
                   <FaBullseye className="text-2xl text-primary-500" />
                </div>
                <h3 className="text-2xl font-bold text-primary-600 mb-3 font-display tracking-tight">Our Mission</h3>
                <p className="text-text-secondary leading-relaxed font-light">
                  To provide accessible, affordable, and high-quality management education that empowers students
                  with practical skills, critical thinking abilities, and strong ethical values.
                </p>
              </div>
            </div>

            {/* Overlapping Center Image - Inside the gap */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 hidden md:block">
              <div className="w-[320px] h-[320px] lg:w-[380px] lg:h-[380px] rounded-2xl overflow-hidden shadow-2xl border-4 border-white">
                <img
                  src="https://picsum.photos/seed/kasturi-about/500/500"
                  alt="Kasturi College Campus"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Principal's Message */}
      <section className="section-padding bg-white relative">
        <div className="absolute left-0 top-0 w-1/4 h-full bg-surface-bg rounded-r-[100px] -z-10 opacity-50 hidden md:block" />
        <div className="container-custom mx-auto">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-5 gap-12 items-center">
              <div className="md:col-span-2 flex justify-center">
                <div className="relative">
                  <div className="w-64 h-64 sm:w-72 sm:h-72 rounded-[2rem] bg-primary-100 flex items-center justify-center overflow-hidden border-8 border-white shadow-xl">
                    {/* Placeholder for principal image */}
                    <FaUsers className="text-8xl text-primary-300" />
                  </div>
                  <div className="absolute -bottom-4 -right-4 bg-primary-600 text-white px-6 py-3 rounded-xl text-sm font-semibold shadow-xl border border-primary-500 font-display tracking-wide">
                    Principal
                  </div>
                </div>
              </div>
              <div className="md:col-span-3">
                <span className="inline-flex items-center gap-2 text-accent-600 font-bold text-sm uppercase tracking-widest mb-4">
                   <span className="w-8 h-0.5 bg-accent-500 rounded-full"></span>
                   Message
                </span>
                <h2 className="text-3xl sm:text-4xl font-bold text-primary-600 mb-6 font-display tracking-tight leading-tight">Welcome to <span className="text-primary-500">Kasturi College</span></h2>
                <div className="space-y-4 relative">
                  <FaQuoteLeft className="text-6xl text-primary-50 absolute -top-4 -left-6 -z-10" />
                  <p className="text-text-primary leading-relaxed text-lg font-light">
                    &ldquo;At Kasturi College, we believe that education is the most powerful tool for transforming lives
                    and communities. Our dedicated team of educators works tirelessly to ensure that every student
                    receives personalized attention and guidance.&rdquo;
                  </p>
                  <p className="text-text-secondary leading-relaxed font-light">
                    &ldquo;We are proud of the academic milestones we have achieved and remain committed to continuously
                    raising the bar in management education. I invite you to be part of our journey of excellence.&rdquo;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Student Life Carousel */}
      <section className="section-padding bg-surface-bg">
        <div className="container-custom mx-auto">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 text-[#c9a84c] font-bold text-sm uppercase tracking-widest mb-4">
               <span className="w-8 h-0.5 bg-[#c9a84c] rounded-full"></span>
               Campus Life
               <span className="w-8 h-0.5 bg-[#c9a84c] rounded-full"></span>
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1a4a2e] font-display tracking-tight">Student Life at Kasturi College</h2>
          </div>

          {/* Carousel Container */}
          <div className="relative">
            {/* Left Arrow */}
            <button
              onClick={() => scrollCarousel('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-[#1a4a2e] hover:bg-[#143d25] text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 -ml-4"
              aria-label="Scroll left"
            >
              <FaChevronLeft className="text-lg" />
            </button>

            {/* Right Arrow */}
            <button
              onClick={() => scrollCarousel('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-12 h-12 bg-[#1a4a2e] hover:bg-[#143d25] text-white rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 -mr-4"
              aria-label="Scroll right"
            >
              <FaChevronRight className="text-lg" />
            </button>

            {/* Scrollable Container */}
            <div
              ref={carouselRef}
              onMouseEnter={() => setIsPaused(true)}
              onMouseLeave={() => setIsPaused(false)}
              className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth px-8"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {studentPhotos.map((photo) => (
                <div
                  key={photo.id}
                  className="flex-shrink-0 w-[280px] h-[200px] rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer"
                >
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
              ))}
              {/* Duplicate photos for seamless looping */}
              {studentPhotos.map((photo) => (
                <div
                  key={`dup-${photo.id}`}
                  className="flex-shrink-0 w-[280px] h-[200px] rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group cursor-pointer"
                >
                  <img
                    src={photo.src}
                    alt={photo.alt}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section-padding bg-white">
        <div className="container-custom mx-auto">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 text-accent-600 font-bold text-sm uppercase tracking-widest mb-4">
               <span className="w-8 h-0.5 bg-accent-500 rounded-full"></span>
               What We Stand For
               <span className="w-8 h-0.5 bg-accent-500 rounded-full"></span>
            </span>
            <h2 className="section-title text-primary-600">Our Core Values</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((v, i) => (
              <div key={i} className="card p-8 text-center group bg-white border border-primary-50 hover:border-primary-200">
                <div className="w-20 h-20 rounded-2xl bg-primary-50 flex items-center justify-center mx-auto mb-6 group-hover:bg-primary-600 transition-colors duration-300 shadow-sm border border-primary-100 group-hover:border-primary-500">
                  <v.icon className="text-4xl text-primary-400 group-hover:text-accent-500 transition-colors" />
                </div>
                <h3 className="text-xl font-bold text-primary-600 mb-4 font-display tracking-tight">{v.title}</h3>
                <p className="text-text-secondary text-sm leading-relaxed font-light">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Journey / Milestones */}
      <section className="section-padding bg-surface-bg">
        <div className="container-custom mx-auto">
          <div className="text-center mb-16">
             <span className="inline-flex items-center gap-2 text-accent-600 font-bold text-sm uppercase tracking-widest mb-4">
               <span className="w-8 h-0.5 bg-accent-500 rounded-full"></span>
               Our Journey
               <span className="w-8 h-0.5 bg-accent-500 rounded-full"></span>
            </span>
            <h2 className="section-title text-primary-600">Key Milestones</h2>
          </div>
          <div className="max-w-3xl mx-auto">
            <div className="space-y-8 relative before:absolute before:inset-0 before:w-1 before:bg-primary-100 before:ml-8 md:before:ml-0 md:before:left-1/2 md:before:-translate-x-1/2">
              {milestones.map((m, i) => (
                <div key={i} className={`flex items-center flex-col md:flex-row gap-8 relative ${i % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                  <div className="absolute left-8 md:left-1/2 w-4 h-4 rounded-full bg-accent-500 border-4 border-white shadow-sm transform -translate-x-1/2 mt-6 md:mt-0" />

                  <div className={`w-full md:w-1/2 ${i % 2 === 0 ? 'pl-20 md:pl-12 md:pr-0' : 'pl-20 md:pl-0 md:pr-12'} text-left ${i % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>
                    <div className="card p-6 border border-primary-50 shadow-sm hover:shadow-md transition-shadow relative bg-white">
                      <span className="inline-block px-4 py-1.5 rounded-full bg-primary-100 text-primary-700 font-bold text-sm mb-4 font-display">{m.year}</span>
                      <h3 className="text-xl font-bold text-primary-600 mb-2 font-display">{m.title}</h3>
                      <p className="text-text-secondary text-sm leading-relaxed font-light">{m.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

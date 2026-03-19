import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { FaFileAlt, FaCalendarAlt, FaCheckCircle, FaQuestionCircle, FaChevronDown, FaChevronUp, FaArrowRight } from 'react-icons/fa';
import { useState } from 'react';
import ScheduleVisitForm from '../components/ScheduleVisitForm';

const steps = [
  { step: '01', title: 'Collect Prospectus', desc: 'Visit the college or download the prospectus from our website to learn about programs and fees.' },
  { step: '02', title: 'Fill Application Form', desc: 'Complete the admission form available at the college office or online.' },
  { step: '03', title: 'Submit Documents', desc: 'Submit required documents including academic transcripts, citizenship/birth certificate, and passport-sized photos.' },
  { step: '04', title: 'Entrance Exam & Interview', desc: 'Appear for the entrance examination and/or personal interview as scheduled.' },
  { step: '05', title: 'Admission Confirmation', desc: 'Upon selection, complete the admission by paying the required fees within the given deadline.' },
];

const eligibility = [
  { program: '+2 Management', requirements: ['Passed SEE (Secondary Education Examination)', 'Minimum GPA as per NEB requirements', 'Original marksheet and character certificate'] },
  { program: 'BBA', requirements: ['Passed +2 or equivalent from recognized board', 'Minimum 45% aggregate or equivalent GPA', 'TU entrance exam qualification'] },
  { program: 'BBS', requirements: ['Passed +2 or equivalent from recognized board', 'Minimum requirements as per TU norms', 'TU entrance exam qualification'] },
];

const feeStructure = [
  { program: '+2 Management', admission: 'Rs. 15,000', monthly: 'Rs. 3,500', exam: 'As per NEB' },
  { program: 'BBA', admission: 'Rs. 25,000', semester: 'Rs. 22,000', exam: 'As per TU' },
  { program: 'BBS', admission: 'Rs. 18,000', yearly: 'Rs. 18,000', exam: 'As per TU' },
];

const faqs = [
  { q: 'When does the admission process start?', a: 'Admissions typically open after the SEE results for +2, and after +2 results for bachelor programs. Check our notice board for exact dates.' },
  { q: 'Is there a scholarship program?', a: 'Yes, we offer merit-based scholarships to top-performing students. Financial assistance is also available for deserving candidates.' },
  { q: 'What documents are required for admission?', a: 'Original marksheets, character certificate, citizenship/birth certificate copy, passport-sized photos, and migration certificate (if applicable).' },
  { q: 'Is hostel facility available?', a: 'Currently, the college does not have its own hostel, but we can assist students in finding nearby accommodation options.' },
  { q: 'What is the medium of instruction?', a: 'The primary medium of instruction is English, with Nepali used as needed for clarity.' },
];

const dates = [
  { event: 'Admission Form Available', date: 'After SEE / +2 Results' },
  { event: 'Last Date for Form Submission', date: '2 weeks after results' },
  { event: 'Entrance Examination', date: 'As announced' },
  { event: 'Merit List Publication', date: 'Within 1 week of exam' },
  { event: 'Classes Begin', date: 'As per academic calendar' },
];

export default function AdmissionsPage() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <>
      <Helmet>
        <title>Admissions — Kasturi College</title>
        <meta name="description" content="Apply for admission at Kasturi College. Learn about the admission process, eligibility, fee structure, and important dates." />
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
             Join Us
             <span className="w-8 h-0.5 bg-accent-500 rounded-full"></span>
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 font-display tracking-tight border-b-2 border-accent-500/30 inline-block pb-4">Admissions</h1>
          <p className="text-xl text-primary-50 max-w-2xl mx-auto font-light leading-relaxed">Take the first step towards your future in management education at Kasturi College.</p>
        </div>
      </section>

      {/* Admission Process */}
      <section className="section-padding bg-white relative">
        <div className="absolute left-0 top-0 w-1/4 h-full bg-surface-bg rounded-r-[100px] -z-10 opacity-50 hidden md:block" />
        <div className="container-custom mx-auto">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 text-primary-400 font-bold text-sm uppercase tracking-widest mb-4">
               <span className="w-8 h-0.5 bg-primary-300 rounded-full"></span>
               How to Apply
               <span className="w-8 h-0.5 bg-primary-300 rounded-full"></span>
            </span>
            <h2 className="section-title text-primary-600">Admission Process</h2>
          </div>
          <div className="max-w-5xl mx-auto relative">
             {/* Path line connecting steps */}
             <div className="hidden md:block absolute top-[2.25rem] left-[10%] right-[10%] h-0.5 bg-primary-100 z-0 border-t border-dashed border-primary-300"></div>

             <div className="grid md:grid-cols-5 gap-8">
              {steps.map((s, i) => (
                <div key={i} className="text-center group relative z-10">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white text-primary-600 flex items-center justify-center text-xl sm:text-2xl font-bold font-display tracking-tight mx-auto mb-6 group-hover:bg-primary-600 group-hover:text-white transition-colors duration-300 shadow-md border-4 border-primary-50 group-hover:border-primary-100">
                    {s.step}
                  </div>
                  <h3 className="font-bold text-primary-600 text-sm md:text-base mb-3 font-display tracking-wide">{s.title}</h3>
                  <p className="text-text-secondary text-xs sm:text-sm leading-relaxed font-light">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Eligibility */}
      <section className="section-padding bg-surface-bg border-y border-primary-50">
        <div className="container-custom mx-auto">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 text-primary-400 font-bold text-sm uppercase tracking-widest mb-4">
               <span className="w-8 h-0.5 bg-primary-300 rounded-full"></span>
               Requirements
               <span className="w-8 h-0.5 bg-primary-300 rounded-full"></span>
            </span>
            <h2 className="section-title text-primary-600">Eligibility Criteria</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {eligibility.map((e, i) => (
              <div key={i} className="card p-8 bg-white border border-primary-100 hover:border-primary-300 shadow-sm transition-all hover:shadow-md">
                <h3 className="text-2xl font-bold text-primary-600 mb-6 font-display tracking-tight border-b border-primary-50 pb-4">{e.program}</h3>
                <ul className="space-y-4">
                  {e.requirements.map((r, j) => (
                    <li key={j} className="flex items-start gap-4 text-sm text-text-primary font-light">
                      <FaCheckCircle className="text-accent-500 mt-0.5 flex-shrink-0 text-base" />
                      <span className="leading-relaxed pt-0.5">{r}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
       </section>

       {/* Schedule Visit Section */}
       <section className="section-padding bg-white relative">
         <div className="absolute right-0 top-0 w-1/4 h-full bg-surface-bg rounded-l-[100px] -z-10 opacity-50 hidden md:block" />
         <div className="container-custom mx-auto">
           <div className="text-center mb-16">
             <span className="inline-flex items-center gap-2 text-primary-400 font-bold text-sm uppercase tracking-widest mb-4">
                <span className="w-8 h-0.5 bg-primary-300 rounded-full"></span>
                Book Your Visit
                <span className="w-8 h-0.5 bg-primary-300 rounded-full"></span>
             </span>
             <h2 className="section-title text-primary-600">Want to Visit Our Campus?</h2>
             <p className="section-subtitle">Schedule a campus visit and meet our faculty. Our admissions team will contact you to confirm your preferred date and time.</p>
           </div>
           
           <ScheduleVisitForm />
         </div>
       </section>

       {/* Important Dates */}
      <section className="section-padding bg-primary-600 relative overflow-hidden text-white">
        <div className="absolute inset-0 pattern-academic opacity-20" />
        <div className="absolute -left-20 top-0 w-64 h-64 bg-primary-500 rounded-full blur-3xl opacity-50 mix-blend-screen" />
        <div className="absolute -right-20 bottom-0 w-64 h-64 bg-primary-800 rounded-full blur-3xl opacity-50 mix-blend-multiply" />
        
        <div className="container-custom mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
             <div>
                <span className="inline-flex items-center gap-2 text-accent-500 font-bold text-sm uppercase tracking-widest mb-4">
                   <span className="w-8 h-0.5 bg-accent-500 rounded-full"></span>
                   Timeline
                </span>
                <h2 className="text-4xl font-bold text-white mb-6 font-display tracking-tight">Important Dates</h2>
                <p className="text-primary-100 font-light text-lg leading-relaxed max-w-lg mb-8">
                   Keep track of these essential dates for your admission process at Kasturi College. Missing deadlines may affect your enrollment.
                </p>
                <Link to="/contact" className="btn-primary shrink-0 border border-transparent shadow-[0_4px_20px_-2px_rgba(224,168,0,0.3)]">
                   Contact Admissions
                </Link>
             </div>
             <div>
                <div className="space-y-4">
                  {dates.map((d, i) => (
                    <div key={i} className="flex items-center gap-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 shadow-sm hover:bg-white/20 transition-colors">
                      <div className="w-12 h-12 rounded-xl bg-accent-500/20 flex items-center justify-center flex-shrink-0 border border-accent-500/30">
                        <FaCalendarAlt className="text-accent-500 text-lg" />
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-white text-base font-display">{d.event}</p>
                      </div>
                      <span className="text-sm font-medium text-accent-500 bg-white border border-white rounded-full px-4 py-1.5 shadow-sm whitespace-nowrap">{d.date}</span>
                    </div>
                  ))}
                </div>
             </div>
          </div>
        </div>
      </section>

      {/* Fee Structure */}
      <section className="section-padding bg-surface-bg border-y border-primary-50">
        <div className="container-custom mx-auto">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 text-primary-400 font-bold text-sm uppercase tracking-widest mb-4">
               <span className="w-8 h-0.5 bg-primary-300 rounded-full"></span>
               Investment in Your Future
               <span className="w-8 h-0.5 bg-primary-300 rounded-full"></span>
            </span>
            <h2 className="section-title text-primary-600">Fee Structure</h2>
            <p className="section-subtitle">Affordable quality education for all students.</p>
          </div>
          <div className="max-w-5xl mx-auto overflow-x-auto shadow-sm rounded-[2rem] border border-primary-100 bg-white">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-primary-50 border-b border-primary-100">
                  <th className="px-8 py-5 text-sm font-bold text-primary-600 font-display uppercase tracking-widest">Program</th>
                  <th className="px-8 py-5 text-sm font-bold text-primary-600 font-display uppercase tracking-widest">Admission Fee</th>
                  <th className="px-8 py-5 text-sm font-bold text-primary-600 font-display uppercase tracking-widest">Tuition Fee</th>
                  <th className="px-8 py-5 text-sm font-bold text-primary-600 font-display uppercase tracking-widest">Exam Fee</th>
                </tr>
              </thead>
              <tbody>
                {feeStructure.map((f, i) => (
                  <tr key={i} className="border-b border-primary-50 hover:bg-surface-bg transition-colors">
                    <td className="px-8 py-6 font-bold text-primary-600 text-base font-display">{f.program}</td>
                    <td className="px-8 py-6 text-text-primary text-sm font-light">{f.admission}</td>
                    <td className="px-8 py-6 text-text-primary text-sm font-light">
                        <span className="font-medium">{f.monthly || f.semester || f.yearly}</span>
                        <span className="text-xs text-text-secondary ml-1">{f.monthly ? '/month' : f.semester ? '/semester' : '/year'}</span>
                    </td>
                    <td className="px-8 py-6 text-text-primary text-sm font-light">{f.exam}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="p-4 bg-primary-50/50 border-t border-primary-100 text-center">
                 <p className="text-xs text-text-secondary font-medium tracking-wide uppercase">* Fee structure is approximate and subject to change. Contact the college for exact figures.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="section-padding bg-white relative">
        <div className="container-custom mx-auto">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 text-primary-400 font-bold text-sm uppercase tracking-widest mb-4">
               <span className="w-8 h-0.5 bg-primary-300 rounded-full"></span>
               FAQs
               <span className="w-8 h-0.5 bg-primary-300 rounded-full"></span>
            </span>
            <h2 className="section-title text-primary-600">Frequently Asked Questions</h2>
          </div>
          <div className="max-w-4xl mx-auto space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className={`border rounded-2xl overflow-hidden transition-all duration-300 ${openFaq === i ? 'border-primary-300 bg-white shadow-md' : 'border-primary-100 bg-surface-bg hover:border-primary-200'}`}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-8 py-6 text-left"
                >
                  <span className={`font-bold font-display text-base tracking-wide pr-4 transition-colors ${openFaq === i ? 'text-primary-600' : 'text-primary-500'}`}>{faq.q}</span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-colors ${openFaq === i ? 'bg-primary-50 text-primary-600' : 'bg-white border border-primary-100 text-primary-400'}`}>
                     {openFaq === i ? <FaChevronUp className="text-xs" /> : <FaChevronDown className="text-xs" />}
                  </div>
                </button>
                <div className={`transition-all duration-300 overflow-hidden ${openFaq === i ? 'max-h-40 pb-6 opacity-100' : 'max-h-0 opacity-0'}`}>
                  <p className="px-8 text-text-secondary text-sm leading-relaxed font-light">{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

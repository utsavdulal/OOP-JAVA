import { Helmet } from 'react-helmet-async';
import { useState } from 'react';
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock, FaPaperPlane } from 'react-icons/fa';
import toast from 'react-hot-toast';
import axios from 'axios';

const contactInfo = [
  { icon: FaMapMarkerAlt, label: 'Visit Campus', value: 'BP Complex, BP Chowk', sub: 'Ward No. 8, Itahari 56705', href: null },
  { icon: FaPhoneAlt, label: 'Call Us', value: '025-583563', sub: 'Administrative Office', href: 'tel:025-583563' },
  { icon: FaEnvelope, label: 'Email Us', value: 'info@kasturicollege.edu.np', sub: 'Online Support', href: 'mailto:info@kasturicollege.edu.np' },
  { icon: FaClock, label: 'Office Hours', value: 'Sun–Fri: 7:00 AM – 5:00 PM', sub: 'Closed on Saturdays', href: null },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required';
    if (!form.email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email format';
    if (!form.subject.trim()) errs.subject = 'Subject is required';
    if (!form.message.trim()) errs.message = 'Message is required';
    else if (form.message.trim().length < 10) errs.message = 'Message must be at least 10 characters';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await axios.post('/api/v1/contact', form);
      toast.success('Message sent successfully! We will get back to you soon.', {
        style: { background: '#3F6F5A', color: '#fff', borderRadius: '12px', padding: '16px' }
      });
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
      setErrors({});
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong. Please try again.', {
        style: { background: '#dc2626', color: '#fff', borderRadius: '12px', padding: '16px' }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  return (
    <>
      <Helmet>
        <title>Contact Us — Kasturi College</title>
        <meta name="description" content="Get in touch with Kasturi College. Visit us at BP Chowk, Itahari or call 025-583563." />
      </Helmet>

      {/* Hero */}
      <section className="relative pt-32 pb-32 bg-primary-800 text-white overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{ backgroundImage: `url('/college_front.jpg')` }}
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/90 via-primary-700/85 to-primary-800/95" />
        <div className="absolute inset-0 pattern-academic opacity-20" />
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary-400 rounded-full blur-3xl opacity-30 mix-blend-screen" />
        <div className="container-custom mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <span className="inline-flex items-center gap-2 text-accent-500 font-bold text-sm uppercase tracking-widest mb-4">
             <span className="w-8 h-0.5 bg-accent-500 rounded-full"></span>
             Get in Touch
             <span className="w-8 h-0.5 bg-accent-500 rounded-full"></span>
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 font-display tracking-tight border-b-2 border-accent-500/30 inline-block pb-4">Contact Us</h1>
          <p className="text-xl text-primary-50 max-w-2xl mx-auto font-light leading-relaxed">Have questions? We&apos;d love to hear from you. Reach out and we&apos;ll respond as soon as we can.</p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="relative -mt-20 z-10 px-4 sm:px-6 lg:px-8 mb-16">
        <div className="container-custom mx-auto">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, i) => (
              <div key={i} className="bg-white rounded-[2rem] p-8 shadow-lg hover:shadow-xl transition-all duration-300 text-center border border-primary-50 hover:-translate-y-2 group">
                <div className="w-16 h-16 rounded-full bg-primary-50 flex items-center justify-center mx-auto mb-6 group-hover:bg-primary-600 transition-colors duration-300 border border-primary-100 group-hover:border-primary-500">
                  <info.icon className="text-2xl text-primary-500 group-hover:text-accent-500 transition-colors" />
                </div>
                <h3 className="font-bold text-primary-600 font-display tracking-tight mb-2 text-lg">{info.label}</h3>
                {info.href ? (
                  <a href={info.href} className="text-sm text-text-primary hover:text-primary-600 transition-colors block mb-1 font-medium">{info.value}</a>
                ) : (
                  <p className="text-sm text-text-primary mb-1 font-medium">{info.value}</p>
                )}
                <p className="text-xs text-text-secondary font-light">{info.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form + Map */}
      <section className="section-padding bg-surface-bg pt-0">
        <div className="container-custom mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-stretch">
            {/* Contact Form */}
            <div className="bg-white rounded-[2rem] p-8 sm:p-12 shadow-sm border border-primary-100">
              <span className="inline-block text-accent-600 font-bold text-xs uppercase tracking-widest mb-3 border border-accent-500/30 bg-accent-500/10 px-3 py-1 rounded-full">Message</span>
              <h2 className="text-3xl font-bold text-primary-600 mb-4 font-display tracking-tight">Send Us a Message</h2>
              <p className="text-text-secondary text-sm mb-10 font-light leading-relaxed">Fill out the form below and our administration team will get back to you within 24 hours.</p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-primary-600 uppercase tracking-widest mb-2">Full Name *</label>
                    <input
                      type="text" name="name" value={form.name} onChange={handleChange}
                      className={`w-full px-5 py-3.5 rounded-xl border bg-surface-bg text-text-primary ${errors.name ? 'border-red-400 bg-red-50' : 'border-primary-100'} focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:bg-white outline-none transition-all text-sm`}
                      placeholder="Your full name"
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-2 font-medium">{errors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-primary-600 uppercase tracking-widest mb-2">Email *</label>
                    <input
                      type="email" name="email" value={form.email} onChange={handleChange}
                      className={`w-full px-5 py-3.5 rounded-xl border bg-surface-bg text-text-primary ${errors.email ? 'border-red-400 bg-red-50' : 'border-primary-100'} focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:bg-white outline-none transition-all text-sm`}
                      placeholder="your@email.com"
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-2 font-medium">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-primary-600 uppercase tracking-widest mb-2">Phone</label>
                    <input
                      type="tel" name="phone" value={form.phone} onChange={handleChange}
                      className="w-full px-5 py-3.5 rounded-xl border bg-surface-bg border-primary-100 focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:bg-white outline-none transition-all text-sm text-text-primary"
                      placeholder="Your phone number"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-primary-600 uppercase tracking-widest mb-2">Subject *</label>
                    <input
                      type="text" name="subject" value={form.subject} onChange={handleChange}
                      className={`w-full px-5 py-3.5 rounded-xl border bg-surface-bg text-text-primary ${errors.subject ? 'border-red-400 bg-red-50' : 'border-primary-100'} focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:bg-white outline-none transition-all text-sm`}
                      placeholder="What is this about?"
                    />
                    {errors.subject && <p className="text-red-500 text-xs mt-2 font-medium">{errors.subject}</p>}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-primary-600 uppercase tracking-widest mb-2">Message *</label>
                  <textarea
                    name="message" value={form.message} onChange={handleChange} rows={5}
                    className={`w-full px-5 py-3.5 rounded-xl border bg-surface-bg text-text-primary ${errors.message ? 'border-red-400 bg-red-50' : 'border-primary-100'} focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 focus:bg-white outline-none transition-all text-sm resize-none`}
                    placeholder="Write your message here..."
                  />
                  {errors.message && <p className="text-red-500 text-xs mt-2 font-medium">{errors.message}</p>}
                </div>

                <div className="pt-2">
                  <button
                    type="submit" disabled={loading}
                    className="btn-primary w-full shadow-md disabled:opacity-70 disabled:cursor-not-allowed group"
                  >
                    {loading ? (
                      <span className="flex items-center gap-3">
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
                        Sending...
                      </span>
                    ) : (
                      <span className="flex items-center gap-3">
                        <FaPaperPlane className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
                        Send Message
                      </span>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Map */}
            <div className="h-full min-h-[400px]">
              <div className="rounded-[2rem] overflow-hidden shadow-sm border border-primary-100 h-full relative group">
                <div className="absolute inset-0 bg-primary-600/10 pointer-events-none group-hover:bg-transparent transition-colors z-10 duration-500" />
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3569.7!2d87.2736!3d26.6648!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39ef6e0b0b0b0b0b%3A0x0!2sBP%20Chowk%2C%20Itahari!5e0!3m2!1sen!2snp!4v1"
                  width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade" title="Kasturi College Location"
                  className="grayscale filter opacity-90 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                />

                {/* Floating Map Label */}
                <div className="absolute top-6 left-6 z-20 bg-white/90 backdrop-blur-md px-5 py-3 rounded-xl shadow-lg border border-primary-100 flex items-center gap-3 transform -translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                   <div className="w-8 h-8 rounded-full bg-accent-500/20 flex items-center justify-center border border-accent-500/30">
                      <FaMapMarkerAlt className="text-accent-600 text-sm" />
                   </div>
                   <div>
                      <p className="font-bold text-primary-600 text-sm font-display tracking-tight leading-tight">BP Chowk, Itahari</p>
                      <p className="text-[10px] text-text-secondary font-bold uppercase tracking-widest mt-0.5">Sunsari, Nepal</p>
                   </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

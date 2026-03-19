import { useState } from 'react';
import { FiAlertCircle, FiCheckCircle } from 'react-icons/fi';
import api from '../utils/api';

const ScheduleVisitForm = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    program: '',
    visitDate: '',
    timeSlot: '',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [messageCharCount, setMessageCharCount] = useState(0);

  const timeSlots = ['10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'];
  const programs = ['+2 Management', 'BBA', 'BBS'];

  // Get minimum date (tomorrow)
  const getMinDate = () => {
    const date = new Date();
    date.setDate(date.getDate() + 1);
    return date.toISOString().split('T')[0];
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Phone number must be 10 digits';
    }
    if (!formData.program) newErrors.program = 'Please select a program';
    if (!formData.visitDate) newErrors.visitDate = 'Please select a visit date';
    if (!formData.timeSlot) newErrors.timeSlot = 'Please select a time slot';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'message') {
      setMessageCharCount(value.length);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!validateForm()) return;

    try {
      setLoading(true);
      const response = await api.post('/schedule-visit', formData);

      setSuccessMessage(response.data.message);
      setSubmitted(true);

      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        program: '',
        visitDate: '',
        timeSlot: '',
        message: '',
      });
      setMessageCharCount(0);

      // Auto hide success message
      setTimeout(() => {
        setSuccessMessage('');
        setSubmitted(false);
      }, 5000);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Failed to schedule visit. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-green-50 border-2 border-green-500 rounded-xl p-8 text-center">
        <FiCheckCircle className="mx-auto mb-4 text-green-600" size={48} />
        <h3 className="text-xl font-bold text-green-800 mb-2">Request Submitted!</h3>
        <p className="text-green-700">{successMessage}</p>
        <p className="text-sm text-green-600 mt-2">We will contact you shortly to confirm your visit.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-slate-800 mb-6">Schedule Your Campus Visit</h2>

      {errorMessage && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded flex gap-3 text-red-800">
          <FiAlertCircle size={20} className="mt-0.5 flex-shrink-0" />
          <p>{errorMessage}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="fullName"
            value={formData.fullName}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${
              errors.fullName ? 'border-red-500 focus:ring-red-500' : 'border-slate-300'
            }`}
            placeholder="e.g., John Doe"
          />
          {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${
              errors.email ? 'border-red-500 focus:ring-red-500' : 'border-slate-300'
            }`}
            placeholder="your.email@example.com"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Phone Number <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${
              errors.phone ? 'border-red-500 focus:ring-red-500' : 'border-slate-300'
            }`}
            placeholder="9841234567"
          />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
        </div>

        {/* Program */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Interested Program <span className="text-red-500">*</span>
          </label>
          <select
            name="program"
            value={formData.program}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition bg-white ${
              errors.program ? 'border-red-500 focus:ring-red-500' : 'border-slate-300'
            }`}
          >
            <option value="">Select a program</option>
            {programs.map((prog) => (
              <option key={prog} value={prog}>
                {prog}
              </option>
            ))}
          </select>
          {errors.program && <p className="text-red-500 text-xs mt-1">{errors.program}</p>}
        </div>

        {/* Visit Date */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Visit Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="visitDate"
            value={formData.visitDate}
            onChange={handleChange}
            min={getMinDate()}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${
              errors.visitDate ? 'border-red-500 focus:ring-red-500' : 'border-slate-300'
            }`}
          />
          {errors.visitDate && <p className="text-red-500 text-xs mt-1">{errors.visitDate}</p>}
        </div>

        {/* Time Slot */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Preferred Time Slot <span className="text-red-500">*</span>
          </label>
          <select
            name="timeSlot"
            value={formData.timeSlot}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition bg-white ${
              errors.timeSlot ? 'border-red-500 focus:ring-red-500' : 'border-slate-300'
            }`}
          >
            <option value="">Select time slot</option>
            {timeSlots.map((slot) => (
              <option key={slot} value={slot}>
                {slot}
              </option>
            ))}
          </select>
          {errors.timeSlot && <p className="text-red-500 text-xs mt-1">{errors.timeSlot}</p>}
        </div>
      </div>

      {/* Message */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">
          Additional Message <span className="text-slate-500 text-xs">(Optional)</span>
        </label>
        <textarea
          name="message"
          value={formData.message}
          onChange={handleChange}
          maxLength={500}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
          placeholder="Tell us about your interests or any questions you have..."
          rows={4}
        />
        <p className="text-xs text-slate-500 mt-1">
          {messageCharCount} / 500 characters
        </p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            Scheduling...
          </>
        ) : (
          'Schedule Visit'
        )}
      </button>

      <p className="text-center text-sm text-slate-600">
        We will contact you at the provided email and phone number to confirm your campus visit.
      </p>
    </form>
  );
};

export default ScheduleVisitForm;

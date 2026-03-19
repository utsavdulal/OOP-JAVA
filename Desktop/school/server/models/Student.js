const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  rollNumber: { type: String, required: true, unique: true },
  email: String,
  phone: String,
  class: { type: String, required: true },
  section: { type: String, required: true },
  dateOfBirth: { type: Date, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },
  guardianName: String,
  guardianPhone: String,
  address: String,
  photo: String,
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Student', StudentSchema);

const mongoose = require('mongoose');

const ResultSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  subject: { type: String, required: true },
  examType: { type: String, enum: ['Unit Test', 'Midterm', 'Final'], required: true },
  marksObtained: { type: Number, required: true },
  fullMarks: { type: Number, required: true, default: 100 },
  grade: { type: String },
  remarks: { type: String },
  academicYear: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Result', ResultSchema);

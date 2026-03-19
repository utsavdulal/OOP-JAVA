const mongoose = require('mongoose');

const AttendanceSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ['Present', 'Absent', 'Late', 'Leave'], required: true },
  class: { type: String, required: true },
  section: { type: String, required: true }
});

module.exports = mongoose.model('Attendance', AttendanceSchema);

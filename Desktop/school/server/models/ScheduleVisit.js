const mongoose = require('mongoose');

const ScheduleVisitSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
    },
    program: {
      type: String,
      enum: ['+2 Management', 'BBA', 'BBS'],
      required: true,
    },
    visitDate: {
      type: Date,
      required: true,
    },
    timeSlot: {
      type: String,
      enum: ['10:00 AM', '11:00 AM', '12:00 PM', '02:00 PM', '03:00 PM', '04:00 PM'],
      required: true,
    },
    message: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
    },
    adminNotes: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ScheduleVisit', ScheduleVisitSchema);

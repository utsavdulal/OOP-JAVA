const mongoose = require('mongoose');

const FeeSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  feeType: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  paidAmount: { type: Number, required: true, default: 0 },
  dueDate: { type: Date, required: true },
  academicYear: { type: String, required: true },
  paymentDate: { type: Date },
  paymentMethod: { type: String, enum: ['Cash', 'Online', 'Cheque'] },
  receiptNumber: { type: String },
  status: { type: String, enum: ['Paid', 'Partial', 'Unpaid'], required: true, default: 'Unpaid' }
});

module.exports = mongoose.model('Fee', FeeSchema);

const mongoose = require('mongoose');

const feePaymentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'StudentDetail',
      required: [true, 'Student is required'],
    },
    feeStructure: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FeeStructure',
      required: [true, 'Fee structure is required'],
    },
    amountPaid: {
      type: Number,
      required: [true, 'Amount paid is required'],
      min: 0,
    },
    paymentDate: {
      type: Date,
      default: Date.now,
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'online', 'cheque', 'bank_transfer'],
      required: [true, 'Payment method is required'],
    },
    receiptNumber: {
      type: String,
      required: [true, 'Receipt number is required'],
      unique: true,
    },
    status: {
      type: String,
      enum: ['paid', 'partial', 'pending', 'overdue'],
      default: 'paid',
    },
    remarks: {
      type: String,
      default: '',
    },
    receivedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('FeePayment', feePaymentSchema);

const mongoose = require('mongoose');

const feeStructureSchema = new mongoose.Schema(
  {
    feeType: {
      type: String,
      enum: ['tuition', 'exam', 'library', 'sports', 'lab', 'transport', 'hostel', 'other'],
      required: [true, 'Fee type is required'],
    },
    name: {
      type: String,
      required: [true, 'Fee name is required'],
      trim: true,
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required'],
      min: 0,
    },
    dueDate: {
      type: Date,
      required: [true, 'Due date is required'],
    },
    academicYear: {
      type: String,
      required: [true, 'Academic year is required'],
    },
    applicableProgram: {
      type: String,
      default: 'all',
    },
    applicableSemester: {
      type: Number,
      default: null,
    },
    description: {
      type: String,
      default: '',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('FeeStructure', feeStructureSchema);

const mongoose = require('mongoose');

const studentDetailSchema = new mongoose.Schema(
  {
    rollNumber: { 
      type: String, 
      required: [true, 'Roll number is required'], 
      unique: true,
      trim: true 
    },
    firstName: { 
      type: String, 
      required: [true, 'First name is required'], 
      trim: true 
    },
    lastName: { 
      type: String, 
      required: [true, 'Last name is required'], 
      trim: true 
    },
    email: { 
      type: String, 
      required: [true, 'Email is required'], 
      trim: true, 
      lowercase: true 
    },
    phone: { 
      type: String, 
      trim: true, 
      default: '' 
    },
    parentPhone: { 
      type: String, 
      trim: true, 
      default: '' 
    },
    dateOfBirth: { 
      type: Date, 
      default: null 
    },
    gender: { 
      type: String, 
      enum: ['male', 'female', 'other'],
      default: null 
    },
    program: { 
      type: String, 
      trim: true, 
      default: '' 
    },
    semester: { 
      type: Number, 
      default: 1 
    },
    address: { 
      type: String, 
      default: '' 
    },
    city: { 
      type: String, 
      default: '' 
    },
    state: { 
      type: String, 
      default: '' 
    },
    pincode: { 
      type: String, 
      default: '' 
    },
    photo: { 
      type: String, 
      default: null 
    },
    admissionDate: { 
      type: Date, 
      default: Date.now 
    },
    status: { 
      type: String, 
      enum: ['active', 'graduated', 'dropped'],
      default: 'active'
    },
    gpa: { 
      type: Number, 
      default: 0 
    },
    notes: { 
      type: String, 
      default: '' 
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: true
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('StudentDetail', studentDetailSchema);

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema(
  {
    email: { 
      type: String, 
      required: [true, 'Email is required'], 
      unique: true, 
      trim: true, 
      lowercase: true 
    },
    password: { 
      type: String, 
      required: [true, 'Password is required'], 
      minlength: [8, 'Password must be at least 8 characters'],
      validate: {
        validator: function(v) {
          // Password must contain: uppercase, lowercase, number, special char
          return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(v);
        },
        message: 'Password must contain uppercase, lowercase, number, and special character (@$!%*?&)'
      },
      select: false 
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
    phone: { 
      type: String, 
      trim: true, 
      default: '' 
    },
    department: { 
      type: String, 
      trim: true, 
      default: '' 
    },
    qualification: { 
      type: String, 
      trim: true, 
      default: '' 
    },
    photo: { 
      type: String, 
      default: null 
    },
    bio: { 
      type: String, 
      default: '' 
    },
    isActive: { 
      type: Boolean, 
      default: true 
    },
  },
  { timestamps: true }
);

// Hash password before saving
adminSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password
adminSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('Admin', adminSchema);

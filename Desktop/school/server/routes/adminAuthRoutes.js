const express = require('express');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Register Admin/Teacher
router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName, phone, department } = req.body;

    // Validation
    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, first name, and last name are required.',
      });
    }

    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: 'Admin with this email already exists.',
      });
    }

    // Validate password complexity
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password)) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters and contain uppercase, lowercase, number, and special character (@$!%*?&)',
      });
    }

    // Create new admin
    const admin = new Admin({
      email,
      password,
      firstName,
      lastName,
      phone: phone || '',
      department: department || '',
    });

    await admin.save();

    // Require JWT_SECRET to be set
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not set in environment variables');
      return res.status(500).json({
        success: false,
        message: 'Server configuration error.',
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Set httpOnly cookie
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.status(201).json({
      success: true,
      message: 'Admin registered successfully.',
      admin: {
        id: admin._id,
        email: admin.email,
        firstName: admin.firstName,
        lastName: admin.lastName,
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Error registering admin. Please try again.',
    });
  }
});

// Login Admin/Teacher
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required.',
      });
    }

    // Find admin and select password field
    const admin = await Admin.findOne({ email }).select('+password');
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Verify password
    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    // Check if admin is active
    if (!admin.isActive) {
      return res.status(403).json({
        success: false,
        message: 'This admin account is inactive.',
      });
    }

    // Require JWT_SECRET to be set
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not set in environment variables');
      return res.status(500).json({
        success: false,
        message: 'Server configuration error.',
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    // Set httpOnly cookie
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    res.status(200).json({
      success: true,
      message: 'Admin logged in successfully.',
      admin: {
        id: admin._id,
        email: admin.email,
        firstName: admin.firstName,
        lastName: admin.lastName,
        department: admin.department,
        photo: admin.photo,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error logging in. Please try again.',
    });
  }
});

// Get Admin Profile
router.get('/profile', authMiddleware, async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id);
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found.',
      });
    }

    res.status(200).json({
      success: true,
      admin,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching profile.',
      error: error.message,
    });
  }
});

// Update Admin Profile
router.put('/profile', authMiddleware, async (req, res) => {
  try {
    const { firstName, lastName, phone, department, qualification, bio, photo } = req.body;

    const admin = await Admin.findByIdAndUpdate(
      req.admin.id,
      {
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        phone: phone || undefined,
        department: department || undefined,
        qualification: qualification || undefined,
        bio: bio || undefined,
        photo: photo || undefined,
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      admin,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating profile.',
      error: error.message,
    });
  }
});

// Change Password
router.put('/change-password', authMiddleware, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Old password and new password are required.',
      });
    }

    const admin = await Admin.findById(req.admin.id).select('+password');
    const isPasswordValid = await admin.comparePassword(oldPassword);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Old password is incorrect.',
      });
    }

    admin.password = newPassword;
    await admin.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error changing password.',
      error: error.message,
    });
  }
});

// Get All Faculty (for public faculty page)
router.get('/faculty', async (req, res) => {
  try {
    const faculty = await Admin.find({ isActive: true }).select('firstName lastName department qualification bio photo');

    res.status(200).json({
      success: true,
      count: faculty.length,
      faculty,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching faculty.',
      error: error.message,
    });
  }
});

// Logout Admin (clears httpOnly cookie)
router.post('/logout', (req, res) => {
  try {
    res.clearCookie('authToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.status(200).json({
      success: true,
      message: 'Logged out successfully.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error logging out.',
      error: error.message,
    });
  }
});

module.exports = router;

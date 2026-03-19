const express = require('express');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');
const Result = require('../models/Result');
const Attendance = require('../models/Attendance');
const Fee = require('../models/Fee');
const Notice = require('../models/Notice');
const Announcement = require('../models/Announcement');
const studentAuthMiddleware = require('../middleware/studentAuthMiddleware');

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { rollNumber, dateOfBirth } = req.body;
    if (!rollNumber || !dateOfBirth) {
      return res.status(400).json({ message: 'Roll Number and Date of Birth are required' });
    }

    const student = await Student.findOne({ rollNumber });
    if (!student) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Dob validation - simpler because dob is stored as YYYY-MM-DD
    const inputDate = new Date(dateOfBirth).toISOString().split('T')[0];
    const studentDate = new Date(student.dateOfBirth).toISOString().split('T')[0];
    const passwordMatch = inputDate === studentDate || inputDate === student.password;

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Require JWT_SECRET to be set
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not set in environment variables');
      return res.status(500).json({
        success: false,
        message: 'Server configuration error.',
      });
    }

    const token = jwt.sign(
      { studentId: student._id, rollNumber: student.rollNumber },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token, studentId: student._id, rollNumber: student.rollNumber });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'An error occurred. Please try again.' });
  }
});

router.get('/profile', studentAuthMiddleware, async (req, res) => {
  try {
    const student = await Student.findById(req.student.studentId).select('-password');
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

router.get('/results', studentAuthMiddleware, async (req, res) => {
  try {
    const { examType } = req.query;
    let query = { studentId: req.student.studentId };
    if (examType && examType !== 'All') query.examType = examType;
    
    const results = await Result.find(query).sort({ createdAt: -1 });
    res.json(results);
  } catch (err) {
    console.error('Error fetching results:', err);
    res.status(500).json({ message: 'Error fetching results' });
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    const { rollNumber, dateOfBirth, newPassword } = req.body;

    if (!rollNumber || !dateOfBirth || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Roll number, date of birth, and new password are required.',
      });
    }

    // Validate password complexity
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(newPassword)) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters and contain uppercase, lowercase, number, and special character (@$!%*?&)',
      });
    }

    const student = await Student.findOne({ rollNumber }).select('+password');
    if (!student) {
      return res.status(401).json({
        success: false,
        message: 'Invalid roll number or date of birth.',
      });
    }

    // Verify date of birth
    const inputDate = new Date(dateOfBirth).toISOString().split('T')[0];
    const studentDate = new Date(student.dateOfBirth).toISOString().split('T')[0];
    if (inputDate !== studentDate) {
      return res.status(401).json({
        success: false,
        message: 'Invalid roll number or date of birth.',
      });
    }

    // Update password
    student.password = newPassword;
    await student.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successfully. Please login with your new password.',
    });
  } catch (error) {
    console.error('Password reset error:', error);
    res.status(500).json({
      success: false,
      message: 'Error resetting password.',
    });
  }
});

router.get('/attendance', studentAuthMiddleware, async (req, res) => {
  try {
    const records = await Attendance.find({ studentId: req.student.studentId }).sort({ date: 1 });
    const total = records.length;
    const present = records.filter(r => r.status === 'Present').length;
    const absent = records.filter(r => r.status === 'Absent').length;
    const late = records.filter(r => r.status === 'Late').length;
    const leave = records.filter(r => r.status === 'Leave').length;

    res.json({
      summary: { total, present, absent, late, leave, percentage: total ? ((present + late) / total * 100).toFixed(2) : 0 },
      records
    });
  } catch (err) {
    console.error('Error fetching attendance:', err);
    res.status(500).json({ message: 'Error fetching attendance data' });
  }
});

router.get('/fees', studentAuthMiddleware, async (req, res) => {
  try {
    const fees = await Fee.find({ studentId: req.student.studentId }).sort({ createdAt: -1 });
    res.json(fees);
  } catch (err) {
    console.error('Error fetching fees:', err);
    res.status(500).json({ message: 'Error fetching fees information' });
  }
});

router.get('/notices', async (req, res) => {
  try {
    const { category } = req.query;
    let query = {};
    if (category && category !== 'All') query.category = category;
    
    const notices = await Notice.find(query).sort({ date: -1 });
    res.json(notices);
  } catch (err) {
    console.error('Error fetching notices:', err);
    res.status(500).json({ message: 'Error fetching notices' });
  }
});

router.get('/announcements', async (req, res) => {
  try {
    const announcements = await Announcement.find().sort({ date: -1 });
    res.json(announcements);
  } catch (err) {
    console.error('Error fetching announcements:', err);
    res.status(500).json({ message: 'Error fetching announcements' });
  }
});

module.exports = router;

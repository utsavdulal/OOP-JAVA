const express = require('express');
const StudentDetail = require('../models/StudentDetail');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Get all students (admin only)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const students = await StudentDetail.find()
      .populate('createdBy', 'firstName lastName')
      .sort({ rollNumber: 1 });

    res.status(200).json({
      success: true,
      count: students.length,
      students,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching students.',
      error: error.message,
    });
  }
});

// Get student by ID (admin only)
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const student = await StudentDetail.findById(req.params.id)
      .populate('createdBy', 'firstName lastName');

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found.',
      });
    }

    res.status(200).json({
      success: true,
      student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching student.',
      error: error.message,
    });
  }
});

// Create new student (admin only)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { 
      rollNumber, firstName, lastName, email, phone, parentPhone, 
      dateOfBirth, gender, program, semester, address, city, state, 
      pincode, admissionDate, status, gpa, notes 
    } = req.body;

    if (!rollNumber || !firstName || !lastName || !email) {
      return res.status(400).json({
        success: false,
        message: 'Roll number, first name, last name, and email are required.',
      });
    }

    // Check if student with same roll number exists
    const existingStudent = await StudentDetail.findOne({ rollNumber });
    if (existingStudent) {
      return res.status(400).json({
        success: false,
        message: 'Student with this roll number already exists.',
      });
    }

    const student = new StudentDetail({
      rollNumber,
      firstName,
      lastName,
      email,
      phone: phone || '',
      parentPhone: parentPhone || '',
      dateOfBirth: dateOfBirth || null,
      gender: gender || null,
      program: program || '',
      semester: semester || 1,
      address: address || '',
      city: city || '',
      state: state || '',
      pincode: pincode || '',
      admissionDate: admissionDate || Date.now(),
      status: status || 'active',
      gpa: gpa || 0,
      notes: notes || '',
      createdBy: req.admin.id,
    });

    await student.save();

    res.status(201).json({
      success: true,
      message: 'Student added successfully.',
      student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding student.',
      error: error.message,
    });
  }
});

// Update student (admin only)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { 
      firstName, lastName, email, phone, parentPhone, 
      dateOfBirth, gender, program, semester, address, city, state, 
      pincode, photo, status, gpa, notes 
    } = req.body;

    const student = await StudentDetail.findByIdAndUpdate(
      req.params.id,
      {
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        email: email || undefined,
        phone: phone || undefined,
        parentPhone: parentPhone || undefined,
        dateOfBirth: dateOfBirth || undefined,
        gender: gender || undefined,
        program: program || undefined,
        semester: semester || undefined,
        address: address || undefined,
        city: city || undefined,
        state: state || undefined,
        pincode: pincode || undefined,
        photo: photo || undefined,
        status: status || undefined,
        gpa: gpa || undefined,
        notes: notes || undefined,
      },
      { new: true, runValidators: true }
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Student updated successfully.',
      student,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating student.',
      error: error.message,
    });
  }
});

// Delete student (admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const student = await StudentDetail.findByIdAndDelete(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: 'Student not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Student deleted successfully.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting student.',
      error: error.message,
    });
  }
});

module.exports = router;

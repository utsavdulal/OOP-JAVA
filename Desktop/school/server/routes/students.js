const express = require('express');
const Student = require('../models/Student');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};
    if (search) {
      // Validate and sanitize search input - escape special regex characters
      const escapedSearch = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      // Limit search to reasonable length to prevent ReDoS attacks
      if (escapedSearch.length > 100) {
        return res.status(400).json({ message: 'Search query too long' });
      }
      query = {
        $or: [
          { fullName: { $regex: escapedSearch, $options: 'i' } },
          { rollNumber: { $regex: escapedSearch, $options: 'i' } },
          { email: { $regex: escapedSearch, $options: 'i' } }
        ]
      };
    }
    const students = await Student.find(query).sort({ fullName: 1 });
    // Exclude passwords
    const studentsWithoutPassword = students.map(s => {
      const { password, ...rest } = s._doc;
      return rest;
    });
    res.json(studentsWithoutPassword);
  } catch (err) {
    console.error('Error fetching students:', err);
    res.status(500).json({ message: err.message });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const studentData = req.body;
    // Generate a stronger default password: SchoolName_RollNumber_RandomCode
    const randomCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    studentData.password = `KasturiCollege_${studentData.rollNumber}_${randomCode}`;
    const student = new Student(studentData);
    await student.save();
    
    const { password, ...rest } = student._doc;
    res.status(201).json(rest);
  } catch (err) {
    console.error('Error creating student:', err);
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const studentData = req.body;
    // FIXED: Do NOT overwrite password when updating student info
    // Remove password from update payload to prevent accidental overwrite
    delete studentData.password;
    
    const student = await Student.findByIdAndUpdate(req.params.id, studentData, { new: true });
    if (!student) return res.status(404).json({ message: 'Student not found' });
    
    const { password, ...rest } = student._doc;
    res.json(rest);
  } catch (err) {
    console.error('Error updating student:', err);
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json({ message: 'Student deleted' });
  } catch (err) {
    console.error('Error deleting student:', err);
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    const { password, ...rest } = student._doc;
    res.json(rest);
  } catch (err) {
    console.error('Error fetching student by ID:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

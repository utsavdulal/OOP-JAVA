const express = require('express');
const Result = require('../models/Result');
const StudentDetail = require('../models/StudentDetail');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Get all results (with filters)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { student, examType, program, semester, academicYear } = req.query;
    const filter = {};

    if (student) filter.student = student;
    if (examType) filter.examType = examType;
    if (program) filter.program = program;
    if (semester) filter.semester = parseInt(semester);
    if (academicYear) filter.academicYear = academicYear;

    const results = await Result.find(filter)
      .populate('student', 'rollNumber firstName lastName program semester')
      .populate('createdBy', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: results.length,
      results,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching results.',
      error: error.message,
    });
  }
});

// Get results for a specific student
router.get('/student/:studentId', authMiddleware, async (req, res) => {
  try {
    const results = await Result.find({ student: req.params.studentId })
      .populate('student', 'rollNumber firstName lastName program semester')
      .sort({ createdAt: -1 });

    // Calculate overall stats
    const totalMarks = results.reduce((acc, r) => acc + r.marksObtained, 0);
    const totalFullMarks = results.reduce((acc, r) => acc + r.fullMarks, 0);
    const overallPercentage = totalFullMarks > 0 ? (totalMarks / totalFullMarks) * 100 : 0;
    const passedSubjects = results.filter(r => r.isPassed).length;

    res.status(200).json({
      success: true,
      count: results.length,
      results,
      stats: {
        totalMarks,
        totalFullMarks,
        overallPercentage: Math.round(overallPercentage * 100) / 100,
        passedSubjects,
        failedSubjects: results.length - passedSubjects,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching student results.',
      error: error.message,
    });
  }
});

// Create new result
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { student, subject, examType, marksObtained, fullMarks, remarks, academicYear, semester } = req.body;

    if (!student || !subject || !examType || marksObtained === undefined || !fullMarks) {
      return res.status(400).json({
        success: false,
        message: 'Student, subject, exam type, marks obtained, and full marks are required.',
      });
    }

    // Verify student exists
    const studentExists = await StudentDetail.findById(student);
    if (!studentExists) {
      return res.status(404).json({
        success: false,
        message: 'Student not found.',
      });
    }

    const result = new Result({
      student,
      subject,
      examType,
      marksObtained,
      fullMarks,
      remarks: remarks || '',
      academicYear: academicYear || new Date().getFullYear().toString(),
      semester: semester || studentExists.semester || 1,
      createdBy: req.admin.id,
    });

    await result.save();
    await result.populate('student', 'rollNumber firstName lastName program semester');

    res.status(201).json({
      success: true,
      message: 'Result added successfully.',
      result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error adding result.',
      error: error.message,
    });
  }
});

// Update result
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { subject, examType, marksObtained, fullMarks, remarks, academicYear, semester } = req.body;

    const result = await Result.findById(req.params.id);
    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Result not found.',
      });
    }

    // Update fields
    if (subject) result.subject = subject;
    if (examType) result.examType = examType;
    if (marksObtained !== undefined) result.marksObtained = marksObtained;
    if (fullMarks) result.fullMarks = fullMarks;
    if (remarks !== undefined) result.remarks = remarks;
    if (academicYear) result.academicYear = academicYear;
    if (semester) result.semester = semester;

    await result.save(); // This will trigger the pre-save hook
    await result.populate('student', 'rollNumber firstName lastName program semester');

    res.status(200).json({
      success: true,
      message: 'Result updated successfully.',
      result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating result.',
      error: error.message,
    });
  }
});

// Delete result
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const result = await Result.findByIdAndDelete(req.params.id);

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Result not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Result deleted successfully.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting result.',
      error: error.message,
    });
  }
});

module.exports = router;

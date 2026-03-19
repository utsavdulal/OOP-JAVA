const express = require('express');
const Result = require('../models/Result');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

const calculateGrade = (marksObtained, fullMarks) => {
  const percentage = (marksObtained / fullMarks) * 100;
  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B+';
  if (percentage >= 60) return 'B';
  if (percentage >= 50) return 'C';
  if (percentage >= 40) return 'D';
  return 'F';
};

router.get('/', authMiddleware, async (req, res) => {
  try {
    const { studentId, examType, class: studentClass } = req.query;
    let query = {};
    
    // Validate and sanitize studentId (must be valid MongoDB ObjectId)
    if (studentId) {
      if (!/^[a-f\d]{24}$/i.test(studentId)) {
        return res.status(400).json({ message: 'Invalid student ID format' });
      }
      query.studentId = studentId;
    }
    
    // Validate examType (alphanumeric and spaces only)
    if (examType) {
      if (!/^[a-zA-Z0-9\s]+$/.test(examType)) {
        return res.status(400).json({ message: 'Invalid exam type format' });
      }
      query.examType = examType;
    }
    
    let results = await Result.find(query).populate('studentId', 'fullName rollNumber class section').sort({ createdAt: -1 });
    
    if (studentClass) {
      results = results.filter(r => r.studentId && r.studentId.class === studentClass);
    }
    
    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const resultData = req.body;
    resultData.grade = calculateGrade(resultData.marksObtained, resultData.fullMarks || 100);
    const result = new Result(resultData);
    await result.save();
    
    const populatedResult = await Result.findById(result._id).populate('studentId', 'fullName rollNumber class section');
    res.status(201).json(populatedResult);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const resultData = req.body;
    if (resultData.marksObtained !== undefined) {
      const fullMarks = resultData.fullMarks || 100;
      resultData.grade = calculateGrade(resultData.marksObtained, fullMarks);
    }
    const result = await Result.findByIdAndUpdate(req.params.id, resultData, { new: true }).populate('studentId', 'fullName rollNumber class section');
    if (!result) return res.status(404).json({ message: 'Result not found' });
    res.json(result);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const result = await Result.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: 'Result not found' });
    res.json({ message: 'Result deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

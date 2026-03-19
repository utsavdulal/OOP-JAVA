const express = require('express');
const Attendance = require('../models/Attendance');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', authMiddleware, async (req, res) => {
  try {
    const { date, class: studentClass, section, studentId } = req.query;
    let query = {};
    
    // Validate and sanitize studentId (must be valid MongoDB ObjectId)
    if (studentId) {
      if (!/^[a-f\d]{24}$/i.test(studentId)) {
        return res.status(400).json({ message: 'Invalid student ID format' });
      }
      query.studentId = studentId;
    }
    
    // Validate class and section (alphanumeric only)
    if (studentClass) {
      if (!/^[a-zA-Z0-9]+$/.test(studentClass)) {
        return res.status(400).json({ message: 'Invalid class format' });
      }
      query.class = studentClass;
    }
    if (section) {
      if (!/^[a-zA-Z0-9]+$/.test(section)) {
        return res.status(400).json({ message: 'Invalid section format' });
      }
      query.section = section;
    }
    
    // Validate date format
    if (date) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return res.status(400).json({ message: 'Invalid date format. Use YYYY-MM-DD' });
      }
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setDate(end.getDate() + 1);
      query.date = { $gte: start, $lt: end };
    }
    
    const records = await Attendance.find(query).populate('studentId', 'fullName rollNumber');
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/bulk', authMiddleware, async (req, res) => {
  try {
    const records = req.body;
    for (let record of records) {
      const start = new Date(record.date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setDate(end.getDate() + 1);

      await Attendance.findOneAndUpdate(
        { studentId: record.studentId, date: { $gte: start, $lt: end } },
        { ...record, date: start },
        { upsert: true, new: true }
      );
    }
    res.status(201).json({ message: 'Attendance saved successfully' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const record = await Attendance.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!record) return res.status(404).json({ message: 'Record not found' });
    res.json(record);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/summary/:studentId', authMiddleware, async (req, res) => {
  try {
    const records = await Attendance.find({ studentId: req.params.studentId }).sort({ date: 1 });
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
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

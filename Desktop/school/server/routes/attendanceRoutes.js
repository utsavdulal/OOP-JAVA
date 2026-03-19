const express = require('express');
const Attendance = require('../models/Attendance');
const StudentDetail = require('../models/StudentDetail');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Get attendance records (with filters)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { student, program, semester, startDate, endDate, status } = req.query;
    const filter = {};

    if (student) filter.student = student;
    if (program) filter.program = program;
    if (semester) filter.semester = parseInt(semester);
    if (status) filter.status = status;
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const attendance = await Attendance.find(filter)
      .populate('student', 'rollNumber firstName lastName program semester')
      .populate('markedBy', 'firstName lastName')
      .sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: attendance.length,
      attendance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching attendance.',
      error: error.message,
    });
  }
});

// Get students by program/semester for attendance marking
router.get('/students', authMiddleware, async (req, res) => {
  try {
    const { program, semester } = req.query;
    const filter = { status: 'active' };

    if (program) filter.program = program;
    if (semester) filter.semester = parseInt(semester);

    const students = await StudentDetail.find(filter)
      .select('rollNumber firstName lastName program semester')
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

// Get attendance for a specific student
router.get('/student/:studentId', authMiddleware, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    const filter = { student: req.params.studentId };

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const attendance = await Attendance.find(filter).sort({ date: -1 });

    // Calculate stats
    const total = attendance.length;
    const present = attendance.filter(a => a.status === 'present').length;
    const absent = attendance.filter(a => a.status === 'absent').length;
    const late = attendance.filter(a => a.status === 'late').length;
    const leave = attendance.filter(a => a.status === 'leave').length;
    const percentage = total > 0 ? ((present + late) / total) * 100 : 0;

    res.status(200).json({
      success: true,
      count: total,
      attendance,
      stats: {
        total,
        present,
        absent,
        late,
        leave,
        percentage: Math.round(percentage * 100) / 100,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching student attendance.',
      error: error.message,
    });
  }
});

// Get attendance for a specific date
router.get('/date/:date', authMiddleware, async (req, res) => {
  try {
    const { program, semester } = req.query;
    const date = new Date(req.params.date);
    date.setHours(0, 0, 0, 0);

    const nextDay = new Date(date);
    nextDay.setDate(nextDay.getDate() + 1);

    const filter = {
      date: { $gte: date, $lt: nextDay },
    };
    if (program) filter.program = program;
    if (semester) filter.semester = parseInt(semester);

    const attendance = await Attendance.find(filter)
      .populate('student', 'rollNumber firstName lastName program semester')
      .sort({ 'student.rollNumber': 1 });

    res.status(200).json({
      success: true,
      count: attendance.length,
      attendance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching attendance for date.',
      error: error.message,
    });
  }
});

// Mark attendance (bulk)
router.post('/bulk', authMiddleware, async (req, res) => {
  try {
    const { date, attendanceData, program, semester } = req.body;

    if (!date || !attendanceData || !Array.isArray(attendanceData)) {
      return res.status(400).json({
        success: false,
        message: 'Date and attendance data are required.',
      });
    }

    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);

    const results = [];
    const errors = [];

    for (const record of attendanceData) {
      try {
        // Check if attendance already exists
        const existing = await Attendance.findOne({
          student: record.student,
          date: attendanceDate,
        });

        if (existing) {
          // Update existing
          existing.status = record.status;
          existing.remarks = record.remarks || '';
          await existing.save();
          results.push(existing);
        } else {
          // Create new
          const attendance = new Attendance({
            student: record.student,
            date: attendanceDate,
            status: record.status,
            program: program || '',
            semester: semester || 1,
            remarks: record.remarks || '',
            markedBy: req.admin.id,
          });
          await attendance.save();
          results.push(attendance);
        }
      } catch (err) {
        errors.push({ student: record.student, error: err.message });
      }
    }

    res.status(201).json({
      success: true,
      message: `Attendance marked for ${results.length} students.`,
      count: results.length,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error marking attendance.',
      error: error.message,
    });
  }
});

// Mark single attendance
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { student, date, status, program, semester, remarks } = req.body;

    if (!student || !date || !status) {
      return res.status(400).json({
        success: false,
        message: 'Student, date, and status are required.',
      });
    }

    const attendanceDate = new Date(date);
    attendanceDate.setHours(0, 0, 0, 0);

    // Check if already exists
    let attendance = await Attendance.findOne({ student, date: attendanceDate });

    if (attendance) {
      attendance.status = status;
      attendance.remarks = remarks || '';
      await attendance.save();
    } else {
      attendance = new Attendance({
        student,
        date: attendanceDate,
        status,
        program: program || '',
        semester: semester || 1,
        remarks: remarks || '',
        markedBy: req.admin.id,
      });
      await attendance.save();
    }

    await attendance.populate('student', 'rollNumber firstName lastName program semester');

    res.status(201).json({
      success: true,
      message: 'Attendance marked successfully.',
      attendance,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Attendance already marked for this student on this date.',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error marking attendance.',
      error: error.message,
    });
  }
});

// Update attendance
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { status, remarks } = req.body;

    const attendance = await Attendance.findByIdAndUpdate(
      req.params.id,
      { status, remarks },
      { new: true, runValidators: true }
    ).populate('student', 'rollNumber firstName lastName program semester');

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'Attendance record not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Attendance updated successfully.',
      attendance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating attendance.',
      error: error.message,
    });
  }
});

// Delete attendance
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const attendance = await Attendance.findByIdAndDelete(req.params.id);

    if (!attendance) {
      return res.status(404).json({
        success: false,
        message: 'Attendance record not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Attendance deleted successfully.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting attendance.',
      error: error.message,
    });
  }
});

module.exports = router;

const express = require('express');
const FeeStructure = require('../models/FeeStructure');
const FeePayment = require('../models/FeePayment');
const StudentDetail = require('../models/StudentDetail');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// ============ FEE STRUCTURE ROUTES ============

// Get all fee structures
router.get('/structures', authMiddleware, async (req, res) => {
  try {
    const { feeType, academicYear, program, isActive } = req.query;
    const filter = {};

    if (feeType) filter.feeType = feeType;
    if (academicYear) filter.academicYear = academicYear;
    if (program) filter.applicableProgram = program;
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const structures = await FeeStructure.find(filter)
      .populate('createdBy', 'firstName lastName')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: structures.length,
      structures,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching fee structures.',
      error: error.message,
    });
  }
});

// Create fee structure
router.post('/structures', authMiddleware, async (req, res) => {
  try {
    const { feeType, name, amount, dueDate, academicYear, applicableProgram, applicableSemester, description } = req.body;

    if (!feeType || !name || !amount || !dueDate || !academicYear) {
      return res.status(400).json({
        success: false,
        message: 'Fee type, name, amount, due date, and academic year are required.',
      });
    }

    const structure = new FeeStructure({
      feeType,
      name,
      amount,
      dueDate,
      academicYear,
      applicableProgram: applicableProgram || 'all',
      applicableSemester: applicableSemester || null,
      description: description || '',
      createdBy: req.admin.id,
    });

    await structure.save();

    res.status(201).json({
      success: true,
      message: 'Fee structure created successfully.',
      structure,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating fee structure.',
      error: error.message,
    });
  }
});

// Update fee structure
router.put('/structures/:id', authMiddleware, async (req, res) => {
  try {
    const structure = await FeeStructure.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!structure) {
      return res.status(404).json({
        success: false,
        message: 'Fee structure not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Fee structure updated successfully.',
      structure,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating fee structure.',
      error: error.message,
    });
  }
});

// Delete fee structure
router.delete('/structures/:id', authMiddleware, async (req, res) => {
  try {
    const structure = await FeeStructure.findByIdAndDelete(req.params.id);

    if (!structure) {
      return res.status(404).json({
        success: false,
        message: 'Fee structure not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Fee structure deleted successfully.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting fee structure.',
      error: error.message,
    });
  }
});

// ============ FEE PAYMENT ROUTES ============

// Get all payments
router.get('/payments', authMiddleware, async (req, res) => {
  try {
    const { student, feeType, status, startDate, endDate } = req.query;
    const filter = {};

    if (student) filter.student = student;
    if (status) filter.status = status;
    if (startDate || endDate) {
      filter.paymentDate = {};
      if (startDate) filter.paymentDate.$gte = new Date(startDate);
      if (endDate) filter.paymentDate.$lte = new Date(endDate);
    }

    let payments = await FeePayment.find(filter)
      .populate('student', 'rollNumber firstName lastName program semester')
      .populate('feeStructure', 'feeType name amount')
      .populate('receivedBy', 'firstName lastName')
      .sort({ paymentDate: -1 });

    // Filter by fee type if provided
    if (feeType) {
      payments = payments.filter(p => p.feeStructure?.feeType === feeType);
    }

    res.status(200).json({
      success: true,
      count: payments.length,
      payments,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching payments.',
      error: error.message,
    });
  }
});

// Get payments for a specific student
router.get('/payments/student/:studentId', authMiddleware, async (req, res) => {
  try {
    const payments = await FeePayment.find({ student: req.params.studentId })
      .populate('feeStructure', 'feeType name amount dueDate')
      .populate('receivedBy', 'firstName lastName')
      .sort({ paymentDate: -1 });

    // Get all applicable fee structures for the student
    const student = await StudentDetail.findById(req.params.studentId);
    const structures = await FeeStructure.find({
      isActive: true,
      $or: [
        { applicableProgram: 'all' },
        { applicableProgram: student?.program || '' },
      ],
    });

    // Calculate outstanding dues
    const totalFees = structures.reduce((acc, s) => acc + s.amount, 0);
    const totalPaid = payments.reduce((acc, p) => acc + p.amountPaid, 0);
    const outstanding = totalFees - totalPaid;

    res.status(200).json({
      success: true,
      payments,
      structures,
      summary: {
        totalFees,
        totalPaid,
        outstanding,
        status: outstanding <= 0 ? 'paid' : outstanding < totalFees ? 'partial' : 'unpaid',
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching student payments.',
      error: error.message,
    });
  }
});

// Record payment
router.post('/payments', authMiddleware, async (req, res) => {
  try {
    const { student, feeStructure, amountPaid, paymentDate, paymentMethod, receiptNumber, remarks } = req.body;

    if (!student || !feeStructure || !amountPaid || !paymentMethod || !receiptNumber) {
      return res.status(400).json({
        success: false,
        message: 'Student, fee structure, amount, payment method, and receipt number are required.',
      });
    }

    // Verify student and fee structure exist
    const studentExists = await StudentDetail.findById(student);
    if (!studentExists) {
      return res.status(404).json({
        success: false,
        message: 'Student not found.',
      });
    }

    const feeExists = await FeeStructure.findById(feeStructure);
    if (!feeExists) {
      return res.status(404).json({
        success: false,
        message: 'Fee structure not found.',
      });
    }

    // Check if receipt number already exists
    const existingReceipt = await FeePayment.findOne({ receiptNumber });
    if (existingReceipt) {
      return res.status(400).json({
        success: false,
        message: 'Receipt number already exists.',
      });
    }

    // Determine payment status
    const existingPayments = await FeePayment.find({ student, feeStructure });
    const totalPaid = existingPayments.reduce((acc, p) => acc + p.amountPaid, 0) + amountPaid;
    let status = 'partial';
    if (totalPaid >= feeExists.amount) {
      status = 'paid';
    }

    const payment = new FeePayment({
      student,
      feeStructure,
      amountPaid,
      paymentDate: paymentDate || new Date(),
      paymentMethod,
      receiptNumber,
      status,
      remarks: remarks || '',
      receivedBy: req.admin.id,
    });

    await payment.save();
    await payment.populate('student', 'rollNumber firstName lastName program semester');
    await payment.populate('feeStructure', 'feeType name amount');

    res.status(201).json({
      success: true,
      message: 'Payment recorded successfully.',
      payment,
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Receipt number already exists.',
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error recording payment.',
      error: error.message,
    });
  }
});

// Update payment
router.put('/payments/:id', authMiddleware, async (req, res) => {
  try {
    const payment = await FeePayment.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    )
      .populate('student', 'rollNumber firstName lastName program semester')
      .populate('feeStructure', 'feeType name amount');

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Payment updated successfully.',
      payment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating payment.',
      error: error.message,
    });
  }
});

// Delete payment
router.delete('/payments/:id', authMiddleware, async (req, res) => {
  try {
    const payment = await FeePayment.findByIdAndDelete(req.params.id);

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Payment deleted successfully.',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting payment.',
      error: error.message,
    });
  }
});

module.exports = router;

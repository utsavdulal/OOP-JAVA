const express = require('express');
const Fee = require('../models/Fee');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

const calculateStatus = (paidAmount, totalAmount) => {
  if (!paidAmount || paidAmount <= 0) return 'Unpaid';
  if (paidAmount >= totalAmount) return 'Paid';
  return 'Partial';
};

router.get('/', authMiddleware, async (req, res) => {
  try {
    const { studentId, status, class: classFilter } = req.query;
    let query = {};
    
    // Validate and sanitize studentId (must be valid MongoDB ObjectId)
    if (studentId) {
      if (!/^[a-f\d]{24}$/i.test(studentId)) {
        return res.status(400).json({ message: 'Invalid student ID format' });
      }
      query.studentId = studentId;
    }
    
    // Validate status (only allow specific values)
    if (status) {
      const validStatuses = ['Paid', 'Unpaid', 'Partial'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status value' });
      }
      query.status = status;
    }
    
    let records = await Fee.find(query).populate('studentId', 'fullName rollNumber class section').sort({ createdAt: -1 });
    
    if (classFilter) {
      records = records.filter(r => r.studentId && r.studentId.class === classFilter);
    }
    
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', authMiddleware, async (req, res) => {
  try {
    const feeData = req.body;
    feeData.status = calculateStatus(feeData.paidAmount, feeData.totalAmount);
    
    const fee = new Fee(feeData);
    await fee.save();
    
    const populatedObj = await Fee.findById(fee._id).populate('studentId', 'fullName rollNumber class section');
    res.status(201).json(populatedObj);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const feeData = req.body;
    if (feeData.totalAmount !== undefined && feeData.paidAmount !== undefined) {
      feeData.status = calculateStatus(feeData.paidAmount, feeData.totalAmount);
    }
    const fee = await Fee.findByIdAndUpdate(req.params.id, feeData, { new: true }).populate('studentId', 'fullName rollNumber class section');
    if (!fee) return res.status(404).json({ message: 'Fee record not found' });
    res.json(fee);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const fee = await Fee.findByIdAndDelete(req.params.id);
    if (!fee) return res.status(404).json({ message: 'Fee record not found' });
    res.json({ message: 'Fee record deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

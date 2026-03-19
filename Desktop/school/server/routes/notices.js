const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Notice = require('../models/Notice');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    cb(null, 'notice-' + Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });

router.get('/', async (req, res) => {
  try {
    const notices = await Notice.find().sort({ date: -1 });
    res.json(notices);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', authMiddleware, upload.single('attachment'), async (req, res) => {
  try {
    const noticeData = { ...req.body };
    if (req.file) {
      noticeData.attachment = '/uploads/' + req.file.filename;
    }
    const notice = new Notice(noticeData);
    await notice.save();
    res.status(201).json(notice);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.put('/:id', authMiddleware, upload.single('attachment'), async (req, res) => {
  try {
    const noticeData = { ...req.body };
    if (req.file) {
      noticeData.attachment = '/uploads/' + req.file.filename;
    }
    const notice = await Notice.findByIdAndUpdate(req.params.id, noticeData, { new: true });
    if (!notice) return res.status(404).json({ message: 'Notice not found' });
    res.json(notice);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);
    if (!notice) return res.status(404).json({ message: 'Notice not found' });
    
    if (notice.attachment) {
      const filePath = path.join(__dirname, '..', notice.attachment);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }
    
    await Notice.findByIdAndDelete(req.params.id);
    res.json({ message: 'Notice deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;

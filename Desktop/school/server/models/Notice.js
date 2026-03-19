const mongoose = require('mongoose');

const NoticeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  category: { type: String, enum: ['Academic', 'Administrative', 'Event', 'Holiday'], required: true },
  date: { type: Date, default: Date.now },
  attachment: String,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Notice', NoticeSchema);

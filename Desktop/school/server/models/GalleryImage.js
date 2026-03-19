const mongoose = require('mongoose');

const GalleryImageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  imageUrl: { type: String, required: true },
  uploadedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('GalleryImage', GalleryImageSchema);

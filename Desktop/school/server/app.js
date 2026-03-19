const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const contactRoutes = require('./routes/contactRoutes');
const adminAuthRoutes = require('./routes/adminAuthRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const announcementRoutes = require('./routes/announcementRoutes');
const noticeRoutes = require('./routes/noticeRoutes');
const studentDetailRoutes = require('./routes/studentDetailRoutes');
const messagesRoutes = require('./routes/messagesRoutes');
const resultRoutes = require('./routes/resultRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const feeRoutes = require('./routes/feeRoutes');
const scheduleVisitRoutes = require('./routes/scheduleVisitRoutes');

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
  frameguard: { action: 'deny' },
  noSniff: true,
  xssFilter: true,
  strictTransportSecurity: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
}));

// CORS - restrict to specific origins
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5000',
  'http://localhost:5173',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed'));
    }
  },
  credentials: true,
}));

// Cookie parser
app.use(cookieParser());

// Input validation is handled per-route with sanitization checks
// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests, please try again later.' },
});
app.use(limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
}

// Serve uploaded files
app.use('/uploads', express.static('uploads'));

// Health check
app.get('/api/v1/health', (req, res) => {
  res.json({
    success: true,
    message: 'Kasturi College API is running',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});

// Routes - Existing (to prevent breaking frontend temporarily)
app.use('/api/v1/contact', contactRoutes);
app.use('/api/v1/admin/auth', adminAuthRoutes);
app.use('/api/v1/gallery', galleryRoutes);
app.use('/api/v1/announcements', announcementRoutes);
app.use('/api/v1/notices', noticeRoutes);
app.use('/api/v1/students', studentDetailRoutes);
app.use('/api/v1/messages', messagesRoutes);
app.use('/api/v1/results', resultRoutes);
app.use('/api/v1/attendance', attendanceRoutes);
app.use('/api/v1/fees', feeRoutes);

// New Routes as requested by user
const newGalleryRoutes = require('./routes/gallery');
const newAnnouncementRoutes = require('./routes/announcements');
const newNoticeRoutes = require('./routes/notices');
const newStudentRoutes = require('./routes/students');
const newResultRoutes = require('./routes/results');
const newAttendanceRoutes = require('./routes/attendance');
const newFeeRoutes = require('./routes/fees');
const studentAuthRoutes = require('./routes/studentAuth');

app.use('/api/gallery', newGalleryRoutes);
app.use('/api/announcements', newAnnouncementRoutes);
app.use('/api/notices', newNoticeRoutes);
app.use('/api/students', newStudentRoutes);
app.use('/api/results', newResultRoutes);
app.use('/api/attendance', newAttendanceRoutes);
app.use('/api/fees', newFeeRoutes);
app.use('/api/student', studentAuthRoutes);
app.use('/api', scheduleVisitRoutes);


// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
  });
});

module.exports = app;

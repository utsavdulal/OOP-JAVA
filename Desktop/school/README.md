# Kasturi College Management System

A modern, full-stack MERN application for managing college admissions, campus visits, and student information. Built with React, Express, MongoDB, and Node.js.

## Features

### Core Features
- ✅ **Student Authentication** - Secure login/registration with bcrypt hashing
- ✅ **Admin Dashboard** - Comprehensive admin panel for management
- ✅ **Photo Upload System** - Base64 encoded photo storage for students and programs
- ✅ **Campus Visit Scheduling** - Interactive form for booking campus visits
- ✅ **Admin Visit Management** - View, filter, update, and export campus visit requests
- ✅ **Email Notifications** - Automated emails for visit confirmations and status updates
- ✅ **Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- ✅ **Security Features** - HTTPOnly cookies, JWT authentication, input sanitization

### Recent Updates (March 2026)
1. **Admin Campus Visit Dashboard** - Complete CRUD interface for managing visit requests
2. **Email Notifications System** - Nodemailer integration with HTML email templates
3. **Comprehensive Testing** - Full test coverage and deployment readiness
4. **Security Hardening** - Fixed XSS vulnerability, password reset bug, API URL hardcoding

## Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **React Helmet** - SEO
- **React Icons** - Icon library
- **React Hot Toast** - Notifications

### Backend
- **Node.js** - Runtime
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **Bcryptjs** - Password hashing
- **Nodemailer** - Email service
- **Helmet** - Security headers
- **CORS** - Cross-origin requests

## Installation

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- npm or yarn

### Setup Instructions

1. **Clone Repository**
```bash
git clone https://github.com/yourusername/kasturi-college.git
cd kasturi-college
```

2. **Backend Setup**
```bash
cd server
npm install
```

3. **Frontend Setup**
```bash
cd ../client
npm install
```

4. **Environment Configuration**
```bash
# In server directory
cp .env.example .env
# Edit .env with your configuration
```

5. **Start Development Servers**

Terminal 1 (Backend):
```bash
cd server
npm run dev
```

Terminal 2 (Frontend):
```bash
cd client
npm run dev
```

Visit `http://localhost:5173` for the frontend and `http://localhost:5000` for the API.

## Configuration

### Required Environment Variables

**Backend (.env)**
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/kasturi-college
JWT_SECRET=your-secret-key
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=app-specific-password
```

See `.env.example` for complete reference.

## Project Structure

```
kasturi-college/
├── server/
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── middleware/      # Authentication & utilities
│   ├── utils/          # Helper functions (emailService)
│   ├── server.js       # Entry point
│   └── package.json
├── client/
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── pages/      # Page components
│   │   ├── utils/      # Utilities
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
├── .env.example
├── DEPLOYMENT_GUIDE.md
├── TESTING_CHECKLIST.md
└── README.md
```

## API Endpoints

### Public Endpoints
- `POST /api/schedule-visit` - Submit campus visit request
- `POST /api/students/register` - Student registration
- `POST /api/students/login` - Student login
- `POST /api/admin/register` - Admin registration
- `POST /api/admin/login` - Admin login

### Admin Endpoints (Authentication Required)
- `GET /api/schedule-visits` - Get all visit requests
- `GET /api/schedule-visits?status=pending` - Filter by status
- `GET /api/schedule-visits/:id` - Get single visit
- `PUT /api/schedule-visits/:id/status` - Update visit status
- `DELETE /api/schedule-visits/:id` - Delete visit request

## Usage Examples

### Schedule Campus Visit
```javascript
// Frontend
const response = await api.post('/schedule-visit', {
  fullName: 'John Doe',
  email: 'john@example.com',
  phone: '9841234567',
  program: 'BBA',
  visitDate: '2026-03-25',
  timeSlot: '10:00 AM',
  message: 'Optional message'
});
```

### Admin: View Visits
```javascript
const response = await api.get('/schedule-visits?status=pending');
const visits = response.data.visits;
```

### Admin: Update Status
```javascript
await api.put(`/schedule-visits/${visitId}/status`, {
  status: 'confirmed',
  adminNotes: 'Visit confirmed for BBA program'
});
```

## Security Features

1. **HTTPOnly Cookies** - Admin tokens stored securely
2. **JWT Authentication** - Secure token-based auth
3. **Password Hashing** - Bcryptjs encryption
4. **CORS Protection** - Controlled cross-origin requests
5. **Input Sanitization** - Prevent XSS attacks
6. **Helmet.js** - Security headers
7. **Rate Limiting** - Prevent abuse
8. **Environment Variables** - No hardcoded secrets

## Email Templates

The system includes professional HTML email templates for:
- Visit request confirmation
- Visit status confirmation
- Visit cancellation
- Post-visit thank you

All templates are customizable in `server/utils/emailService.js`.

## Testing

Comprehensive testing checklist available in `TESTING_CHECKLIST.md`.

Quick test:
```bash
# Backend
cd server && npm run dev

# Frontend  
cd client && npm run dev

# Test API
curl -X POST http://localhost:5000/api/schedule-visit \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test","email":"test@test.com","phone":"9841234567","program":"BBA","visitDate":"2026-03-25","timeSlot":"10:00 AM"}'
```

## Deployment

See `DEPLOYMENT_GUIDE.md` for detailed deployment instructions.

Quick deployment options:
- Docker & Docker Compose
- Heroku
- DigitalOcean / AWS / Azure
- Traditional VPS with PM2

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers

## Known Limitations

1. Photo storage uses base64 encoding (suitable for small files)
2. Email notifications require valid SMTP credentials
3. Without email config, emails log to console
4. Admin accounts must be created via registration endpoint

## Performance

- Frontend bundle size: ~487 KB (gzipped: ~139 KB)
- API response time: <100ms (typical)
- Database queries optimized
- Static asset caching enabled

## Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED
Solution: Start MongoDB service or check MONGODB_URI in .env
```

### Email Not Sending
```
Check EMAIL_USER and EMAIL_PASSWORD in .env
Verify Gmail app-specific password (if using Gmail)
Check email service logs
```

### Frontend Build Error
```
Delete node_modules and package-lock.json
Run npm install again
Clear Vite cache: rm -rf node_modules/.vite
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## License

This project is proprietary to Kasturi College.

## Support

For support, email: admissions@kasturicollege.edu.np

## Changelog

### Version 1.2.0 (March 19, 2026)
- Added admin campus visit management dashboard
- Integrated Nodemailer for email notifications
- Fixed security vulnerabilities (XSS, password reset)
- Added comprehensive testing and deployment guides
- Improved UI/UX with status badges and filters

### Version 1.1.0
- Photo upload system
- Schedule campus visit form
- Program images management

### Version 1.0.0
- Initial release
- Student & admin authentication
- Basic admin dashboard

## Authors

- **Frontend Developer** - React/Vite implementation
- **Backend Developer** - Express/MongoDB API
- **DevOps** - Deployment & infrastructure

## Acknowledgments

- Kasturi College Administration
- Community contributors
- Open-source libraries and frameworks

---

**Last Updated**: March 19, 2026  
**Status**: Production Ready ✅

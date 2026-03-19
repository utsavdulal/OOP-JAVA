# Deployment Guide - Kasturi College Management System

## Pre-Deployment Checklist

### Environment Configuration
- [ ] Update `.env` file with production values
- [ ] Set `NODE_ENV=production`
- [ ] Configure email service credentials
- [ ] Update MongoDB connection string to production database
- [ ] Configure JWT_SECRET and other secrets
- [ ] Set CORS_ORIGIN for your domain

### Security
- [ ] Enable HTTPS/SSL certificates
- [ ] Configure secure CORS headers
- [ ] Set secure cookies options (production mode)
- [ ] Verify authentication middleware active
- [ ] Check rate limiting is enabled
- [ ] Validate input sanitization

### Email Service Setup
For Gmail (recommended for quick setup):
```env
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password
EMAIL_FROM=noreply@kasturicollege.edu.np
```

For other services (SendGrid, Mailgun, etc):
```env
EMAIL_SERVICE=custom-service
SMTP_HOST=smtp.example.com
SMTP_PORT=587
EMAIL_USER=your-username
EMAIL_PASSWORD=your-password
EMAIL_FROM=noreply@kasturicollege.edu.np
```

### Database Setup
1. Create MongoDB database for production
2. Create backups
3. Set up database user with appropriate permissions
4. Update connection string in `.env`:
```env
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/kasturi-college
```

## Deployment Steps

### Option 1: Deploy with Docker (Recommended)

#### Dockerfile for Backend
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY server/package*.json ./
RUN npm ci --only=production
COPY server/ .
EXPOSE 5000
CMD ["node", "server.js"]
```

#### Dockerfile for Frontend
```dockerfile
FROM node:18-alpine as build
WORKDIR /app
COPY client/package*.json ./
RUN npm ci
COPY client/ .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Docker Compose
```yaml
version: '3.8'
services:
  backend:
    build:
      context: .
      dockerfile: Dockerfile.backend
    ports:
      - "5000:5000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=${MONGODB_URI}
      - JWT_SECRET=${JWT_SECRET}
      - EMAIL_USER=${EMAIL_USER}
      - EMAIL_PASSWORD=${EMAIL_PASSWORD}
    restart: unless-stopped

  frontend:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "80:80"
    depends_on:
      - backend
    restart: unless-stopped

  mongodb:
    image: mongo:latest
    volumes:
      - mongodb_data:/data/db
    environment:
      - MONGO_INITDB_ROOT_USERNAME=${MONGO_USER}
      - MONGO_INITDB_ROOT_PASSWORD=${MONGO_PASSWORD}
    restart: unless-stopped

volumes:
  mongodb_data:
```

### Option 2: Deploy to Heroku

1. Install Heroku CLI
2. Login: `heroku login`
3. Create app: `heroku create your-app-name`
4. Set environment variables:
```bash
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=your-secret
heroku config:set MONGODB_URI=your-mongodb-uri
heroku config:set EMAIL_USER=your-email
heroku config:set EMAIL_PASSWORD=your-password
```

5. Deploy: `git push heroku main`

### Option 3: Deploy to DigitalOcean/AWS/Azure

1. Create a VPS/droplet
2. Install Node.js and MongoDB
3. Clone repository
4. Install dependencies: `npm install`
5. Configure environment variables
6. Start with process manager (PM2):
```bash
npm install -g pm2
pm2 start server/server.js --name "kasturi-college-api"
pm2 start npm -- --prefix client --script dev --name "kasturi-college-ui"
pm2 save
pm2 startup
```

7. Configure Nginx as reverse proxy
8. Set up SSL with Let's Encrypt

## Post-Deployment Verification

### Backend Verification
```bash
# Check server is running
curl http://localhost:5000/api/health

# Check MongoDB connection
# Should see admin accounts listed in logs

# Verify email service
# Test by submitting a campus visit request
```

### Frontend Verification
- [ ] Website loads without errors
- [ ] All images display correctly
- [ ] Navigation works
- [ ] Forms submit successfully
- [ ] Campus visit form integration working
- [ ] Admin dashboard accessible

### API Endpoint Tests
```bash
# Test public endpoint
curl -X POST http://localhost:5000/api/schedule-visit \
  -H "Content-Type: application/json" \
  -d '{"fullName":"Test","email":"test@test.com","phone":"9841234567","program":"BBA","visitDate":"2026-03-25","timeSlot":"10:00 AM"}'

# Test admin endpoint (requires token)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:5000/api/schedule-visits
```

## Monitoring & Maintenance

### Set Up Logging
- Configure application logging to track errors
- Monitor email delivery failures
- Track API response times

### Backups
- Daily MongoDB backups
- Weekly database exports
- Keep backups for 30 days

### Performance Optimization
- Enable gzip compression
- Set up CDN for static assets
- Cache static files in browser
- Monitor database query performance

### Security Updates
- Regularly update dependencies: `npm audit fix`
- Monitor security advisories
- Keep Node.js up to date
- Review CORS and security headers

## Environment Variables Reference

```env
# Server
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/database

# JWT
JWT_SECRET=your-very-secret-jwt-key

# Email Service
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=app-specific-password
EMAIL_FROM=noreply@kasturicollege.edu.np

# CORS
CORS_ORIGIN=https://yourdomain.com

# Frontend API URL
VITE_API_URL=https://api.yourdomain.com/api
```

## Troubleshooting

### Email Not Sending
1. Check credentials in `.env`
2. Verify SMTP settings
3. Check email service allows app passwords
4. Review console logs for error messages
5. Test with console logging fallback

### Database Connection Issues
1. Verify MongoDB URI is correct
2. Check network connectivity
3. Verify database user permissions
4. Check firewall rules allow connection

### Frontend Not Loading
1. Verify API endpoint URL in frontend config
2. Check CORS headers from backend
3. Verify static files are served
4. Check Nginx/web server configuration

### Performance Issues
1. Monitor database queries
2. Check API response times
3. Enable caching headers
4. Optimize image sizes
5. Consider database indexing

## Support & Contact

For issues or questions:
- Email: admissions@kasturicollege.edu.np
- Check logs: `pm2 logs kasturi-college-api`
- Review MongoDB metrics
- Monitor server resources

## Version Information
- Node.js: v18+
- Express: ^5.2.1
- MongoDB: Latest stable
- React: Latest stable
- Vite: v8.0.0+

## Last Updated
March 19, 2026

## Status
Ready for Production Deployment

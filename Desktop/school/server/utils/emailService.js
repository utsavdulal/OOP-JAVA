const nodemailer = require('nodemailer');

// Create a transporter using Gmail or a default service
// For production, use environment variables for credentials
const transporter = nodemailer.createTransport({
  // Using Gmail service (you can replace with your own email service)
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD, // Use app-specific password for Gmail
  },
});

// Fallback: If no real email service, log to console
const isProduction = process.env.NODE_ENV === 'production';

const sendEmail = async (to, subject, htmlContent) => {
  try {
    // If no email credentials configured, log instead of sending
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
      console.log(`[EMAIL LOG] To: ${to}`);
      console.log(`[EMAIL LOG] Subject: ${subject}`);
      console.log(`[EMAIL LOG] Content:\n${htmlContent}`);
      return { success: true, message: 'Email logged (not sent - no credentials)' };
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER || 'noreply@kasturicollege.edu.np',
      to,
      subject,
      html: htmlContent,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

// Email templates
const emailTemplates = {
  scheduleVisitConfirmation: (visitData) => `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; }
            .content { padding: 20px 0; }
            .details { background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0; }
            .detail-row { margin: 8px 0; display: flex; }
            .detail-label { font-weight: bold; width: 120px; }
            .footer { color: #999; font-size: 12px; margin-top: 20px; border-top: 1px solid #ddd; padding-top: 20px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Campus Visit Request Received! 🎓</h1>
            </div>
            
            <div class="content">
                <p>Dear <strong>${visitData.fullName}</strong>,</p>
                <p>Thank you for scheduling a campus visit at Kasturi College! We're excited to meet you and show you around our facilities.</p>
                
                <div class="details">
                    <h3>Your Visit Details:</h3>
                    <div class="detail-row">
                        <div class="detail-label">Program:</div>
                        <div>${visitData.program}</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">Date:</div>
                        <div>${new Date(visitData.visitDate).toLocaleDateString()}</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">Time:</div>
                        <div>${visitData.timeSlot}</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">Status:</div>
                        <div><strong style="color: #ff9800;">Pending Confirmation</strong></div>
                    </div>
                </div>
                
                <p>Our admissions team will review your request and contact you at <strong>${visitData.phone}</strong> to confirm your visit within 24 hours.</p>
                
                <p>If you have any questions in the meantime, feel free to reach out to us at <strong>admissions@kasturicollege.edu.np</strong></p>
                
                <p>We look forward to meeting you!</p>
                
                <p>
                    Best regards,<br>
                    <strong>Kasturi College Admissions Team</strong>
                </p>
            </div>
            
            <div class="footer">
                <p>This is an automated message. Please do not reply to this email. For inquiries, contact admissions@kasturicollege.edu.np</p>
            </div>
        </div>
    </body>
    </html>
  `,

  visitConfirmed: (visitData, adminMessage = '') => `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; }
            .content { padding: 20px 0; }
            .details { background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0; }
            .detail-row { margin: 8px 0; display: flex; }
            .detail-label { font-weight: bold; width: 120px; }
            .success-badge { background: #4caf50; color: white; padding: 8px 12px; border-radius: 4px; display: inline-block; }
            .footer { color: #999; font-size: 12px; margin-top: 20px; border-top: 1px solid #ddd; padding-top: 20px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Campus Visit Confirmed! ✅</h1>
            </div>
            
            <div class="content">
                <p>Dear <strong>${visitData.fullName}</strong>,</p>
                <p>Great news! Your campus visit request has been confirmed.</p>
                
                <div class="details">
                    <h3>Confirmed Visit Details:</h3>
                    <div class="detail-row">
                        <div class="detail-label">Program:</div>
                        <div>${visitData.program}</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">Date:</div>
                        <div>${new Date(visitData.visitDate).toLocaleDateString()}</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">Time:</div>
                        <div>${visitData.timeSlot}</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">Status:</div>
                        <div><span class="success-badge">Confirmed</span></div>
                    </div>
                </div>
                
                ${adminMessage ? `<p><strong>Additional Information:</strong></p><p>${adminMessage}</p>` : ''}
                
                <p>Please arrive 5-10 minutes before your scheduled time. If you need to reschedule or have any questions, please contact us as soon as possible.</p>
                
                <p>Contact: <strong>admissions@kasturicollege.edu.np</strong> | Phone: <strong>+977-XXX-XXXXXXX</strong></p>
                
                <p>
                    We look forward to welcoming you!<br>
                    <strong>Kasturi College Admissions Team</strong>
                </p>
            </div>
            
            <div class="footer">
                <p>This is an automated message. Please do not reply to this email.</p>
            </div>
        </div>
    </body>
    </html>
  `,

  visitCancelled: (visitData, adminMessage = '') => `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #f44336; color: white; padding: 20px; border-radius: 8px; }
            .content { padding: 20px 0; }
            .details { background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 15px 0; }
            .detail-row { margin: 8px 0; display: flex; }
            .detail-label { font-weight: bold; width: 120px; }
            .footer { color: #999; font-size: 12px; margin-top: 20px; border-top: 1px solid #ddd; padding-top: 20px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Campus Visit Cancelled</h1>
            </div>
            
            <div class="content">
                <p>Dear <strong>${visitData.fullName}</strong>,</p>
                <p>We regret to inform you that your campus visit has been cancelled.</p>
                
                <div class="details">
                    <h3>Visit Details:</h3>
                    <div class="detail-row">
                        <div class="detail-label">Program:</div>
                        <div>${visitData.program}</div>
                    </div>
                    <div class="detail-row">
                        <div class="detail-label">Original Date:</div>
                        <div>${new Date(visitData.visitDate).toLocaleDateString()}</div>
                    </div>
                </div>
                
                ${adminMessage ? `<p><strong>Reason:</strong></p><p>${adminMessage}</p>` : ''}
                
                <p>If you would like to reschedule your visit, please contact our admissions office or submit a new visit request through our website.</p>
                
                <p>Contact: <strong>admissions@kasturicollege.edu.np</strong></p>
                
                <p>
                    Thank you for your interest in Kasturi College.<br>
                    <strong>Kasturi College Admissions Team</strong>
                </p>
            </div>
            
            <div class="footer">
                <p>This is an automated message. Please do not reply to this email.</p>
            </div>
        </div>
    </body>
    </html>
  `,

  visitCompleted: (visitData) => `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body { font-family: Arial, sans-serif; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px; }
            .content { padding: 20px 0; }
            .cta-button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; border-radius: 5px; text-decoration: none; }
            .footer { color: #999; font-size: 12px; margin-top: 20px; border-top: 1px solid #ddd; padding-top: 20px; }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Thank You for Visiting Kasturi College! 🎓</h1>
            </div>
            
            <div class="content">
                <p>Dear <strong>${visitData.fullName}</strong>,</p>
                <p>Thank you for visiting Kasturi College! We hope you had a great experience and learned more about our programs and facilities.</p>
                
                <p>If you have any questions about your chosen program or the admission process, please don't hesitate to reach out to us.</p>
                
                <p style="text-align: center; margin: 30px 0;">
                    <a href="https://kasturicollege.edu.np/admissions" class="cta-button">Apply Now</a>
                </p>
                
                <p>Contact us:</p>
                <ul>
                    <li>Email: <strong>admissions@kasturicollege.edu.np</strong></li>
                    <li>Phone: <strong>+977-XXX-XXXXXXX</strong></li>
                    <li>Address: <strong>Kasturi College, Kathmandu, Nepal</strong></li>
                </ul>
                
                <p>
                    Best regards,<br>
                    <strong>Kasturi College Admissions Team</strong>
                </p>
            </div>
            
            <div class="footer">
                <p>This is an automated message. Please do not reply to this email.</p>
            </div>
        </div>
    </body>
    </html>
  `,
};

module.exports = {
  sendEmail,
  emailTemplates,
};

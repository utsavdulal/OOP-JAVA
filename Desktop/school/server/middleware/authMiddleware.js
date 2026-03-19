const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  try {
    // Get token from Authorization header or cookies
    const token = req.headers.authorization?.split(' ')[1] || req.cookies?.authToken;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'No token provided. Authorization denied.',
      });
    }

    // Require JWT_SECRET to be set
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is not set in environment variables');
      return res.status(500).json({
        success: false,
        message: 'Server configuration error.',
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token.',
      error: error.message,
    });
  }
};

// Alias for backward compatibility
const verifyAdminToken = authMiddleware;

module.exports = authMiddleware;
module.exports.verifyAdminToken = verifyAdminToken;

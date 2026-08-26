const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const User = require('../models/User');
const devMemoryStore = require('../utils/devMemoryStore');

// Middleware to protect routes and verify JWT tokens
const protect = async (req, res, next) => {
  let token;

  // Check if token is present in authorization headers as Bearer token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header (split "Bearer <token>")
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from database (excluding password) and attach to req.user.
      req.user = mongoose.connection.readyState === 1
        ? await User.findById(decoded.id).select('-password')
        : devMemoryStore.findUserById(decoded.id);

      if (!req.user) {
        return res.status(401).json({ success: false, message: 'User not found' });
      }

      next();
    } catch (error) {
      console.error('JWT Verification Error:', error);
      return res.status(401).json({ success: false, message: 'Not authorized, token failed' });
    }
  }

  // Check if no token was found
  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }
};

module.exports = { protect };

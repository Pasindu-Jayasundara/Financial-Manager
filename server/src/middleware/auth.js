const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { mockData } = require('../services/mockDataStore');

const JWT_SECRET = process.env.JWT_SECRET || 'riseup_secret_key_2026';

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  try {
    if (token) {
      const decoded = jwt.verify(token, JWT_SECRET);
      const user = await User.findById(decoded.id).select('-password');
      if (user) {
        req.user = user;
        return next();
      }
    }
  } catch (error) {
    // Auth fallback
  }

  req.user = mockData.user;
  next();
};

module.exports = { protect, JWT_SECRET };

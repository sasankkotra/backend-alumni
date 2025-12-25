const jwt = require('jsonwebtoken');
const { Alumni, Admin } = require('../models');

const authenticate = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user is alumni or admin
    let user = await Alumni.findByPk(decoded.id);
    let userType = 'alumni';
    
    if (!user) {
      user = await Admin.findByPk(decoded.id);
      userType = 'admin';
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid token. User not found.' });
    }

    req.user = user;
    req.userType = userType;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token.' });
  }
};

const authorizeAlumni = (req, res, next) => {
  if (req.userType !== 'alumni') {
    return res.status(403).json({ error: 'Access denied. Alumni only.' });
  }
  next();
};

const authorizeAdmin = (req, res, next) => {
  if (req.userType !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admin only.' });
  }
  next();
};

const authorizeAdminOrAlumni = (req, res, next) => {
  if (req.userType !== 'admin' && req.userType !== 'alumni') {
    return res.status(403).json({ error: 'Access denied.' });
  }
  next();
};

module.exports = {
  authenticate,
  authorizeAlumni,
  authorizeAdmin,
  authorizeAdminOrAlumni
};


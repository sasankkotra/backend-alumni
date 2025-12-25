const jwt = require('jsonwebtoken');
const { Alumni, Admin } = require('../models');

const generateToken = (id, userType) => {
  return jwt.sign({ id, userType }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d'
  });
};

// Alumni Registration
exports.registerAlumni = async (req, res) => {
  try {
    const {
      name,
      gender,
      contact,
      email,
      year_of_graduation,
      branch,
      CGPA,
      placement,
      higher_studies,
      current_field,
      current_company,
      experience_years,
      password
    } = req.body;

    // Check if email already exists
    const existingAlumni = await Alumni.findOne({ where: { email } });
    if (existingAlumni) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const alumni = await Alumni.create({
      name,
      gender,
      contact,
      email,
      year_of_graduation,
      branch,
      CGPA,
      placement,
      higher_studies,
      current_field,
      current_company,
      experience_years,
      password_hash: password,
      verified: false
    });

    const token = generateToken(alumni.alumni_id, 'alumni');

    res.status(201).json({
      message: 'Alumni registered successfully. Awaiting verification.',
      token,
      alumni: {
        alumni_id: alumni.alumni_id,
        name: alumni.name,
        email: alumni.email,
        verified: alumni.verified
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin Registration
exports.registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingAdmin = await Admin.findOne({ where: { email } });
    if (existingAdmin) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const admin = await Admin.create({
      name,
      email,
      password_hash: password
    });

    const token = generateToken(admin.admin_id, 'admin');

    res.status(201).json({
      message: 'Admin registered successfully',
      token,
      admin: {
        admin_id: admin.admin_id,
        name: admin.name,
        email: admin.email
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Alumni Login
exports.loginAlumni = async (req, res) => {
  try {
    const { email, password } = req.body;

    const alumni = await Alumni.findOne({ where: { email } });
    if (!alumni) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isPasswordValid = await alumni.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(alumni.alumni_id, 'alumni');

    res.json({
      message: 'Login successful',
      token,
      alumni: {
        alumni_id: alumni.alumni_id,
        name: alumni.name,
        email: alumni.email,
        verified: alumni.verified
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin Login
exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ where: { email } });
    if (!admin) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isPasswordValid = await admin.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(admin.admin_id, 'admin');

    res.json({
      message: 'Login successful',
      token,
      admin: {
        admin_id: admin.admin_id,
        name: admin.name,
        email: admin.email
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    if (req.userType === 'alumni') {
      const alumni = await Alumni.findByPk(req.user.alumni_id, {
        attributes: { exclude: ['password_hash'] }
      });
      res.json({ user: alumni, userType: 'alumni' });
    } else {
      const admin = await Admin.findByPk(req.user.admin_id, {
        attributes: { exclude: ['password_hash'] }
      });
      res.json({ user: admin, userType: 'admin' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


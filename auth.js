const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticate } = require('../utils/authMiddleware');
const {
  validateAlumniRegistration,
  validateAdminRegistration
} = require('../utils/validators');

// Public routes
router.post('/register/alumni', validateAlumniRegistration, authController.registerAlumni);
router.post('/register/admin', validateAdminRegistration, authController.registerAdmin);
router.post('/login/alumni', authController.loginAlumni);
router.post('/login/admin', authController.loginAdmin);

// Protected route
router.get('/me', authenticate, authController.getCurrentUser);

module.exports = router;


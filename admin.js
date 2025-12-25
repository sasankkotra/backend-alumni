const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate, authorizeAdmin } = require('../utils/authMiddleware');

// All admin routes require admin authentication
router.use(authenticate);
router.use(authorizeAdmin);

// Get all admins
router.get('/', adminController.getAllAdmins);

// Get admin by ID
router.get('/:id', adminController.getAdminById);

// Verify alumni
router.post('/verify-alumni/:id', adminController.verifyAlumni);

// Unverify alumni
router.post('/unverify-alumni/:id', adminController.unverifyAlumni);

// Get unverified alumni
router.get('/alumni/unverified', adminController.getUnverifiedAlumni);

module.exports = router;


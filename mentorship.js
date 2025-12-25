const express = require('express');
const router = express.Router();
const mentorshipController = require('../controllers/mentorshipController');
const { authenticate, authorizeAlumni, authorizeAdmin } = require('../utils/authMiddleware');
const {
  validateMentorshipRequest,
  validateMentorshipUpdate
} = require('../utils/validators');

// All routes require authentication
router.use(authenticate);

// Request mentorship (alumni only)
router.post('/request', authorizeAlumni, validateMentorshipRequest, mentorshipController.requestMentorship);

// Get my mentorships (alumni only)
router.get('/my', authorizeAlumni, mentorshipController.getMyMentorships);

// Update mentorship status (alumni only)
router.put('/:id/status', authorizeAlumni, validateMentorshipUpdate, mentorshipController.updateMentorshipStatus);

// Get all mentorships (admin only)
router.get('/all', authorizeAdmin, mentorshipController.getAllMentorships);

module.exports = router;


const express = require('express');
const router = express.Router();
const alumniController = require('../controllers/alumniController');
const { authenticate, authorizeAlumni, authorizeAdminOrAlumni } = require('../utils/authMiddleware');
const { validateAlumniUpdate } = require('../utils/validators');

// Get all alumni (public or authenticated)
router.get('/', authenticate, alumniController.getAllAlumni);

// Get current user's profile
router.get('/me', authenticate, authorizeAlumni, alumniController.getMyProfile);

// Get alumni by ID
router.get('/:id', authenticate, alumniController.getAlumniById);

// Update alumni (own profile or admin)
router.put('/:id', authenticate, authorizeAdminOrAlumni, validateAlumniUpdate, alumniController.updateAlumni);

// Delete alumni (admin only)
router.delete('/:id', authenticate, authorizeAdminOrAlumni, alumniController.deleteAlumni);

module.exports = router;


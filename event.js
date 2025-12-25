const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { authenticate, authorizeAlumni, authorizeAdminOrAlumni } = require('../utils/authMiddleware');
const { validateEventCreate } = require('../utils/validators');

// Get all events (public or authenticated)
router.get('/', authenticate, eventController.getAllEvents);

// Get event by ID
router.get('/:id', authenticate, eventController.getEventById);

// Create event (authenticated users)
router.post('/', authenticate, authorizeAdminOrAlumni, validateEventCreate, eventController.createEvent);

// Update event (organizer or admin)
router.put('/:id', authenticate, authorizeAdminOrAlumni, eventController.updateEvent);

// Delete event (organizer or admin)
router.delete('/:id', authenticate, authorizeAdminOrAlumni, eventController.deleteEvent);

// Participate in event (alumni only)
router.post('/:id/participate', authenticate, authorizeAlumni, eventController.participateInEvent);

// Remove participation (alumni only)
router.delete('/:id/participate', authenticate, authorizeAlumni, eventController.removeParticipation);

module.exports = router;


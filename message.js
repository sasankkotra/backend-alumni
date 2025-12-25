const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const { authenticate, authorizeAlumni } = require('../utils/authMiddleware');
const { validateMessage } = require('../utils/validators');

// All routes require alumni authentication
router.use(authenticate);
router.use(authorizeAlumni);

// Send message
router.post('/', validateMessage, messageController.sendMessage);

// Get my messages
router.get('/', messageController.getMyMessages);

// Get conversations list
router.get('/conversations', messageController.getConversations);

// Get unread message count
router.get('/unread/count', messageController.getUnreadCount);

// Mark message as read
router.put('/:id/read', messageController.markAsRead);

module.exports = router;


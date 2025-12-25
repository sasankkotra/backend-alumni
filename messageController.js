const { Message, Alumni } = require('../models');
const { Op } = require('sequelize');

// Send message
exports.sendMessage = async (req, res) => {
  try {
    const { receiver_id, content } = req.body;

    if (req.user.alumni_id === receiver_id) {
      return res.status(400).json({ error: 'Cannot send message to yourself' });
    }

    // Check if receiver exists
    const receiver = await Alumni.findByPk(receiver_id);
    if (!receiver) {
      return res.status(404).json({ error: 'Receiver not found' });
    }

    const message = await Message.create({
      sender_id: req.user.alumni_id,
      receiver_id,
      content
    });

    res.status(201).json({
      message: 'Message sent successfully',
      message: await Message.findByPk(message.message_id, {
        include: [
          {
            model: Alumni,
            as: 'sender',
            attributes: { exclude: ['password_hash'] }
          },
          {
            model: Alumni,
            as: 'receiver',
            attributes: { exclude: ['password_hash'] }
          }
        ]
      })
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get my messages (conversations)
exports.getMyMessages = async (req, res) => {
  try {
    const { conversation_with } = req.query;
    const alumniId = req.user.alumni_id;

    const where = {
      [Op.or]: [
        { sender_id: alumniId },
        { receiver_id: alumniId }
      ]
    };

    if (conversation_with) {
      where[Op.and] = [
        {
          [Op.or]: [
            { sender_id: alumniId, receiver_id: conversation_with },
            { sender_id: conversation_with, receiver_id: alumniId }
          ]
        }
      ];
    }

    const messages = await Message.findAll({
      where,
      include: [
        {
          model: Alumni,
          as: 'sender',
          attributes: { exclude: ['password_hash'] }
        },
        {
          model: Alumni,
          as: 'receiver',
          attributes: { exclude: ['password_hash'] }
        }
      ],
      order: [['timestamp', 'ASC']]
    });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get conversation list (unique contacts)
exports.getConversations = async (req, res) => {
  try {
    const alumniId = req.user.alumni_id;

    // Get all unique conversation partners
    const sentMessages = await Message.findAll({
      where: { sender_id: alumniId },
      attributes: ['receiver_id'],
      group: ['receiver_id'],
      include: [
        {
          model: Alumni,
          as: 'receiver',
          attributes: ['alumni_id', 'name', 'email']
        }
      ]
    });

    const receivedMessages = await Message.findAll({
      where: { receiver_id: alumniId },
      attributes: ['sender_id'],
      group: ['sender_id'],
      include: [
        {
          model: Alumni,
          as: 'sender',
          attributes: ['alumni_id', 'name', 'email']
        }
      ]
    });

    // Combine and deduplicate
    const conversations = new Map();

    sentMessages.forEach(msg => {
      if (msg.receiver) {
        conversations.set(msg.receiver.alumni_id, {
          alumni_id: msg.receiver.alumni_id,
          name: msg.receiver.name,
          email: msg.receiver.email
        });
      }
    });

    receivedMessages.forEach(msg => {
      if (msg.sender) {
        conversations.set(msg.sender.alumni_id, {
          alumni_id: msg.sender.alumni_id,
          name: msg.sender.name,
          email: msg.sender.email
        });
      }
    });

    res.json(Array.from(conversations.values()));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mark message as read
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;

    const message = await Message.findByPk(id);
    if (!message) {
      return res.status(404).json({ error: 'Message not found' });
    }

    // Check if user is the receiver
    if (message.receiver_id !== req.user.alumni_id) {
      return res.status(403).json({ error: 'Not authorized to mark this message as read' });
    }

    await message.update({ read_flag: true });

    res.json({
      message: 'Message marked as read',
      message: await Message.findByPk(id, {
        include: [
          {
            model: Alumni,
            as: 'sender',
            attributes: { exclude: ['password_hash'] }
          },
          {
            model: Alumni,
            as: 'receiver',
            attributes: { exclude: ['password_hash'] }
          }
        ]
      })
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get unread message count
exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Message.count({
      where: {
        receiver_id: req.user.alumni_id,
        read_flag: false
      }
    });

    res.json({ unread_count: count });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const { Event, EventParticipation, Alumni, Admin } = require('../models');
const { Op } = require('sequelize');

// Create event
exports.createEvent = async (req, res) => {
  try {
    const { title, description, date, location } = req.body;
    
    const organizerId = req.userType === 'admin' 
      ? req.user.admin_id 
      : req.user.alumni_id;
    const organizerType = req.userType === 'admin' ? 'admin' : 'alumni';

    const event = await Event.create({
      title,
      description,
      date,
      location,
      organizer_id: organizerId,
      organizer_type: organizerType
    });

    res.status(201).json({
      message: 'Event created successfully',
      event
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all events
exports.getAllEvents = async (req, res) => {
  try {
    const { search, date_from, date_to } = req.query;
    const where = {};

    if (search) {
      where[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } },
        { location: { [Op.like]: `%${search}%` } }
      ];
    }

    if (date_from) {
      where.date = { ...where.date, [Op.gte]: date_from };
    }

    if (date_to) {
      where.date = { ...where.date, [Op.lte]: date_to };
    }

    const events = await Event.findAll({
      where,
      order: [['date', 'ASC']]
    });

    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get event by ID
exports.getEventById = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id, {
      include: [
        {
          model: EventParticipation,
          as: 'participations',
          include: [
            {
              model: Alumni,
              as: 'alumni',
              attributes: { exclude: ['password_hash'] }
            }
          ]
        }
      ]
    });

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update event
exports.updateEvent = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Check if user is the organizer or admin
    const isOrganizer = (req.userType === 'admin' && event.organizer_type === 'admin' && 
                        event.organizer_id === req.user.admin_id) ||
                       (req.userType === 'alumni' && event.organizer_type === 'alumni' && 
                        event.organizer_id === req.user.alumni_id);

    if (!isOrganizer && req.userType !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to update this event' });
    }

    await event.update(req.body);

    res.json({
      message: 'Event updated successfully',
      event: await Event.findByPk(req.params.id)
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete event
exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByPk(req.params.id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Check if user is the organizer or admin
    const isOrganizer = (req.userType === 'admin' && event.organizer_type === 'admin' && 
                        event.organizer_id === req.user.admin_id) ||
                       (req.userType === 'alumni' && event.organizer_type === 'alumni' && 
                        event.organizer_id === req.user.alumni_id);

    if (!isOrganizer && req.userType !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to delete this event' });
    }

    await event.destroy();
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Participate in event
exports.participateInEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    const event = await Event.findByPk(id);
    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    // Check if already participating
    const existing = await EventParticipation.findOne({
      where: {
        event_id: id,
        alumni_id: req.user.alumni_id
      }
    });

    if (existing) {
      return res.status(400).json({ error: 'Already participating in this event' });
    }

    const participation = await EventParticipation.create({
      event_id: id,
      alumni_id: req.user.alumni_id,
      role: role || 'attendee'
    });

    res.status(201).json({
      message: 'Participation registered successfully',
      participation
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Remove participation from event
exports.removeParticipation = async (req, res) => {
  try {
    const { id } = req.params;

    const participation = await EventParticipation.findOne({
      where: {
        event_id: id,
        alumni_id: req.user.alumni_id
      }
    });

    if (!participation) {
      return res.status(404).json({ error: 'Participation not found' });
    }

    await participation.destroy();
    res.json({ message: 'Participation removed successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


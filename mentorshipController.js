const { Mentorship, Alumni } = require('../models');

// Request mentorship
exports.requestMentorship = async (req, res) => {
  try {
    const mentorAlumniId = req.user.alumni_id;
    const { mentee_alumni_id } = req.body;

    if (mentorAlumniId === mentee_alumni_id) {
      return res.status(400).json({ error: 'Cannot request mentorship from yourself' });
    }

    // Check if mentee exists
    const mentee = await Alumni.findByPk(mentee_alumni_id);
    if (!mentee) {
      return res.status(404).json({ error: 'Mentee not found' });
    }

    // Check if relationship already exists
    const existing = await Mentorship.findOne({
      where: {
        mentor_alumni_id: mentorAlumniId,
        mentee_alumni_id: mentee_alumni_id
      }
    });

    if (existing) {
      return res.status(400).json({ error: 'Mentorship relationship already exists' });
    }

    const mentorship = await Mentorship.create({
      mentor_alumni_id: mentorAlumniId,
      mentee_alumni_id: mentee_alumni_id,
      status: 'requested'
    });

    res.status(201).json({
      message: 'Mentorship request created',
      mentorship
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all mentorship relationships for current user
exports.getMyMentorships = async (req, res) => {
  try {
    const alumniId = req.user.alumni_id;

    const mentorships = await Mentorship.findAll({
      where: {
        [require('sequelize').Op.or]: [
          { mentor_alumni_id: alumniId },
          { mentee_alumni_id: alumniId }
        ]
      },
      include: [
        {
          model: Alumni,
          as: 'mentor',
          attributes: { exclude: ['password_hash'] }
        },
        {
          model: Alumni,
          as: 'mentee',
          attributes: { exclude: ['password_hash'] }
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(mentorships);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update mentorship status
exports.updateMentorshipStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const mentorship = await Mentorship.findByPk(id);
    if (!mentorship) {
      return res.status(404).json({ error: 'Mentorship not found' });
    }

    // Check if user is part of this mentorship
    if (mentorship.mentor_alumni_id !== req.user.alumni_id && 
        mentorship.mentee_alumni_id !== req.user.alumni_id) {
      return res.status(403).json({ error: 'Not authorized to update this mentorship' });
    }

    await mentorship.update({ status });

    res.json({
      message: 'Mentorship status updated',
      mentorship: await Mentorship.findByPk(id, {
        include: [
          {
            model: Alumni,
            as: 'mentor',
            attributes: { exclude: ['password_hash'] }
          },
          {
            model: Alumni,
            as: 'mentee',
            attributes: { exclude: ['password_hash'] }
          }
        ]
      })
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all mentorships (admin only)
exports.getAllMentorships = async (req, res) => {
  try {
    const mentorships = await Mentorship.findAll({
      include: [
        {
          model: Alumni,
          as: 'mentor',
          attributes: { exclude: ['password_hash'] }
        },
        {
          model: Alumni,
          as: 'mentee',
          attributes: { exclude: ['password_hash'] }
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.json(mentorships);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


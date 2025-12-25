const { Alumni } = require('../models');
const { Op } = require('sequelize');

// Get all alumni
exports.getAllAlumni = async (req, res) => {
  try {
    const { search, branch, year, verified } = req.query;
    const where = {};

    if (search) {
      where[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { current_company: { [Op.like]: `%${search}%` } }
      ];
    }

    if (branch) {
      where.branch = branch;
    }

    if (year) {
      where.year_of_graduation = year;
    }

    if (verified !== undefined) {
      where.verified = verified === 'true';
    }

    const alumni = await Alumni.findAll({
      where,
      attributes: { exclude: ['password_hash'] },
      order: [['name', 'ASC']]
    });

    res.json(alumni);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single alumni by ID
exports.getAlumniById = async (req, res) => {
  try {
    const alumni = await Alumni.findByPk(req.params.id, {
      attributes: { exclude: ['password_hash'] }
    });

    if (!alumni) {
      return res.status(404).json({ error: 'Alumni not found' });
    }

    res.json(alumni);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update alumni profile
exports.updateAlumni = async (req, res) => {
  try {
    const alumniId = req.params.id;
    
    // Check if user is updating their own profile or is admin
    if (req.userType === 'alumni' && req.user.alumni_id !== parseInt(alumniId)) {
      return res.status(403).json({ error: 'You can only update your own profile' });
    }

    const alumni = await Alumni.findByPk(alumniId);
    if (!alumni) {
      return res.status(404).json({ error: 'Alumni not found' });
    }

    const updateData = { ...req.body };
    delete updateData.password_hash; // Prevent direct password hash updates
    delete updateData.verified; // Only admin can update verification
    delete updateData.verified_by_admin_id;

    await alumni.update(updateData);

    const updatedAlumni = await Alumni.findByPk(alumniId, {
      attributes: { exclude: ['password_hash'] }
    });

    res.json({
      message: 'Alumni updated successfully',
      alumni: updatedAlumni
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete alumni
exports.deleteAlumni = async (req, res) => {
  try {
    const alumni = await Alumni.findByPk(req.params.id);
    if (!alumni) {
      return res.status(404).json({ error: 'Alumni not found' });
    }

    await alumni.destroy();
    res.json({ message: 'Alumni deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get current alumni profile
exports.getMyProfile = async (req, res) => {
  try {
    const alumni = await Alumni.findByPk(req.user.alumni_id, {
      attributes: { exclude: ['password_hash'] }
    });

    if (!alumni) {
      return res.status(404).json({ error: 'Alumni not found' });
    }

    res.json(alumni);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


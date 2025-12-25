const { Alumni, Admin } = require('../models');

// Get all admins
exports.getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.findAll({
      attributes: { exclude: ['password_hash'] }
    });
    res.json(admins);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get admin by ID
exports.getAdminById = async (req, res) => {
  try {
    const admin = await Admin.findByPk(req.params.id, {
      attributes: { exclude: ['password_hash'] }
    });

    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    res.json(admin);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Verify alumni
exports.verifyAlumni = async (req, res) => {
  try {
    const { id } = req.params;
    const alumni = await Alumni.findByPk(id);

    if (!alumni) {
      return res.status(404).json({ error: 'Alumni not found' });
    }

    await alumni.update({
      verified: true,
      verified_by_admin_id: req.user.admin_id
    });

    res.json({
      message: 'Alumni verified successfully',
      alumni: await Alumni.findByPk(id, {
        attributes: { exclude: ['password_hash'] }
      })
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Unverify alumni
exports.unverifyAlumni = async (req, res) => {
  try {
    const { id } = req.params;
    const alumni = await Alumni.findByPk(id);

    if (!alumni) {
      return res.status(404).json({ error: 'Alumni not found' });
    }

    await alumni.update({
      verified: false,
      verified_by_admin_id: null
    });

    res.json({
      message: 'Alumni unverified successfully',
      alumni: await Alumni.findByPk(id, {
        attributes: { exclude: ['password_hash'] }
      })
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get unverified alumni
exports.getUnverifiedAlumni = async (req, res) => {
  try {
    const alumni = await Alumni.findAll({
      where: { verified: false },
      attributes: { exclude: ['password_hash'] },
      order: [['createdAt', 'DESC']]
    });

    res.json(alumni);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


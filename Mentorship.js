const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Mentorship = sequelize.define('Mentorship', {
  mentorship_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  mentor_alumni_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'alumni',
      key: 'alumni_id'
    }
  },
  mentee_alumni_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'alumni',
      key: 'alumni_id'
    }
  },
  status: {
    type: DataTypes.ENUM('requested', 'active', 'completed', 'cancelled'),
    defaultValue: 'requested'
  }
}, {
  tableName: 'mentorship',
  timestamps: true
});

module.exports = Mentorship;


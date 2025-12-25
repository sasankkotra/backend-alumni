const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const EventParticipation = sequelize.define('EventParticipation', {
  participation_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  event_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'event',
      key: 'event_id'
    }
  },
  alumni_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'alumni',
      key: 'alumni_id'
    }
  },
  role: {
    type: DataTypes.ENUM('speaker', 'attendee'),
    defaultValue: 'attendee'
  }
}, {
  tableName: 'event_participation',
  timestamps: true
});

module.exports = EventParticipation;


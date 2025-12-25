const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Event = sequelize.define('Event', {
  event_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false
  },
  location: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  organizer_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  organizer_type: {
    type: DataTypes.ENUM('admin', 'alumni'),
    allowNull: false
  }
}, {
  tableName: 'event',
  timestamps: true
});

module.exports = Event;


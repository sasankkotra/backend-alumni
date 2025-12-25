const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const JobPosting = sequelize.define('JobPosting', {
  job_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  posted_by_alumni_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'alumni',
      key: 'alumni_id'
    }
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  company: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  location: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  post_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  eligibility: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('active', 'closed', 'filled'),
    defaultValue: 'active'
  }
}, {
  tableName: 'job_posting',
  timestamps: true
});

module.exports = JobPosting;


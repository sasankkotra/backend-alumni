const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const JobApplication = sequelize.define('JobApplication', {
  application_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  job_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'job_posting',
      key: 'job_id'
    }
  },
  applicant_alumni_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'alumni',
      key: 'alumni_id'
    }
  },
  apply_date: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  status: {
    type: DataTypes.ENUM('pending', 'reviewed', 'accepted', 'rejected'),
    defaultValue: 'pending'
  }
}, {
  tableName: 'job_application',
  timestamps: true
});

module.exports = JobApplication;


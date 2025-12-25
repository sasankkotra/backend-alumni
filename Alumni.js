const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const bcrypt = require('bcryptjs');

const Alumni = sequelize.define('Alumni', {
  alumni_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  gender: {
    type: DataTypes.ENUM('Male', 'Female', 'Other'),
    allowNull: false
  },
  contact: {
    type: DataTypes.STRING(20),
    allowNull: false
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  year_of_graduation: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  branch: {
    type: DataTypes.STRING(50),
    allowNull: false
  },
  CGPA: {
    type: DataTypes.DECIMAL(3, 2),
    allowNull: true
  },
  placement: {
    type: DataTypes.ENUM('on_campus', 'off_campus'),
    allowNull: true
  },
  higher_studies: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  current_field: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  current_company: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  experience_years: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  verified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  verified_by_admin_id: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'alumni',
  timestamps: true,
  hooks: {
    beforeCreate: async (alumni) => {
      if (alumni.password_hash && !alumni.password_hash.startsWith('$2')) {
        alumni.password_hash = await bcrypt.hash(alumni.password_hash, 10);
      }
    },
    beforeUpdate: async (alumni) => {
      if (alumni.changed('password_hash') && !alumni.password_hash.startsWith('$2')) {
        alumni.password_hash = await bcrypt.hash(alumni.password_hash, 10);
      }
    }
  }
});

Alumni.prototype.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password_hash);
};

module.exports = Alumni;


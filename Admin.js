const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const bcrypt = require('bcryptjs');

const Admin = sequelize.define('Admin', {
  admin_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
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
  password_hash: {
    type: DataTypes.STRING(255),
    allowNull: false
  }
}, {
  tableName: 'admin',
  timestamps: true,
  hooks: {
    beforeCreate: async (admin) => {
      if (admin.password_hash && !admin.password_hash.startsWith('$2')) {
        admin.password_hash = await bcrypt.hash(admin.password_hash, 10);
      }
    },
    beforeUpdate: async (admin) => {
      if (admin.changed('password_hash') && !admin.password_hash.startsWith('$2')) {
        admin.password_hash = await bcrypt.hash(admin.password_hash, 10);
      }
    }
  }
});

Admin.prototype.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password_hash);
};

module.exports = Admin;


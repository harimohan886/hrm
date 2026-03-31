const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  type: { type: DataTypes.ENUM('Admin', 'Employee', 'Company'), defaultValue: 'Employee' },
  avatar: { type: DataTypes.STRING, defaultValue: null },
  is_active: { type: DataTypes.BOOLEAN, defaultValue: true },
  created_by: { type: DataTypes.INTEGER, defaultValue: null },
}, { tableName: 'users', timestamps: true, underscored: true });

module.exports = User;

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Department = sequelize.define('Department', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  created_by: { type: DataTypes.INTEGER },
}, { tableName: 'departments', timestamps: true, underscored: true });

module.exports = Department;

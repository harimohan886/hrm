const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Designation = sequelize.define('Designation', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  created_by: { type: DataTypes.INTEGER },
}, { tableName: 'designations', timestamps: true, underscored: true });

module.exports = Designation;

const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Holiday = sequelize.define('Holiday', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false },
  date: { type: DataTypes.DATEONLY, allowNull: false },
  color: { type: DataTypes.STRING, defaultValue: '#e11d48' },
  created_by: { type: DataTypes.INTEGER },
}, { tableName: 'holidays', timestamps: true, underscored: true });

module.exports = Holiday;

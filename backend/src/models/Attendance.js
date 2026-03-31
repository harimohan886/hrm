const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Attendance = sequelize.define('Attendance', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  employee_id: { type: DataTypes.INTEGER, allowNull: false },
  date: { type: DataTypes.DATEONLY, allowNull: false },
  status: { type: DataTypes.ENUM('Present', 'Absent', 'Late', 'Half Day', 'Holiday', 'Leave'), defaultValue: 'Present' },
  clock_in: { type: DataTypes.TIME },
  clock_out: { type: DataTypes.TIME },
  late: { type: DataTypes.INTEGER, defaultValue: 0, comment: 'minutes late' },
  early_leaving: { type: DataTypes.INTEGER, defaultValue: 0, comment: 'minutes early' },
  overtime: { type: DataTypes.INTEGER, defaultValue: 0, comment: 'overtime minutes' },
  created_by: { type: DataTypes.INTEGER },
}, { tableName: 'attendance_employees', timestamps: true, underscored: true });

module.exports = Attendance;

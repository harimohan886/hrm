const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Leave = sequelize.define('Leave', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  employee_id: { type: DataTypes.INTEGER, allowNull: false },
  leave_type_id: { type: DataTypes.INTEGER, allowNull: false },
  applied_on: { type: DataTypes.DATEONLY },
  start_date: { type: DataTypes.DATEONLY, allowNull: false },
  end_date: { type: DataTypes.DATEONLY, allowNull: false },
  total_leave_days: { type: DataTypes.INTEGER },
  leave_reason: { type: DataTypes.TEXT },
  status: { type: DataTypes.ENUM('Pending', 'Approved', 'Rejected'), defaultValue: 'Pending' },
  remark: { type: DataTypes.TEXT },
  created_by: { type: DataTypes.INTEGER },
}, { tableName: 'leaves', timestamps: true, underscored: true });

module.exports = Leave;

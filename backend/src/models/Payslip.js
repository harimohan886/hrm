const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Payslip = sequelize.define('Payslip', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  employee_id: { type: DataTypes.INTEGER, allowNull: false },
  payslip_type: { type: DataTypes.INTEGER },
  salary: { type: DataTypes.DECIMAL(10, 2) },
  net_payble: { type: DataTypes.DECIMAL(10, 2) },
  status: { type: DataTypes.ENUM('Generated', 'Sent', 'Paid'), defaultValue: 'Generated' },
  month: { type: DataTypes.INTEGER },
  year: { type: DataTypes.INTEGER },
  created_by: { type: DataTypes.INTEGER },
}, { tableName: 'payslips', timestamps: true, underscored: true });

module.exports = Payslip;

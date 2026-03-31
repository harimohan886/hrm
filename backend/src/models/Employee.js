const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Employee = sequelize.define('Employee', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  employee_id: { type: DataTypes.STRING },
  branch_id: { type: DataTypes.INTEGER },
  department_id: { type: DataTypes.INTEGER },
  designation_id: { type: DataTypes.INTEGER },
  company_doj: { type: DataTypes.DATEONLY },
  phone: { type: DataTypes.STRING },
  address: { type: DataTypes.TEXT },
  salary_type: { type: DataTypes.ENUM('Monthly', 'Weekly', 'Hourly'), defaultValue: 'Monthly' },
  salary: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
  gender: { type: DataTypes.ENUM('Male', 'Female', 'Other') },
  created_by: { type: DataTypes.INTEGER },
}, { tableName: 'employees', timestamps: true, underscored: true });

module.exports = Employee;

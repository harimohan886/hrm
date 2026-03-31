const User = require('./User');
const Employee = require('./Employee');
const Department = require('./Department');
const Designation = require('./Designation');
const Branch = require('./Branch');
const Attendance = require('./Attendance');
const LeaveType = require('./LeaveType');
const Leave = require('./Leave');
const Holiday = require('./Holiday');
const Payslip = require('./Payslip');
const Announcement = require('./Announcement');

// Associations
Employee.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
Employee.belongsTo(Department, { foreignKey: 'department_id', as: 'department' });
Employee.belongsTo(Designation, { foreignKey: 'designation_id', as: 'designation' });
Employee.belongsTo(Branch, { foreignKey: 'branch_id', as: 'branch' });

Attendance.belongsTo(Employee, { foreignKey: 'employee_id', as: 'employee' });
Leave.belongsTo(Employee, { foreignKey: 'employee_id', as: 'employee' });
Leave.belongsTo(LeaveType, { foreignKey: 'leave_type_id', as: 'leaveType' });
Payslip.belongsTo(Employee, { foreignKey: 'employee_id', as: 'employee' });

module.exports = {
  User,
  Employee,
  Department,
  Designation,
  Branch,
  Attendance,
  LeaveType,
  Leave,
  Holiday,
  Payslip,
  Announcement,
};

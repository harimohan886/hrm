const { Employee, Attendance, Leave, User } = require('../models');
const { Op } = require('sequelize');

const summary = async (req, res, next) => {
  try {
    const created_by = req.user.id;
    const today = new Date().toISOString().split('T')[0];
    const thisMonth = new Date().getMonth() + 1;
    const thisYear = new Date().getFullYear();

    const [totalEmployees, todayPresent, pendingLeaves, activeUsers] = await Promise.all([
      Employee.count({ where: { created_by } }),
      Attendance.count({
        where: { date: today, status: 'Present' },
        include: [{ model: Employee, as: 'employee', where: { created_by }, required: true }],
      }),
      Leave.count({
        where: { status: 'Pending' },
        include: [{ model: Employee, as: 'employee', where: { created_by }, required: true }],
      }),
      User.count({ where: { is_active: true, created_by } }),
    ]);

    res.json({
      totalEmployees,
      todayPresent,
      pendingLeaves,
      activeUsers,
      month: thisMonth,
      year: thisYear,
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { summary };

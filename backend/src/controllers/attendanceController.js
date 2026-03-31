const { Attendance, Employee, User } = require('../models');
const { Op } = require('sequelize');

const index = async (req, res, next) => {
  try {
    const { date, month, year, employee_id } = req.query;
    const where = {};

    if (date) where.date = date;
    if (month && year) {
      where.date = {
        [Op.between]: [
          `${year}-${String(month).padStart(2, '0')}-01`,
          `${year}-${String(month).padStart(2, '0')}-31`,
        ],
      };
    }
    if (employee_id) where.employee_id = employee_id;

    const records = await Attendance.findAll({
      where,
      include: [
        {
          model: Employee,
          as: 'employee',
          where: { created_by: req.user.id },
          include: [{ model: User, as: 'user', attributes: ['id', 'name', 'email'] }],
        },
      ],
      order: [['date', 'DESC']],
    });

    res.json(records);
  } catch (err) { next(err); }
};

const store = async (req, res, next) => {
  try {
    const { employee_id, date, status, clock_in, clock_out } = req.body;
    if (!employee_id || !date || !status) {
      return res.status(400).json({ message: 'employee_id, date and status are required' });
    }
    const record = await Attendance.create({ employee_id, date, status, clock_in, clock_out, created_by: req.user.id });
    res.status(201).json(record);
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    const record = await Attendance.findByPk(req.params.id);
    if (!record) return res.status(404).json({ message: 'Record not found' });
    await record.update(req.body);
    res.json(record);
  } catch (err) { next(err); }
};

const destroy = async (req, res, next) => {
  try {
    const record = await Attendance.findByPk(req.params.id);
    if (!record) return res.status(404).json({ message: 'Record not found' });
    await record.destroy();
    res.json({ message: 'Deleted successfully' });
  } catch (err) { next(err); }
};

module.exports = { index, store, update, destroy };

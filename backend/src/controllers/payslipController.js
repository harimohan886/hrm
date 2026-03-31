const { Payslip, Employee, User } = require('../models');

const index = async (req, res, next) => {
  try {
    const { month, year, employee_id } = req.query;
    const where = {};
    if (month) where.month = month;
    if (year) where.year = year;
    if (employee_id) where.employee_id = employee_id;

    const records = await Payslip.findAll({
      where,
      include: [
        {
          model: Employee,
          as: 'employee',
          where: { created_by: req.user.id },
          include: [{ model: User, as: 'user', attributes: ['id', 'name'] }],
        },
      ],
      order: [['year', 'DESC'], ['month', 'DESC']],
    });
    res.json(records);
  } catch (err) { next(err); }
};

const store = async (req, res, next) => {
  try {
    const { employee_id, salary, net_payble, month, year, payslip_type } = req.body;
    if (!employee_id || !month || !year) {
      return res.status(400).json({ message: 'employee_id, month and year are required' });
    }
    const record = await Payslip.create({ employee_id, salary, net_payble, month, year, payslip_type, created_by: req.user.id });
    res.status(201).json(record);
  } catch (err) { next(err); }
};

const updateStatus = async (req, res, next) => {
  try {
    const record = await Payslip.findByPk(req.params.id);
    if (!record) return res.status(404).json({ message: 'Not found' });
    await record.update({ status: req.body.status });
    res.json(record);
  } catch (err) { next(err); }
};

const destroy = async (req, res, next) => {
  try {
    const record = await Payslip.findByPk(req.params.id);
    if (!record) return res.status(404).json({ message: 'Not found' });
    await record.destroy();
    res.json({ message: 'Deleted successfully' });
  } catch (err) { next(err); }
};

module.exports = { index, store, updateStatus, destroy };

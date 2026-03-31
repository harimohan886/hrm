const { Leave, LeaveType, Employee, User } = require('../models');

const getTypes = async (req, res, next) => {
  try {
    const types = await LeaveType.findAll({ where: { created_by: req.user.id } });
    res.json(types);
  } catch (err) { next(err); }
};

const createType = async (req, res, next) => {
  try {
    const { name, days } = req.body;
    if (!name) return res.status(400).json({ message: 'Name is required' });
    const type = await LeaveType.create({ name, days, created_by: req.user.id });
    res.status(201).json(type);
  } catch (err) { next(err); }
};

const index = async (req, res, next) => {
  try {
    const { status, employee_id } = req.query;
    const where = {};
    if (status) where.status = status;
    if (employee_id) where.employee_id = employee_id;

    const records = await Leave.findAll({
      where,
      include: [
        {
          model: Employee,
          as: 'employee',
          where: { created_by: req.user.id },
          include: [{ model: User, as: 'user', attributes: ['id', 'name'] }],
        },
        { model: LeaveType, as: 'leaveType' },
      ],
      order: [['created_at', 'DESC']],
    });
    res.json(records);
  } catch (err) { next(err); }
};

const store = async (req, res, next) => {
  try {
    const { employee_id, leave_type_id, start_date, end_date, leave_reason } = req.body;
    if (!employee_id || !leave_type_id || !start_date || !end_date) {
      return res.status(400).json({ message: 'Required fields missing' });
    }
    const startMs = new Date(start_date).getTime();
    const endMs = new Date(end_date).getTime();
    const total_leave_days = Math.round((endMs - startMs) / (1000 * 60 * 60 * 24)) + 1;
    const record = await Leave.create({
      employee_id, leave_type_id, start_date, end_date, leave_reason,
      total_leave_days, applied_on: new Date(), created_by: req.user.id,
    });
    res.status(201).json(record);
  } catch (err) { next(err); }
};

const approve = async (req, res, next) => {
  try {
    const record = await Leave.findByPk(req.params.id);
    if (!record) return res.status(404).json({ message: 'Not found' });
    await record.update({ status: 'Approved', remark: req.body.remark });
    res.json({ message: 'Leave approved' });
  } catch (err) { next(err); }
};

const reject = async (req, res, next) => {
  try {
    const record = await Leave.findByPk(req.params.id);
    if (!record) return res.status(404).json({ message: 'Not found' });
    await record.update({ status: 'Rejected', remark: req.body.remark });
    res.json({ message: 'Leave rejected' });
  } catch (err) { next(err); }
};

const destroy = async (req, res, next) => {
  try {
    const record = await Leave.findByPk(req.params.id);
    if (!record) return res.status(404).json({ message: 'Not found' });
    await record.destroy();
    res.json({ message: 'Deleted successfully' });
  } catch (err) { next(err); }
};

module.exports = { getTypes, createType, index, store, approve, reject, destroy };

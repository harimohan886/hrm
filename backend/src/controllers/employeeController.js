const { Employee, User, Department, Designation, Branch } = require('../models');
const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

const index = async (req, res, next) => {
  try {
    const { search, department_id, designation_id, branch_id, page = 1, limit = 20 } = req.query;
    const where = { created_by: req.user.id };
    const userWhere = {};

    if (search) {
      userWhere[Op.or] = [
        { name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
      ];
    }
    if (department_id) where.department_id = department_id;
    if (designation_id) where.designation_id = designation_id;
    if (branch_id) where.branch_id = branch_id;

    const offset = (parseInt(page) - 1) * parseInt(limit);
    const { count, rows } = await Employee.findAndCountAll({
      where,
      include: [
        { model: User, as: 'user', where: userWhere, attributes: ['id', 'name', 'email', 'avatar'] },
        { model: Department, as: 'department', required: false },
        { model: Designation, as: 'designation', required: false },
        { model: Branch, as: 'branch', required: false },
      ],
      limit: parseInt(limit),
      offset,
      order: [['created_at', 'DESC']],
    });

    res.json({ data: rows, total: count, page: parseInt(page), limit: parseInt(limit) });
  } catch (err) {
    next(err);
  }
};

const show = async (req, res, next) => {
  try {
    const employee = await Employee.findOne({
      where: { id: req.params.id, created_by: req.user.id },
      include: [
        { model: User, as: 'user', attributes: { exclude: ['password'] } },
        { model: Department, as: 'department', required: false },
        { model: Designation, as: 'designation', required: false },
        { model: Branch, as: 'branch', required: false },
      ],
    });
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.json(employee);
  } catch (err) {
    next(err);
  }
};

const store = async (req, res, next) => {
  try {
    const {
      name, email, password, department_id, designation_id, branch_id,
      employee_id, phone, address, salary, salary_type, gender, company_doj,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    const exists = await User.findOne({ where: { email } });
    if (exists) return res.status(409).json({ message: 'Email already exists' });

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name, email, password: hash, type: 'Employee', created_by: req.user.id,
    });

    const employee = await Employee.create({
      user_id: user.id, department_id, designation_id, branch_id,
      employee_id, phone, address, salary, salary_type, gender, company_doj,
      created_by: req.user.id,
    });

    res.status(201).json({ ...employee.toJSON(), user: { id: user.id, name, email } });
  } catch (err) {
    next(err);
  }
};

const update = async (req, res, next) => {
  try {
    const employee = await Employee.findOne({ where: { id: req.params.id, created_by: req.user.id } });
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    const {
      name, email, department_id, designation_id, branch_id,
      employee_id, phone, address, salary, salary_type, gender, company_doj,
    } = req.body;

    await employee.update({ department_id, designation_id, branch_id, employee_id, phone, address, salary, salary_type, gender, company_doj });
    if (name || email) {
      await User.update({ name, email }, { where: { id: employee.user_id } });
    }
    res.json({ message: 'Employee updated successfully' });
  } catch (err) {
    next(err);
  }
};

const destroy = async (req, res, next) => {
  try {
    const employee = await Employee.findOne({ where: { id: req.params.id, created_by: req.user.id } });
    if (!employee) return res.status(404).json({ message: 'Employee not found' });

    await User.destroy({ where: { id: employee.user_id } });
    await employee.destroy();
    res.json({ message: 'Employee deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { index, show, store, update, destroy };

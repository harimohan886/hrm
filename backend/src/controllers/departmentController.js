const { Department } = require('../models');

const index = async (req, res, next) => {
  try {
    const items = await Department.findAll({ where: { created_by: req.user.id }, order: [['name', 'ASC']] });
    res.json(items);
  } catch (err) { next(err); }
};

const store = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: 'Name is required' });
    const item = await Department.create({ name, created_by: req.user.id });
    res.status(201).json(item);
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    const item = await Department.findOne({ where: { id: req.params.id, created_by: req.user.id } });
    if (!item) return res.status(404).json({ message: 'Not found' });
    await item.update({ name: req.body.name });
    res.json(item);
  } catch (err) { next(err); }
};

const destroy = async (req, res, next) => {
  try {
    const item = await Department.findOne({ where: { id: req.params.id, created_by: req.user.id } });
    if (!item) return res.status(404).json({ message: 'Not found' });
    await item.destroy();
    res.json({ message: 'Deleted successfully' });
  } catch (err) { next(err); }
};

module.exports = { index, store, update, destroy };

const { Holiday } = require('../models');

const index = async (req, res, next) => {
  try {
    const items = await Holiday.findAll({ where: { created_by: req.user.id }, order: [['date', 'ASC']] });
    res.json(items);
  } catch (err) { next(err); }
};

const store = async (req, res, next) => {
  try {
    const { title, date, color } = req.body;
    if (!title || !date) return res.status(400).json({ message: 'Title and date are required' });
    const item = await Holiday.create({ title, date, color, created_by: req.user.id });
    res.status(201).json(item);
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    const item = await Holiday.findOne({ where: { id: req.params.id, created_by: req.user.id } });
    if (!item) return res.status(404).json({ message: 'Not found' });
    await item.update(req.body);
    res.json(item);
  } catch (err) { next(err); }
};

const destroy = async (req, res, next) => {
  try {
    const item = await Holiday.findOne({ where: { id: req.params.id, created_by: req.user.id } });
    if (!item) return res.status(404).json({ message: 'Not found' });
    await item.destroy();
    res.json({ message: 'Deleted successfully' });
  } catch (err) { next(err); }
};

module.exports = { index, store, update, destroy };

const { Announcement } = require('../models');

const index = async (req, res, next) => {
  try {
    const items = await Announcement.findAll({ where: { created_by: req.user.id }, order: [['created_at', 'DESC']] });
    res.json(items);
  } catch (err) { next(err); }
};

const store = async (req, res, next) => {
  try {
    const { title, description, start_date, end_date } = req.body;
    if (!title) return res.status(400).json({ message: 'Title is required' });
    const item = await Announcement.create({ title, description, start_date, end_date, created_by: req.user.id });
    res.status(201).json(item);
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    const item = await Announcement.findOne({ where: { id: req.params.id, created_by: req.user.id } });
    if (!item) return res.status(404).json({ message: 'Not found' });
    await item.update(req.body);
    res.json(item);
  } catch (err) { next(err); }
};

const destroy = async (req, res, next) => {
  try {
    const item = await Announcement.findOne({ where: { id: req.params.id, created_by: req.user.id } });
    if (!item) return res.status(404).json({ message: 'Not found' });
    await item.destroy();
    res.json({ message: 'Deleted successfully' });
  } catch (err) { next(err); }
};

module.exports = { index, store, update, destroy };

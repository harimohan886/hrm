const router = require('express').Router();
const ctrl = require('../controllers/payslipController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);
router.get('/', ctrl.index);
router.post('/', ctrl.store);
router.put('/:id/status', ctrl.updateStatus);
router.delete('/:id', ctrl.destroy);

module.exports = router;

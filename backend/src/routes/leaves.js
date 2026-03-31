const router = require('express').Router();
const ctrl = require('../controllers/leaveController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);
router.get('/types', ctrl.getTypes);
router.post('/types', ctrl.createType);
router.get('/', ctrl.index);
router.post('/', ctrl.store);
router.put('/:id/approve', ctrl.approve);
router.put('/:id/reject', ctrl.reject);
router.delete('/:id', ctrl.destroy);

module.exports = router;

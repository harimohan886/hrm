const router = require('express').Router();
const { summary } = require('../controllers/dashboardController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate);
router.get('/summary', summary);

module.exports = router;

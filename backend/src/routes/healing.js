const router = require('express').Router();
const { auth } = require('../middleware/auth');
const ctrl = require('../controllers/healingController');

router.get('/', ctrl.getAll);
router.get('/type/:type', ctrl.getByType);
router.get('/recommended', auth, ctrl.getRecommended);
router.get('/:id', ctrl.getOne);

module.exports = router;

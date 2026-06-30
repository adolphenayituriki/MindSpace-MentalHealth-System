const router = require('express').Router();
const ctrl = require('../controllers/crisisController');

router.get('/resources', ctrl.getResources);
router.get('/hotlines', ctrl.getHotlines);
router.get('/centers', ctrl.getNearbyCenters);

module.exports = router;

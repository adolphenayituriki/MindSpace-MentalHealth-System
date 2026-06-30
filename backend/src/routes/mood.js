const router = require('express').Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { auth } = require('../middleware/auth');
const ctrl = require('../controllers/moodController');

router.use(auth);

router.post(
  '/',
  [
    body('value').isInt({ min: 1, max: 5 }),
    body('emoji').notEmpty(),
    validate,
  ],
  ctrl.logMood
);

router.get('/', ctrl.getMoods);
router.get('/today', ctrl.getTodayMood);
router.get('/insights', ctrl.getMoodInsights);

module.exports = router;

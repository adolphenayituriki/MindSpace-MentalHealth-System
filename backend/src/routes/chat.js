const router = require('express').Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { auth } = require('../middleware/auth');
const ctrl = require('../controllers/chatController');

router.use(auth);

router.post(
  '/',
  [body('content').notEmpty().trim(), validate],
  ctrl.sendMessage
);

router.get('/history', ctrl.getHistory);
router.delete('/history', ctrl.clearHistory);

module.exports = router;

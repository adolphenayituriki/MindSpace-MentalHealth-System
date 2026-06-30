const router = require('express').Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { auth } = require('../middleware/auth');
const ctrl = require('../controllers/journalController');

router.use(auth);

router.get('/prompts', ctrl.getPrompts);

router.post(
  '/',
  [body('content').notEmpty().trim(), validate],
  ctrl.createEntry
);

router.get('/', ctrl.getEntries);
router.get('/:id', ctrl.getEntry);
router.patch('/:id', ctrl.updateEntry);
router.delete('/:id', ctrl.deleteEntry);

module.exports = router;

const router = require('express').Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { auth } = require('../middleware/auth');
const ctrl = require('../controllers/counselingController');

router.use(auth);

router.get('/counselors', ctrl.getCounselors);

router.post(
  '/sessions',
  [body('topic').optional().trim(), validate],
  ctrl.requestSession
);

router.get('/sessions/active', ctrl.getActiveSession);
router.get('/sessions/:id', ctrl.getSession);
router.get('/sessions/:id/messages', ctrl.getSessionMessages);

router.post(
  '/sessions/:id/messages',
  [body('content').notEmpty().trim(), validate],
  ctrl.sendSessionMessage
);

router.post('/sessions/:id/close', ctrl.closeSession);

module.exports = router;

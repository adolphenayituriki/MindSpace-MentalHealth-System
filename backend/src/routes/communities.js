const router = require('express').Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { auth } = require('../middleware/auth');
const ctrl = require('../controllers/communityController');

router.use(auth);

router.get('/', ctrl.getCommunities);
router.get('/mine', ctrl.getUserCommunities);
router.get('/:id', ctrl.getCommunity);
router.post('/:id/join', ctrl.joinCommunity);
router.post('/:id/leave', ctrl.leaveCommunity);

router.get('/:id/messages', ctrl.getMessages);
router.post(
  '/:id/messages',
  [body('content').notEmpty().trim(), validate],
  ctrl.postMessage
);

module.exports = router;

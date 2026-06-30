const router = require('express').Router();
const { body } = require('express-validator');
const validate = require('../middleware/validate');
const { auth } = require('../middleware/auth');
const ctrl = require('../controllers/authController');

router.post('/anonymous', ctrl.anonymousLogin);

router.post(
  '/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('displayName').notEmpty().trim(),
    validate,
  ],
  ctrl.emailRegister
);

router.post(
  '/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty(),
    validate,
  ],
  ctrl.emailLogin
);

router.get('/profile', auth, ctrl.getProfile);
router.patch('/profile', auth, ctrl.updateProfile);

module.exports = router;

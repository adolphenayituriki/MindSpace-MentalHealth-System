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

router.post(
  '/forgot-password',
  [body('email').isEmail().normalizeEmail(), validate],
  ctrl.forgotPassword
);

router.post(
  '/reset-password',
  [
    body('token').notEmpty(),
    body('password').isLength({ min: 6 }),
    validate,
  ],
  ctrl.resetPassword
);

module.exports = router;

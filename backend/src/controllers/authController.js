const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config');
const User = require('../models/User');
const { generateAnonymousId } = require('../utils/helpers');

const createToken = (user) => {
  return jwt.sign({ id: user._id }, config.jwtSecret, { expiresIn: '30d' });
};

exports.anonymousLogin = async (req, res, next) => {
  try {
    const { language } = req.body;
    const anonymousId = generateAnonymousId();
    const user = await User.create({
      anonymousId,
      language: language || 'rw',
      isAnonymous: true,
      displayName: anonymousId,
    });
    const token = createToken(user);
    res.status(201).json({ user, token });
  } catch (error) {
    next(error);
  }
};

exports.emailRegister = async (req, res, next) => {
  try {
    const { email, password, displayName, language } = req.body;
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ error: 'Email already registered' });
    }
    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({
      email,
      password: hashed,
      displayName,
      language: language || 'rw',
      isAnonymous: false,
      anonymousId: generateAnonymousId(),
    });
    const token = createToken(user);
    res.status(201).json({ user, token });
  } catch (error) {
    next(error);
  }
};

exports.emailLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const token = createToken(user);
    res.json({ user, token });
  } catch (error) {
    next(error);
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('joinedCommunities', 'name topic');
    res.json({ user });
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const updates = {};
    const fields = ['displayName', 'language', 'preferredTopics', 'onboardingComplete', 'relationshipStatus', 'age', 'phone', 'avatar'];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) updates[f] = req.body[f];
    });
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
    res.json({ user });
  } catch (error) {
    next(error);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.json({ message: 'If the email exists, a reset link has been sent.' });
    const token = jwt.sign({ id: user._id, purpose: 'password-reset' }, config.jwtSecret, { expiresIn: '1h' });
    user.resetToken = token;
    user.resetTokenExpiry = Date.now() + 3600000;
    await user.save();
    res.json({ message: 'If the email exists, a reset link has been sent.', resetToken: token });
  } catch (error) {
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    let decoded;
    try {
      decoded = jwt.verify(token, config.jwtSecret);
    } catch (_) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }
    if (decoded.purpose !== 'password-reset') {
      return res.status(400).json({ error: 'Invalid token' });
    }
    const user = await User.findById(decoded.id);
    if (!user || user.resetToken !== token || user.resetTokenExpiry < Date.now()) {
      return res.status(400).json({ error: 'Invalid or expired reset token' });
    }
    user.password = await bcrypt.hash(password, 12);
    user.resetToken = undefined;
    user.resetTokenExpiry = undefined;
    await user.save();
    res.json({ message: 'Password reset successful' });
  } catch (error) {
    next(error);
  }
};

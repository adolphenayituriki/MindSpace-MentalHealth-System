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
    const fields = ['displayName', 'language', 'preferredTopics', 'onboardingComplete'];
    fields.forEach((f) => {
      if (req.body[f] !== undefined) updates[f] = req.body[f];
    });
    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
    res.json({ user });
  } catch (error) {
    next(error);
  }
};

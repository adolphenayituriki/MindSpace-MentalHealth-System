const User = require('../models/User');
const HealingResource = require('../models/HealingResource');
const Counselor = require('../models/Counselor');
const CrisisResource = require('../models/CrisisResource');
const Community = require('../models/Community');
const Mood = require('../models/Mood');
const CounselingSession = require('../models/CounselingSession');

exports.getStats = async (req, res, next) => {
  try {
    const [users, counselors, healing, crisis, communities, sessions, moods] = await Promise.all([
      User.countDocuments(),
      Counselor.countDocuments(),
      HealingResource.countDocuments(),
      CrisisResource.countDocuments(),
      Community.countDocuments(),
      CounselingSession.countDocuments(),
      Mood.countDocuments(),
    ]);
    res.json({ stats: { users, counselors, healing, crisis, communities, sessions, moods } });
  } catch (error) {
    next(error);
  }
};

exports.listUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 }).limit(100);
    res.json({ users });
  } catch (error) {
    next(error);
  }
};

exports.updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['user', 'counselor', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ user });
  } catch (error) {
    next(error);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (error) {
    next(error);
  }
};

exports.createHealing = async (req, res, next) => {
  try {
    const resource = await HealingResource.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json({ resource });
  } catch (error) {
    next(error);
  }
};

exports.updateHealing = async (req, res, next) => {
  try {
    const resource = await HealingResource.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!resource) return res.status(404).json({ error: 'Resource not found' });
    res.json({ resource });
  } catch (error) {
    next(error);
  }
};

exports.deleteHealing = async (req, res, next) => {
  try {
    await HealingResource.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (error) {
    next(error);
  }
};

exports.createCounselor = async (req, res, next) => {
  try {
    const counselor = await Counselor.create(req.body);
    res.status(201).json({ counselor });
  } catch (error) {
    next(error);
  }
};

exports.updateCounselor = async (req, res, next) => {
  try {
    const counselor = await Counselor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!counselor) return res.status(404).json({ error: 'Counselor not found' });
    res.json({ counselor });
  } catch (error) {
    next(error);
  }
};

exports.deleteCounselor = async (req, res, next) => {
  try {
    await Counselor.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (error) {
    next(error);
  }
};

exports.createCrisis = async (req, res, next) => {
  try {
    const resource = await CrisisResource.create(req.body);
    res.status(201).json({ resource });
  } catch (error) {
    next(error);
  }
};

exports.updateCrisis = async (req, res, next) => {
  try {
    const resource = await CrisisResource.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!resource) return res.status(404).json({ error: 'Resource not found' });
    res.json({ resource });
  } catch (error) {
    next(error);
  }
};

exports.deleteCrisis = async (req, res, next) => {
  try {
    await CrisisResource.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (error) {
    next(error);
  }
};

exports.createCommunity = async (req, res, next) => {
  try {
    const community = await Community.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json({ community });
  } catch (error) {
    next(error);
  }
};

exports.updateCommunity = async (req, res, next) => {
  try {
    const community = await Community.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!community) return res.status(404).json({ error: 'Community not found' });
    res.json({ community });
  } catch (error) {
    next(error);
  }
};

exports.deleteCommunity = async (req, res, next) => {
  try {
    await Community.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (error) {
    next(error);
  }
};

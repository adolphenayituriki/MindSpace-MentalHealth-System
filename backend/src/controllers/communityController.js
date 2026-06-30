const Community = require('../models/Community');
const Message = require('../models/Message');
const User = require('../models/User');

exports.getCommunities = async (req, res, next) => {
  try {
    const communities = await Community.find().sort({ memberCount: -1 });
    res.json({ communities });
  } catch (error) {
    next(error);
  }
};

exports.getCommunity = async (req, res, next) => {
  try {
    const community = await Community.findById(req.params.id);
    if (!community) return res.status(404).json({ error: 'Community not found' });
    res.json({ community });
  } catch (error) {
    next(error);
  }
};

exports.joinCommunity = async (req, res, next) => {
  try {
    const community = await Community.findById(req.params.id);
    if (!community) return res.status(404).json({ error: 'Community not found' });
    const user = await User.findById(req.user._id);
    if (!user.joinedCommunities.includes(community._id)) {
      user.joinedCommunities.push(community._id);
      community.memberCount += 1;
      await Promise.all([user.save(), community.save()]);
    }
    res.json({ community, user });
  } catch (error) {
    next(error);
  }
};

exports.leaveCommunity = async (req, res, next) => {
  try {
    const community = await Community.findById(req.params.id);
    if (!community) return res.status(404).json({ error: 'Community not found' });
    const user = await User.findById(req.user._id);
    user.joinedCommunities = user.joinedCommunities.filter(
      (c) => c.toString() !== community._id.toString()
    );
    community.memberCount = Math.max(0, community.memberCount - 1);
    await Promise.all([user.save(), community.save()]);
    res.json({ community, user });
  } catch (error) {
    next(error);
  }
};

exports.getMessages = async (req, res, next) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const messages = await Message.find({ community: req.params.id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit))
      .populate('sender', 'displayName anonymousId');
    res.json({ messages: messages.reverse() });
  } catch (error) {
    next(error);
  }
};

exports.postMessage = async (req, res, next) => {
  try {
    const { content } = req.body;
    const message = await Message.create({
      sender: req.user._id,
      anonymousName: req.user.displayName,
      content,
      community: req.params.id,
    });
    const populated = await message.populate('sender', 'displayName anonymousId');
    res.status(201).json({ message: populated });
  } catch (error) {
    next(error);
  }
};

exports.getUserCommunities = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('joinedCommunities');
    res.json({ communities: user.joinedCommunities });
  } catch (error) {
    next(error);
  }
};

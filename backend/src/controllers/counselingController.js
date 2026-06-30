const CounselingSession = require('../models/CounselingSession');
const Counselor = require('../models/Counselor');
const Message = require('../models/Message');

exports.getCounselors = async (req, res, next) => {
  try {
    const counselors = await Counselor.find({ isAvailable: true, isVerified: true });
    res.json({ counselors });
  } catch (error) {
    next(error);
  }
};

exports.requestSession = async (req, res, next) => {
  try {
    const { topic, priority } = req.body;
    const active = await CounselingSession.findOne({
      user: req.user._id,
      status: { $in: ['waiting', 'active'] },
    });
    if (active) {
      return res.status(400).json({ error: 'You already have an active session' });
    }
    const session = await CounselingSession.create({
      user: req.user._id,
      topic,
      priority: priority || 'normal',
    });
    assignCounselor(session);
    res.status(201).json({ session });
  } catch (error) {
    next(error);
  }
};

exports.getSession = async (req, res, next) => {
  try {
    const session = await CounselingSession.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).populate('counselor', 'fullName bio languages');
    if (!session) return res.status(404).json({ error: 'Session not found' });
    res.json({ session });
  } catch (error) {
    next(error);
  }
};

exports.getActiveSession = async (req, res, next) => {
  try {
    const session = await CounselingSession.findOne({
      user: req.user._id,
      status: { $in: ['waiting', 'active'] },
    }).populate('counselor', 'fullName bio languages');
    res.json({ session });
  } catch (error) {
    next(error);
  }
};

exports.getSessionMessages = async (req, res, next) => {
  try {
    const messages = await Message.find({ session: req.params.id })
      .sort({ createdAt: 1 })
      .populate('sender', 'displayName anonymousId');
    res.json({ messages });
  } catch (error) {
    next(error);
  }
};

exports.sendSessionMessage = async (req, res, next) => {
  try {
    const { content } = req.body;
    const session = await CounselingSession.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!session) return res.status(404).json({ error: 'Session not found' });
    const message = await Message.create({
      sender: req.user._id,
      anonymousName: req.user.displayName,
      content,
      session: req.params.id,
    });
    res.status(201).json({ message });
  } catch (error) {
    next(error);
  }
};

exports.closeSession = async (req, res, next) => {
  try {
    const { rating, feedback } = req.body;
    const session = await CounselingSession.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id, status: { $ne: 'closed' } },
      { status: 'closed', closedAt: new Date(), rating, feedback },
      { new: true }
    );
    if (!session) return res.status(404).json({ error: 'Session not found or already closed' });
    res.json({ session });
  } catch (error) {
    next(error);
  }
};

async function assignCounselor(session) {
  try {
    const counselor = await Counselor.findOne({ isAvailable: true, isVerified: true })
      .sort({ maxConcurrentSessions: 1 });
    if (counselor) {
      session.counselor = counselor._id;
      session.status = 'active';
      await session.save();
    }
  } catch (error) {
    console.error('Failed to assign counselor:', error.message);
  }
}

// Counselor-specific endpoints
exports.getCounselorSessions = async (req, res, next) => {
  try {
    const sessions = await CounselingSession.find({ counselor: req.user._id })
      .sort({ startedAt: -1 })
      .populate('user', 'displayName anonymousId');
    res.json({ sessions });
  } catch (error) {
    next(error);
  }
};

exports.counselorSendMessage = async (req, res, next) => {
  try {
    const { content } = req.body;
    const session = await CounselingSession.findOne({
      _id: req.params.id,
      counselor: req.user._id,
    });
    if (!session) return res.status(404).json({ error: 'Session not found' });
    const message = await Message.create({
      sender: req.user._id,
      content,
      session: req.params.id,
    });
    res.status(201).json({ message });
  } catch (error) {
    next(error);
  }
};

const Message = require('../models/Message');
const aiService = require('../services/aiService');
const { detectCrisisKeywords } = require('../utils/helpers');

exports.sendMessage = async (req, res, next) => {
  try {
    const { content } = req.body;
    const isCrisis = detectCrisisKeywords(content);

    const userMsg = await Message.create({
      sender: req.user._id,
      anonymousName: req.user.displayName,
      content,
      isFromAI: false,
      isCrisisDetected: isCrisis,
    });

    const aiResponse = await aiService.generateResponse(content, {
      language: req.user.language,
      userName: req.user.displayName,
    });

    const aiMsg = await Message.create({
      sender: req.user._id,
      anonymousName: 'MindSpace AI',
      content: aiResponse,
      isFromAI: true,
      isCrisisDetected: false,
    });

    res.json({
      userMessage: userMsg,
      aiMessage: aiMsg,
      crisisDetected: isCrisis,
      crisisResources: isCrisis
        ? [
            { name: 'Crisis Hotline', number: '3002' },
            { name: 'Emergency', number: '112' },
          ]
        : undefined,
    });
  } catch (error) {
    next(error);
  }
};

exports.getHistory = async (req, res, next) => {
  try {
    const messages = await Message.find({
      sender: req.user._id,
      community: { $exists: false },
      session: { $exists: false },
    })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json({ messages: messages.reverse() });
  } catch (error) {
    next(error);
  }
};

exports.clearHistory = async (req, res, next) => {
  try {
    await Message.deleteMany({
      sender: req.user._id,
      community: { $exists: false },
      session: { $exists: false },
    });
    res.json({ message: 'History cleared' });
  } catch (error) {
    next(error);
  }
};

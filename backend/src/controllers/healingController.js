const HealingResource = require('../models/HealingResource');
const Mood = require('../models/Mood');

exports.getAll = async (req, res, next) => {
  try {
    const { type, tag } = req.query;
    const filter = {};
    if (type) filter.type = type;
    if (tag) filter.tags = tag;

    const resources = await HealingResource.find(filter).sort({ isFeatured: -1, createdAt: -1 });
    res.json({ resources });
  } catch (error) {
    next(error);
  }
};

exports.getByType = async (req, res, next) => {
  try {
    const resources = await HealingResource.find({ type: req.params.type }).sort({ isFeatured: -1 });
    res.json({ resources });
  } catch (error) {
    next(error);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const resource = await HealingResource.findById(req.params.id);
    if (!resource) return res.status(404).json({ error: 'Resource not found' });
    res.json({ resource });
  } catch (error) {
    next(error);
  }
};

exports.getRecommended = async (req, res, next) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 7);

    const recentMoods = await Mood.find({
      user: req.user._id,
      date: { $gte: thirtyDaysAgo },
    }).sort({ date: -1 }).limit(7);

    let avgMood = 3;
    let dominantTags = [];

    if (recentMoods.length > 0) {
      avgMood = recentMoods.reduce((s, m) => s + m.value, 0) / recentMoods.length;

      const lowCount = recentMoods.filter((m) => m.value <= 2).length;
      const highCount = recentMoods.filter((m) => m.value >= 4).length;

      if (lowCount >= 3) {
        dominantTags = ['anxiety', 'stress', 'grief', 'trauma'];
      } else if (highCount >= 3) {
        dominantTags = ['gratitude', 'joy', 'celebration'];
      } else {
        dominantTags = ['stress', 'mindfulness', 'calm'];
      }
    }

    const moodFloor = Math.floor(avgMood);
    const moodCeil = Math.ceil(avgMood);

    const resources = await HealingResource.find({
      $or: [
        { moodTags: { $in: [moodFloor, moodCeil] } },
        { tags: { $in: dominantTags } },
        { isFeatured: true },
      ],
    }).sort({ isFeatured: -1 }).limit(8);

    res.json({ resources, context: { averageMood: Math.round(avgMood * 10) / 10, dominantTags } });
  } catch (error) {
    next(error);
  }
};

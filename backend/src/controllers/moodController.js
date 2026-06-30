const Mood = require('../models/Mood');
const User = require('../models/User');

exports.logMood = async (req, res, next) => {
  try {
    const { value, emoji, note, tags } = req.body;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const existing = await Mood.findOne({
      user: req.user._id,
      date: { $gte: today },
    });

    if (existing) {
      existing.value = value;
      existing.emoji = emoji;
      existing.note = note || existing.note;
      existing.tags = tags || existing.tags;
      await existing.save();
    } else {
      await Mood.create({ user: req.user._id, value, emoji, note, tags });
    }

    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const previousDay = await Mood.findOne({
      user: req.user._id,
      date: { $gte: yesterday, $lt: today },
    });

    const user = await User.findById(req.user._id);
    if (previousDay) {
      user.moodStreak = (user.moodStreak || 0) + 1;
    } else {
      user.moodStreak = 1;
    }
    user.lastMoodDate = new Date();
    await user.save();

    const moods = await Mood.find({ user: req.user._id })
      .sort({ date: -1 })
      .limit(30);
    res.json({ moods, streak: user.moodStreak });
  } catch (error) {
    next(error);
  }
};

exports.getMoods = async (req, res, next) => {
  try {
    const { days } = req.query;
    const limit = parseInt(days) || 30;
    const since = new Date();
    since.setDate(since.getDate() - limit);

    const moods = await Mood.find({
      user: req.user._id,
      date: { $gte: since },
    }).sort({ date: -1 });

    const user = await User.findById(req.user._id);

    res.json({ moods, streak: user.moodStreak });
  } catch (error) {
    next(error);
  }
};

exports.getTodayMood = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const mood = await Mood.findOne({
      user: req.user._id,
      date: { $gte: today, $lt: tomorrow },
    });

    res.json({ mood });
  } catch (error) {
    next(error);
  }
};

exports.getMoodInsights = async (req, res, next) => {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const moods = await Mood.find({
      user: req.user._id,
      date: { $gte: thirtyDaysAgo },
    }).sort({ date: 1 });

    if (moods.length === 0) {
      return res.json({ insights: null });
    }

    const avg = moods.reduce((sum, m) => sum + m.value, 0) / moods.length;
    const trend = moods.length >= 7
      ? moods.slice(-7).reduce((s, m) => s + m.value, 0) / 7
      : avg;

    res.json({
      insights: {
        average: Math.round(avg * 10) / 10,
        trend: Math.round(trend * 10) / 10,
        total: moods.length,
        best: Math.max(...moods.map((m) => m.value)),
        worst: Math.min(...moods.map((m) => m.value)),
        weeklyAverages: calculateWeeklyAverages(moods),
      },
    });
  } catch (error) {
    next(error);
  }
};

function calculateWeeklyAverages(moods) {
  const weeks = {};
  moods.forEach((m) => {
    const d = new Date(m.date);
    const weekStart = new Date(d);
    weekStart.setDate(d.getDate() - d.getDay());
    const key = weekStart.toISOString().slice(0, 10);
    if (!weeks[key]) weeks[key] = { sum: 0, count: 0 };
    weeks[key].sum += m.value;
    weeks[key].count += 1;
  });
  return Object.entries(weeks).map(([week, data]) => ({
    week,
    average: Math.round((data.sum / data.count) * 10) / 10,
  }));
}

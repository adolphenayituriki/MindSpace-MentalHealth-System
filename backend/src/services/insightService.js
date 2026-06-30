const Mood = require('../models/Mood');
const Journal = require('../models/Journal');
const aiService = require('./aiService');

exports.generateWeeklyInsight = async (userId, language = 'rw') => {
  const weekAgo = new Date();
  weekAgo.setDate(weekAgo.getDate() - 7);

  const [moods, journals] = await Promise.all([
    Mood.find({ user: userId, date: { $gte: weekAgo } }).sort({ date: 1 }),
    Journal.find({ user: userId, createdAt: { $gte: weekAgo } }).sort({ createdAt: -1 }).limit(5),
  ]);

  const aiReflection = await aiService.generateInsight(moods, { language });

  const weeklyAverage = moods.length > 0
    ? Math.round((moods.reduce((s, m) => s + m.value, 0) / moods.length) * 10) / 10
    : null;

  const moodTrend = moods.length >= 2
    ? moods[moods.length - 1].value - moods[0].value
    : 0;

  return {
    weekStarting: weekAgo.toISOString().slice(0, 10),
    entryCount: moods.length,
    journalCount: journals.length,
    weeklyAverage,
    trend: moodTrend > 0 ? 'improving' : moodTrend < 0 ? 'declining' : 'stable',
    aiReflection,
    journals: journals.map((j) => ({
      id: j._id,
      title: j.title,
      preview: j.content.slice(0, 100),
      date: j.createdAt,
    })),
  };
};

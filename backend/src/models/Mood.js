const mongoose = require('mongoose');

const moodSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  value: { type: Number, required: true, min: 1, max: 5 },
  emoji: { type: String, required: true },
  note: { type: String },
  tags: [{ type: String }],
  date: { type: Date, default: Date.now },
});

moodSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('Mood', moodSchema);

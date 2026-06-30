const mongoose = require('mongoose');

const journalSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String },
  content: { type: String, required: true },
  prompt: { type: String },
  mood: { type: Number, min: 1, max: 5 },
  tags: [{ type: String }],
  isPrivate: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

journalSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

journalSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Journal', journalSchema);

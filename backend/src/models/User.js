const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  anonymousId: { type: String, unique: true, sparse: true },
  email: { type: String, unique: true, sparse: true },
  password: { type: String },
  displayName: { type: String },
  language: { type: String, enum: ['rw', 'en'], default: 'rw' },
  isAnonymous: { type: Boolean, default: true },
  role: { type: String, enum: ['user', 'counselor', 'admin'], default: 'user' },
  onboardingComplete: { type: Boolean, default: false },
  preferredTopics: [{ type: String }],
  joinedCommunities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Community' }],
  moodStreak: { type: Number, default: 0 },
  lastMoodDate: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

userSchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('User', userSchema);

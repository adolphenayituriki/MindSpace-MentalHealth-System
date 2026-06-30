const mongoose = require('mongoose');

const counselingSessionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  counselor: { type: mongoose.Schema.Types.ObjectId, ref: 'Counselor' },
  status: {
    type: String,
    enum: ['waiting', 'active', 'closed'],
    default: 'waiting',
  },
  topic: { type: String },
  priority: { type: String, enum: ['normal', 'urgent'], default: 'normal' },
  startedAt: { type: Date, default: Date.now },
  closedAt: { type: Date },
  rating: { type: Number, min: 1, max: 5 },
  feedback: { type: String },
});

module.exports = mongoose.model('CounselingSession', counselingSessionSchema);

const mongoose = require('mongoose');

const counselorSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  bio: { type: String },
  bioRw: { type: String },
  specialization: [{ type: String }],
  languages: [{ type: String, enum: ['rw', 'en'] }],
  isVerified: { type: Boolean, default: false },
  isAvailable: { type: Boolean, default: true },
  maxConcurrentSessions: { type: Number, default: 5 },
  rating: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Counselor', counselorSchema);

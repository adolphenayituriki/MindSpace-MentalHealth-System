const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  anonymousName: { type: String },
  content: { type: String, required: true },
  community: { type: mongoose.Schema.Types.ObjectId, ref: 'Community' },
  session: { type: mongoose.Schema.Types.ObjectId, ref: 'CounselingSession' },
  isFromAI: { type: Boolean, default: false },
  isCrisisDetected: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

messageSchema.index({ community: 1, createdAt: -1 });
messageSchema.index({ session: 1, createdAt: 1 });

module.exports = mongoose.model('Message', messageSchema);

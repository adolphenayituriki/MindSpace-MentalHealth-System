const mongoose = require('mongoose');

const communitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  nameRw: { type: String, required: true },
  description: { type: String, required: true },
  descriptionRw: { type: String, required: true },
  topic: { type: String, required: true },
  icon: { type: String },
  memberCount: { type: Number, default: 0 },
  isModerated: { type: Boolean, default: true },
  moderators: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Community', communitySchema);

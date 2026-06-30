const mongoose = require('mongoose');

const healingResourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  titleRw: { type: String, required: true },
  type: {
    type: String,
    enum: ['video', 'sound', 'sleep_tool', 'breathing', 'article', 'guided_exercise'],
    required: true,
  },
  description: { type: String },
  descriptionRw: { type: String },
  url: { type: String },
  embedUrl: { type: String },
  duration: { type: String },
  thumbnailUrl: { type: String },
  tags: [{ type: String }],
  moodTags: [{ type: Number, min: 1, max: 5 }],
  isFeatured: { type: Boolean, default: false },
  steps: [{ type: String }],
  stepsRw: [{ type: String }],
  instructions: { type: String },
  instructionsRw: { type: String },
  icon: { type: String },
  createdAt: { type: Date, default: Date.now },
});

healingResourceSchema.index({ type: 1 });
healingResourceSchema.index({ tags: 1 });
healingResourceSchema.index({ moodTags: 1 });

module.exports = mongoose.model('HealingResource', healingResourceSchema);

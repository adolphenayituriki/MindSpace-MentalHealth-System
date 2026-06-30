const mongoose = require('mongoose');

const crisisResourceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  nameRw: { type: String, required: true },
  type: {
    type: String,
    enum: ['ngo', 'health_center', 'hotline', 'emergency'],
    required: true,
  },
  phone: { type: String, required: true },
  location: { type: String },
  locationRw: { type: String },
  description: { type: String },
  descriptionRw: { type: String },
  hours: { type: String },
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('CrisisResource', crisisResourceSchema);

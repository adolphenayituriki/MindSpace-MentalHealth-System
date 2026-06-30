const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  counselor: { type: mongoose.Schema.Types.ObjectId, ref: 'Counselor', required: true },
  date: { type: Date, required: true },
  durationMinutes: { type: Number, default: 50 },
  type: {
    type: String,
    enum: ['chat', 'audio', 'video'],
    default: 'chat',
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled'],
    default: 'pending',
  },
  topic: { type: String },
  notes: { type: String },
  createdAt: { type: Date, default: Date.now },
});

const counselorAvailabilitySchema = new mongoose.Schema({
  counselor: { type: mongoose.Schema.Types.ObjectId, ref: 'Counselor', required: true },
  dayOfWeek: { type: Number, min: 0, max: 6 },
  startTime: { type: String },
  endTime: { type: String },
  active: { type: Boolean, default: true },
});

module.exports = {
  Booking: mongoose.model('Booking', bookingSchema),
  CounselorAvailability: mongoose.model('CounselorAvailability', counselorAvailabilitySchema),
};

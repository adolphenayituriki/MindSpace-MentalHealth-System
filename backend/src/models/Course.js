const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  titleRw: { type: String },
  description: { type: String },
  descriptionRw: { type: String },
  type: {
    type: String,
    enum: ['video', 'article', 'podcast', 'exercise', 'quiz'],
    required: true,
  },
  content: { type: String },
  contentRw: { type: String },
  videoUrl: { type: String },
  audioUrl: { type: String },
  durationMinutes: { type: Number },
  order: { type: Number },
  resources: [{
    label: String,
    url: String,
  }],
});

const moduleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  titleRw: { type: String },
  description: { type: String },
  descriptionRw: { type: String },
  order: { type: Number },
  lessons: [lessonSchema],
});

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  titleRw: { type: String },
  subtitle: { type: String },
  subtitleRw: { type: String },
  description: { type: String },
  descriptionRw: { type: String },
  thumbnail: { type: String },
  category: {
    type: String,
    enum: ['premarital', 'couples', 'parenting', 'grief', 'retirement', 'wellbeing'],
    required: true,
  },
  level: { type: String, enum: ['beginner', 'intermediate', 'advanced'], default: 'beginner' },
  modules: [moduleSchema],
  estimatedHours: { type: Number },
  certificateEligible: { type: Boolean, default: false },
  published: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const enrollmentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  progress: {
    completedLessons: [{ type: mongoose.Schema.Types.ObjectId }],
    lastLesson: { type: mongoose.Schema.Types.ObjectId },
    percent: { type: Number, default: 0 },
  },
  startedAt: { type: Date, default: Date.now },
  completedAt: { type: Date },
  certificateIssued: { type: Boolean, default: false },
});

module.exports = {
  Course: mongoose.model('Course', courseSchema),
  Enrollment: mongoose.model('Enrollment', enrollmentSchema),
};

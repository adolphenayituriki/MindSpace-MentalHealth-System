const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  textRw: { type: String },
  type: {
    type: String,
    enum: ['likert5', 'likert3', 'yesno', 'multiple', 'open'],
    default: 'likert5',
  },
  options: [{
    label: String,
    labelRw: String,
    value: Number,
  }],
  category: { type: String },
  order: { type: Number },
});

const assessmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  titleRw: { type: String },
  description: { type: String },
  descriptionRw: { type: String },
  type: {
    type: String,
    enum: ['relationship', 'stress', 'wellbeing', 'readiness', 'general'],
    required: true,
  },
  questions: [questionSchema],
  minScore: { type: Number, default: 0 },
  maxScore: { type: Number, default: 100 },
  levels: [{
    label: { type: String },
    labelRw: { type: String },
    min: { type: Number },
    max: { type: Number },
    message: { type: String },
    messageRw: { type: String },
    recommendation: { type: String },
    recommendationRw: { type: String },
  }],
  estimatedMinutes: { type: Number, default: 5 },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
});

const resultSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assessment: { type: mongoose.Schema.Types.ObjectId, ref: 'Assessment', required: true },
  answers: [{
    questionId: { type: mongoose.Schema.Types.ObjectId },
    value: mongoose.Schema.Types.Mixed,
  }],
  score: { type: Number },
  level: { type: String },
  completedAt: { type: Date, default: Date.now },
});

module.exports = {
  Assessment: mongoose.model('Assessment', assessmentSchema),
  AssessmentResult: mongoose.model('AssessmentResult', resultSchema),
};

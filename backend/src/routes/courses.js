const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { Course, Enrollment } = require('../models/Course');

router.get('/', auth, async (req, res, next) => {
  try {
    const courses = await Course.find({ published: true })
      .select('title titleRw subtitle category level modules estimatedHours')
      .sort({ createdAt: -1 });
    const enriched = await Promise.all(courses.map(async (c) => {
      const enrollment = await Enrollment.findOne({ user: req.user._id, course: c._id });
      return {
        ...c.toObject(),
        enrolled: !!enrollment,
        progress: enrollment?.progress?.percent || 0,
      };
    }));
    res.json({ courses: enriched });
  } catch (err) { next(err); }
});

router.get('/mine', auth, async (req, res, next) => {
  try {
    const enrollments = await Enrollment.find({ user: req.user._id })
      .populate('course', 'title titleRw subtitle category level estimatedHours')
      .sort({ startedAt: -1 });
    res.json({ enrollments });
  } catch (err) { next(err); }
});

router.get('/:id', auth, async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    const enrollment = await Enrollment.findOne({ user: req.user._id, course: course._id });
    res.json({ course, enrollment });
  } catch (err) { next(err); }
});

router.post('/:id/enroll', auth, async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    const existing = await Enrollment.findOne({ user: req.user._id, course: course._id });
    if (existing) return res.json({ enrollment: existing, message: 'Already enrolled' });
    const enrollment = await Enrollment.create({ user: req.user._id, course: course._id });
    res.status(201).json({ enrollment });
  } catch (err) { next(err); }
});

router.post('/:id/progress', auth, async (req, res, next) => {
  try {
    const { lessonId } = req.body;
    const enrollment = await Enrollment.findOne({ user: req.user._id, course: req.params.id });
    if (!enrollment) return res.status(404).json({ message: 'Not enrolled' });

    if (lessonId && !enrollment.progress.completedLessons.includes(lessonId)) {
      enrollment.progress.completedLessons.push(lessonId);
      enrollment.progress.lastLesson = lessonId;
    }

    const course = await Course.findById(req.params.id);
    let total = 0;
    course.modules.forEach((m) => { total += m.lessons.length; });
    enrollment.progress.percent = total > 0
      ? Math.round((enrollment.progress.completedLessons.length / total) * 100)
      : 0;

    if (enrollment.progress.percent >= 100 && !enrollment.completedAt) {
      enrollment.completedAt = new Date();
    }

    await enrollment.save();
    res.json({ enrollment });
  } catch (err) { next(err); }
});

module.exports = router;

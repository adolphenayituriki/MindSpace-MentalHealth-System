const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { Assessment, AssessmentResult } = require('../models/Assessment');

router.get('/', auth, async (req, res, next) => {
  try {
    const assessments = await Assessment.find({ active: true })
      .select('title titleRw description descriptionRw type estimatedMinutes')
      .sort({ createdAt: -1 });
    res.json({ assessments });
  } catch (err) { next(err); }
});

router.get('/results', auth, async (req, res, next) => {
  try {
    const results = await AssessmentResult.find({ user: req.user._id })
      .populate('assessment', 'title titleRw type')
      .sort({ completedAt: -1 });
    res.json({ results });
  } catch (err) { next(err); }
});

router.get('/:id', auth, async (req, res, next) => {
  try {
    const assessment = await Assessment.findById(req.params.id);
    if (!assessment) return res.status(404).json({ message: 'Assessment not found' });
    res.json({ assessment });
  } catch (err) { next(err); }
});

router.post('/:id/submit', auth, async (req, res, next) => {
  try {
    const assessment = await Assessment.findById(req.params.id);
    if (!assessment) return res.status(404).json({ message: 'Assessment not found' });

    const { answers } = req.body;
    let total = 0;
    const questionMap = {};
    assessment.questions.forEach((q) => { questionMap[q._id.toString()] = q; });

    answers.forEach((a) => {
      const q = questionMap[a.questionId];
      if (q && typeof a.value === 'number') {
        total += a.value;
      }
    });

    const maxPossible = assessment.questions.reduce((s, q) => {
      if (q.type === 'likert5') return s + 5;
      if (q.type === 'yesno') return s + 1;
      return s + 0;
    }, 0);

    const pct = maxPossible > 0 ? Math.round((total / maxPossible) * 100) : 0;
    let level = null;
    if (assessment.levels && assessment.levels.length > 0) {
      const matched = assessment.levels.find((l) => pct >= l.min && pct <= l.max);
      if (matched) level = matched.label;
    }

    const result = await AssessmentResult.create({
      user: req.user._id,
      assessment: assessment._id,
      answers,
      score: pct,
      level,
    });

    const populated = await AssessmentResult.findById(result._id)
      .populate('assessment', 'title titleRw description descriptionRw levels');

    res.status(201).json({ result: populated, score: pct, level });
  } catch (err) { next(err); }
});

module.exports = router;

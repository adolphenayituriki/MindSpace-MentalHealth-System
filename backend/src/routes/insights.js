const router = require('express').Router();
const { auth } = require('../middleware/auth');
const insightService = require('../services/insightService');

router.use(auth);

router.get('/weekly', async (req, res, next) => {
  try {
    const insight = await insightService.generateWeeklyInsight(
      req.user._id,
      req.query.lang || req.user.language
    );
    res.json({ insight });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

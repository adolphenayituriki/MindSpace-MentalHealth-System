const CrisisResource = require('../models/CrisisResource');

exports.getResources = async (req, res, next) => {
  try {
    const { type, lang } = req.query;
    const filter = { isVerified: true };
    if (type) filter.type = type;
    const resources = await CrisisResource.find(filter).sort({ type: 1 });
    res.json({ resources });
  } catch (error) {
    next(error);
  }
};

exports.getHotlines = async (req, res, next) => {
  try {
    const hotlines = await CrisisResource.find({
      type: { $in: ['hotline', 'emergency'] },
      isVerified: true,
    });
    res.json({ hotlines });
  } catch (error) {
    next(error);
  }
};

exports.getNearbyCenters = async (req, res, next) => {
  try {
    const centers = await CrisisResource.find({
      type: 'health_center',
      isVerified: true,
    });
    res.json({ centers });
  } catch (error) {
    next(error);
  }
};

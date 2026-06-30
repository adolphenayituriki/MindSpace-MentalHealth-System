const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({ error: 'Admin access required' });
};

const staff = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'counselor')) {
    return next();
  }
  return res.status(403).json({ error: 'Staff access required' });
};

module.exports = { admin, staff };

module.exports = function (req, res, next) {
  if (req.user.role === 'admin' || req.user.role === 'vendor') return next();

  res.status(403).send('Access denied');
};

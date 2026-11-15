const { validationResult } = require('express-validator');
const AppError = require('./AppError');

module.exports = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new AppError('Validation failed', 422);
    error.details = errors.array();
    return next(error);
  }
  next();
};

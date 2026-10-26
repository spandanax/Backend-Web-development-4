const authService = require('../services/authService');

function sendError(res, error, next) {
  if (error && error.statusCode === 400) {
    return res.status(400).json({
      error: {
        code: 'INVALID_INPUT',
        message: error.message
      }
    });
  }

  if (error && error.statusCode === 409) {
    return res.status(409).json({
      error: {
        code: 'EMAIL_ALREADY_EXISTS',
        message: 'Email already registered'
      }
    });
  }

  if (error && error.statusCode === 401) {
    return res.status(401).json({
      error: {
        code: 'INVALID_CREDENTIALS',
        message: 'Invalid email or password'
      }
    });
  }

  return next(error);
}

async function register(req, res, next) {
  try {
    const user = await authService.register(req.body);
    return res.status(201).json(user);
  } catch (error) {
    return sendError(res, error, next);
  }
}

async function login(req, res, next) {
  try {
    const user = await authService.login(req.body);
    return res.status(200).json(user);
  } catch (error) {
    return sendError(res, error, next);
  }
}

module.exports = {
  register,
  login
};

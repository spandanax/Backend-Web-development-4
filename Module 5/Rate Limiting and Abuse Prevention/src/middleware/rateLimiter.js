'use strict';

const rateLimit = require('express-rate-limit');

module.exports = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true,
  handler: (req, res, _next, options) => {
    const resetTime = req.rateLimit.resetTime;
    const retryAfter = resetTime
      ? Math.max(1, Math.ceil((resetTime.getTime() - Date.now()) / 1000))
      : Math.ceil(options.windowMs / 1000);

    res.setHeader('Retry-After', String(retryAfter));
    res.status(options.statusCode).send(options.message);
  },
});

// For multiple app instances, rate-limit-redis can replace the default in-memory
// store so all instances share counters. In-memory counters are local to each
// instance, allowing clients to bypass the limit by reaching different instances.

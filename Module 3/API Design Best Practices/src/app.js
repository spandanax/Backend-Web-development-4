const express = require('express');
const postRoutes = require('./routes/postRoutes');
const { resetData } = require('./data/postStore');
const controller = require('./controllers/postController');
const http = require('./utils/http');

function createApp() {
  const app = express();
  app.use(express.json());

  app.use('/', postRoutes);
  app.get('/explode', controller.explode);

  app.use((req, res) => {
    return http.sendError(res, 404, 'NOT_FOUND', 'Resource not found');
  });

  app.use((err, req, res, next) => {
    if (res.headersSent) {
      return next(err);
    }

    const status = err.statusCode === 400 || err.status === 400 ? 400 : 500;
    if (status === 500) {
      console.error(err);
    }
    const code = status === 400
      ? err.code === 'VALIDATION_ERROR' ? err.code : 'INVALID_REQUEST'
      : 'INTERNAL_ERROR';
    const message = status === 400
      ? code === 'VALIDATION_ERROR' ? err.message : 'Request is invalid'
      : 'Something went wrong';
    return http.sendError(res, status, code, message);
  });

  return app;
}

if (require.main === module) {
  const app = createApp();
  const port = 3000;
  app.listen(port, () => {
    console.log(`Starter API listening on port ${port}`);
  });
}

module.exports = {
  createApp,
  resetData
};

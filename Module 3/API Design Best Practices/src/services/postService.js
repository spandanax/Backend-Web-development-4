const store = require('../data/postStore');

function listPosts(query = {}) {
  const page = parsePositiveInteger(query.page, 1, 'page');
  const limit = parsePositiveInteger(query.limit, 2, 'limit', 100);
  const posts = store.getAllPosts();
  const start = (page - 1) * limit;

  return {
    data: posts.slice(start, start + limit),
    meta: {
      page,
      limit,
      total: posts.length,
      pages: Math.ceil(posts.length / limit)
    }
  };
}

function parsePositiveInteger(value, defaultValue, field, maximum) {
  if (value === undefined) {
    return defaultValue;
  }

  if (!/^[1-9]\d*$/.test(String(value))) {
    const err = new Error(`${field} must be a positive integer`);
    err.statusCode = 400;
    err.code = 'VALIDATION_ERROR';
    throw err;
  }

  const parsedValue = Number(value);
  if (maximum !== undefined && parsedValue > maximum) {
    return maximum;
  }

  if (!Number.isSafeInteger(parsedValue)) {
    const err = new Error(`${field} must be a positive integer`);
    err.statusCode = 400;
    err.code = 'VALIDATION_ERROR';
    throw err;
  }

  return parsedValue;
}

function getPost(id) {
  return store.getPostById(id);
}

function createPost(body = {}) {
  return store.createPost({
    title: body.title,
    author: body.author
  });
}

function likePost(id) {
  return store.incrementLikes(id);
}

function explode() {
  const err = new Error('SQLITE_CONSTRAINT in posts table');
  err.statusCode = 500;
  throw err;
}

module.exports = {
  listPosts,
  getPost,
  createPost,
  likePost,
  explode
};

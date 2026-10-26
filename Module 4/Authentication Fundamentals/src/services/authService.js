const bcrypt = require('bcryptjs');
const userRepository = require('../repositories/userRepository');

function createInputError(message) {
  const error = new Error(message);
  error.statusCode = 400;
  error.code = 'INVALID_INPUT';
  return error;
}

function toPublicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email
  };
}

async function register(fields) {
  if (
    !fields ||
    typeof fields.name !== 'string' ||
    !fields.name.trim() ||
    typeof fields.email !== 'string' ||
    !fields.email.trim() ||
    typeof fields.password !== 'string' ||
    !fields.password.trim()
  ) {
    throw createInputError('Name, email, and password are required');
  }

  const name = fields.name.trim();
  const email = fields.email.trim().toLowerCase();
  const cost = Number(process.env.BCRYPT_COST) || 12;
  const passwordHash = await bcrypt.hash(fields.password, cost);
  const user = await userRepository.createUser({
    name,
    email,
    passwordHash
  });

  return toPublicUser(user);
}

async function login(fields) {
  if (
    !fields ||
    typeof fields.email !== 'string' ||
    !fields.email.trim() ||
    typeof fields.password !== 'string' ||
    !fields.password.trim()
  ) {
    throw createInputError('Email and password are required');
  }

  const email = fields.email.trim().toLowerCase();
  const user = await userRepository.findByEmail(email);

  if (!user || !(await bcrypt.compare(fields.password, user.passwordHash))) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    error.code = 'INVALID_CREDENTIALS';
    throw error;
  }

  return toPublicUser(user);
}

module.exports = {
  register,
  login
};

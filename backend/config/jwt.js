const JWT_OPTIONS = Object.freeze({
  algorithm: 'HS256',
  issuer: 'liftsutra-api',
  audience: 'liftsutra-app',
});

const getJwtSignOptions = (env = process.env) => ({
  ...JWT_OPTIONS,
  expiresIn: env.JWT_EXPIRES_IN || '7d',
});

module.exports = { JWT_OPTIONS, getJwtSignOptions };

const isProduction = (env = process.env) => env.NODE_ENV === 'production';

const validateServerEnvironment = (env) => {
  if (!env.MONGO_URI) throw new Error('MONGO_URI is required.');
  if (isProduction(env) && (!env.JWT_SECRET || env.JWT_SECRET.length < 32)) {
    throw new Error('Production requires a JWT_SECRET of at least 32 characters.');
  }
  if (isProduction(env) && /replace|example|change-me|password/i.test(env.JWT_SECRET)) {
    throw new Error('Production requires a random JWT_SECRET, not an example value.');
  }
};

// Also runs after startup: a later database outage must never activate the demo store.
const requireProductionDatabase = (connection, env = process.env) => (req, res, next) => {
  if (isProduction(env) && connection.readyState !== 1) {
    return res.status(503).json({ success: false, message: 'Service temporarily unavailable. Please try again shortly.' });
  }
  return next();
};

module.exports = { isProduction, validateServerEnvironment, requireProductionDatabase };

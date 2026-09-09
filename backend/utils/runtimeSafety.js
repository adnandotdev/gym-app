const isProduction = () => process.env.NODE_ENV === 'production';

const validateServerEnvironment = (env) => {
  if (!env.MONGO_URI) throw new Error('MONGO_URI is required.');
  if (env.NODE_ENV === 'production' && (!env.JWT_SECRET || env.JWT_SECRET.length < 32)) {
    throw new Error('Production requires a JWT_SECRET of at least 32 characters.');
  }
};

// Also runs after startup: a later database outage must never activate the demo store.
const requireProductionDatabase = (connection) => (req, res, next) => {
  if (isProduction() && connection.readyState !== 1) {
    return res.status(503).json({ success: false, message: 'Service temporarily unavailable. Please try again shortly.' });
  }
  return next();
};

module.exports = { isProduction, validateServerEnvironment, requireProductionDatabase };

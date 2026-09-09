const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const splitCsv = (value) => (value || '')
  .split(',')
  .map((entry) => entry.trim())
  .filter(Boolean);

const isProduction = (env = process.env) => env.NODE_ENV === 'production';

const getAllowedOrigins = (env = process.env) => splitCsv(env.CORS_ORIGINS);

const isExactHttpsOrigin = (value) => {
  if (value.includes('*')) return false;
  try {
    const parsed = new URL(value);
    return parsed.protocol === 'https:' &&
      parsed.hostname.includes('.') &&
      !parsed.username &&
      !parsed.password &&
      parsed.pathname === '/' &&
      !parsed.search &&
      !parsed.hash &&
      parsed.origin === value;
  } catch {
    return false;
  }
};

const validateSecurityEnvironment = (env = process.env) => {
  const origins = getAllowedOrigins(env);
  if (isProduction(env) && origins.length === 0) {
    throw new Error('Production requires CORS_ORIGINS to list allowed browser origins.');
  }
  if (isProduction(env) && origins.some((origin) => !isExactHttpsOrigin(origin))) {
    throw new Error('CORS_ORIGINS must contain exact HTTPS browser origins without paths or wildcards.');
  }
};

const corsOptions = (env = process.env) => {
  const allowedOrigins = getAllowedOrigins(env);
  const allowAll = !isProduction(env) && allowedOrigins.length === 0;

  return {
    origin(origin, callback) {
      if (!origin || allowAll || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }
      const error = new Error('Origin is not allowed.');
      error.status = 403;
      callback(error);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false,
    optionsSuccessStatus: 204,
  };
};

const createApiLimiter = () => rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests. Please try again later.' },
});

const createAuthLimiter = () => rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many sign-in attempts. Please try again later.' },
});

const applySecurityMiddleware = (app, env = process.env) => {
  app.disable('x-powered-by');
  const configuredProxy = Number.parseInt(env.TRUST_PROXY, 10);
  app.set('trust proxy', Number.isInteger(configuredProxy) ? configuredProxy : (isProduction(env) ? 1 : false));
  app.use(helmet());
  app.use(cors(corsOptions(env)));
  app.use(expressJsonLimit(env));
};

const expressJsonLimit = (env = process.env) => {
  const express = require('express');
  return express.json({ limit: env.JSON_BODY_LIMIT || '100kb' });
};

module.exports = {
  applySecurityMiddleware,
  corsOptions,
  createApiLimiter,
  createAuthLimiter,
  getAllowedOrigins,
  validateSecurityEnvironment,
};

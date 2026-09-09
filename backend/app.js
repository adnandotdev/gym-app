const express = require('express');
const mongoose = require('mongoose');
const { requireProductionDatabase } = require('./utils/runtimeSafety');
const { applySecurityMiddleware, createApiLimiter, createAuthLimiter } = require('./config/security');
const authRoutes = require('./routes/auth');
const workoutPlanRoutes = require('./routes/workoutPlan');

const createApp = ({ env = process.env, connection = mongoose.connection } = {}) => {
  const app = express();
  applySecurityMiddleware(app, env);

  app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));
  app.get('/ready', (req, res) => {
    const ready = connection.readyState === 1;
    return res.status(ready ? 200 : 503).json({ status: ready ? 'ready' : 'unavailable' });
  });

  app.use('/api', createApiLimiter());
  app.use('/api/auth/login', createAuthLimiter());
  app.use('/api/auth/register', createAuthLimiter());
  app.use('/api', requireProductionDatabase(connection, env));
  app.use('/api/auth', authRoutes);
  app.use('/api/workout-plan', workoutPlanRoutes);

  app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found.' }));
  app.use((error, req, res, next) => {
    if (res.headersSent) return next(error);
    const status = Number.isInteger(error.status) ? error.status : 500;
    const message = status < 500 ? error.message : 'An unexpected server error occurred.';
    return res.status(status).json({ success: false, message });
  });

  return app;
};

module.exports = { createApp };

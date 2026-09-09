const mongoose = require('mongoose');
require('dotenv').config();
const { createApp } = require('./app');
const { isProduction, validateServerEnvironment } = require('./utils/runtimeSafety');
const { validateSecurityEnvironment } = require('./config/security');

const startServer = async (env = process.env) => {
  validateServerEnvironment(env);
  validateSecurityEnvironment(env);

  const port = Number.parseInt(env.PORT, 10) || 5000;
  const host = env.HOST || '0.0.0.0';
  let connected = false;

  try {
    await mongoose.connect(env.MONGO_URI, {
      serverSelectionTimeoutMS: 10_000,
      connectTimeoutMS: 10_000,
    });
    connected = true;
    console.log('MongoDB connection established.');
  } catch {
    if (isProduction(env)) throw new Error('Database connection failed; production server was not started.');
    console.warn('MongoDB unavailable; development server is using offline fallback mode.');
  }

  const app = createApp({ env, connection: mongoose.connection });
  const server = app.listen(port, host, () => {
    console.log(`LiftSutra backend listening on ${host}:${port}${connected ? '' : ' (offline development mode)'}.`);
  });

  const shutdown = (signal) => {
    console.log(`${signal} received; shutting down.`);
    server.close(async () => {
      if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
      process.exit(0);
    });
    setTimeout(() => process.exit(1), 10_000).unref();
  };
  process.once('SIGTERM', () => shutdown('SIGTERM'));
  process.once('SIGINT', () => shutdown('SIGINT'));
  return server;
};

if (require.main === module) {
  startServer().catch((error) => {
    console.error(error.message);
    process.exit(1);
  });
}

module.exports = { startServer };

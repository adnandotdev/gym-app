const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Initialize express app
const app = express();

// Load environment variables
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
// 1. Enable CORS for cross-origin requests from the React Native app
app.use(cors());

// 2. Parse incoming JSON requests
app.use(express.json());

// Import routes
const authRoutes = require('./routes/auth');
const workoutPlanRoutes = require('./routes/workoutPlan');

// Mount routes
// All auth endpoints will be prefixed with /api/auth
app.use('/api/auth', authRoutes);
app.use('/api/workout-plan', workoutPlanRoutes);

// Simple health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'MuscleMap backend is running.' });
});

// Connect to MongoDB Database
if (!MONGO_URI) {
  console.error('CRITICAL: MONGO_URI environment variable is missing from backend/.env');
  process.exit(1);
}

console.log('Connecting to MongoDB...');
mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('Successfully connected to MongoDB.');
    // Start Express server only after database connection is established
    app.listen(PORT, () => {
      console.log(`MuscleMap Backend running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Database connection error:', err.message);
    console.log('Server starting offline (without MongoDB connection)...');
    
    // Start the server anyway to allow checking connections/routes locally
    const server = app.listen(PORT, () => {
      console.log(`MuscleMap Backend running on port ${PORT} (Offline mode)`);
    });
    server.on('error', (e) => {
      if (e.code === 'EADDRINUSE') {
        console.log(`Port ${PORT} is already in use by another instance. Server is already running.`);
      } else {
        console.error('Server error:', e);
      }
    });
  });

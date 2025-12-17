/*jshint esversion: 8 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./models/db');
const app = express();
const port = process.env.PORT || 3060;

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const giftRoutes = require('./giftRoutes');
const searchRoutes = require('./searchRoutes');
const authRoutes = require('./routes/authRoutes');

// Use routes
app.use('/api', giftRoutes);
app.use('/api', searchRoutes);
app.use('/api/auth', authRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.send('GiftLink Backend API is running');
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is healthy' });
});

// Start server only after DB connects
const startServer = async () => {
  await connectDB();
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`MongoDB URI: ${process.env.MONGO_URI || 'Not configured'}`);
  });
};

startServer();

module.exports = app;

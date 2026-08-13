const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const express = require('express');
const cors = require('cors');
const connectDB = require('../src/config/db');

const app = express();
app.use(cors());
app.use(express.json());

// Ensure database connection for serverless function calls
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    console.error('Serverless DB connection error:', err);
    next();
  }
});

app.use('/api/auth', require('../src/routes/authRoutes'));
app.use('/api/tenants', require('../src/routes/tenantRoutes'));
app.use('/api/finance', require('../src/routes/financeRoutes'));
app.use('/api/goals', require('../src/routes/goalRoutes'));
app.use('/api/analytics', require('../src/routes/analyticsRoutes'));
app.use('/api/notifications', require('../src/routes/notificationRoutes'));
app.use('/api/blockchain', require('../src/routes/blockchainRoutes'));

app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'RiseUp Financial Manager Engine', timestamp: new Date() }));

module.exports = app;

const path = require('path');
const dotenv = require('dotenv');
// This local application is configured by server/.env. Override inherited shell
// values so a stale MONGODB_URI cannot point the app at a different cluster.
dotenv.config({ path: path.resolve(__dirname, '../.env'), override: true });

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tenants', require('./routes/tenantRoutes'));
app.use('/api/finance', require('./routes/financeRoutes'));
app.use('/api/goals', require('./routes/goalRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/blockchain', require('./routes/blockchainRoutes'));

app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'RiseUp Financial Manager Engine', timestamp: new Date() }));

const startServer = (port) => {
  const server = app.listen(port, () => console.log(`RiseUp Financial Manager Server running on port ${port}`));
  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE') console.error(`Port ${port} is already in use. Stop the existing server or choose another PORT in server/.env.`);
    else console.error('Server failed to start:', error.message);
    process.exitCode = 1;
  });
};

if (!process.env.VERCEL) {
  startServer(Number(process.env.PORT || 5000));

  connectDB().then((connected) => {
    if (!connected) console.warn('API server is running, but database-backed endpoints will return 503 until MongoDB reconnects.');
  }).catch((error) => {
    console.error('MongoDB initialization failed:', error.message);
  });
}

module.exports = app;

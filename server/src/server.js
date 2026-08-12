const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { seedDemoDataIfEmpty } = require('./controllers/authController');

const app = express();
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tenants', require('./routes/tenantRoutes'));
app.use('/api/finance', require('./routes/financeRoutes'));
app.use('/api/goals', require('./routes/goalRoutes'));
app.use('/api/analytics', require('./routes/analyticsRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/blockchain', require('./routes/blockchainRoutes'));

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'RiseUp Financial Manager Engine',
    timestamp: new Date()
  });
});

const PORT = process.env.PORT || 5000;

connectDB().then(async (connected) => {
  if (connected) {
    await seedDemoDataIfEmpty();
  }
}).catch(err => {
  console.log('Skipping MongoDB connection init:', err.message);
});

const startServer = (port) => {
  const server = app.listen(port, () => {
    console.log(`🚀 RiseUp Financial Manager Server running on port ${port}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} in use, trying port ${port + 1}...`);
      startServer(port + 1);
    }
  });
};

startServer(Number(PORT));

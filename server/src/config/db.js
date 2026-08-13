const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!uri) throw new Error('MONGODB_URI is not configured. Add a MongoDB connection string to server/.env.');

    console.log(`Connecting to MongoDB at: ${uri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')}...`);

    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000,
      family: 4
    });

    isConnected = true;
    console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host}`);
    return true;
  } catch (error) {
    isConnected = false;
    console.warn(`MongoDB connection failed: ${error.message}.`);
    return false;
  }
};

const getIsConnected = () => isConnected;

module.exports = connectDB;
module.exports.getIsConnected = getIsConnected;

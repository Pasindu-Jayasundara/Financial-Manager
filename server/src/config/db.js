const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  try {
    let uri = process.env.MONGODB_URI || process.env.MONGO_URI;

    if (!uri && process.env.MONGODB_USERNAME && process.env.MONGODB_PASSWORD) {
      uri = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@cluster0.i3eqgad.mongodb.net/riseup_db?retryWrites=true&w=majority`;
    }

    if (!uri) {
      uri = 'mongodb://127.0.0.1:27017/riseup_financial_manager';
    }

    console.log(`Connecting to MongoDB Atlas at: ${uri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')}...`);

    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      family: 4
    });

    isConnected = true;
    console.log(`✅ MongoDB Connected Successfully: ${conn.connection.host}`);
    return true;
  } catch (error) {
    isConnected = false;
    console.warn(`⚠️ MongoDB connection warning (${error.message}). Server running with fallback mock engine.`);
    return false;
  }
};

const getIsConnected = () => isConnected;

module.exports = connectDB;
module.exports.getIsConnected = getIsConnected;

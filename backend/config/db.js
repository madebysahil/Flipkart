const mongoose = require('mongoose');
const connectDB = async () => {
  try {
    let uri = process.env.MONGODB_URI;

    if (!uri || uri.includes('localhost') || uri.includes('127.0.0.1')) {
      throw new Error("No valid MONGODB_URI provided. Skipping MongoDB connection.");
    }

    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}. Server will continue running in fallback mode.`);
  }
};

module.exports = connectDB;

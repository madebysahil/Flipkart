const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

const connectDB = async () => {
  try {
    let uri = process.env.MONGODB_URI;

    // Use memory server if it's the default local one
    if (!uri || uri.includes('localhost') || uri.includes('127.0.0.1')) {
      if (process.env.NODE_ENV === 'production') {
         throw new Error("MongoMemoryServer is not supported in production. Please set MONGODB_URI");
      }
      mongoServer = await MongoMemoryServer.create();
      uri = mongoServer.getUri();
      console.log('Using in-memory MongoDB server for local development');
    }

    const conn = await mongoose.connect(uri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}. Server will continue running in fallback mode.`);
  }
};

module.exports = connectDB;

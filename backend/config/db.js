const mongoose = require('mongoose');
require('dotenv').config();  // Make sure this line is included to load .env variables

const connectDB = async () => {
  try {
    // MongoDB connection
    await mongoose.connect(process.env.MONGODB_URI); // Removed deprecated options
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  }
};

connectDB();

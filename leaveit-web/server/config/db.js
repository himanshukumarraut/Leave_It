const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');

// Load env vars from project root .env.local so the standalone server sees MONGODB_URI
dotenv.config({ path: path.join(__dirname, '..', '..', '.env.local') });

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is not defined in environment variables');
}

async function connectDB() {
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  await mongoose.connect(MONGODB_URI);
}

module.exports = { connectDB };

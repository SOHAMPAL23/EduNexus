const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      connectTimeoutMS: 30000,  // allow longer initial connection
      socketTimeoutMS: 45000,
      tls: true,                // explicitly enable TLS
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📦 Database Name: ${conn.connection.name}`);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    process.exit(1);
  }
};

mongoose.connection.on('connected', () => {
  console.log('✅ Mongoose connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ Mongoose disconnected from MongoDB (connection lost)');
});

process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('🔻 Mongoose connection closed due to app termination');
  process.exit(0);
});

module.exports = connectDB;

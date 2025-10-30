const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      connectTimeoutMS: 10000,    // reduce connection timeout
      socketTimeoutMS: 30000,     // reduce socket timeout
      serverSelectionTimeoutMS: 10000, // reduce server selection timeout
      heartbeatFrequencyMS: 1000,     // increase heartbeat frequency
      maxPoolSize: 10,               // connection pool size
      tls: false,                    // disable TLS for local connection
      family: 4                      // use IPv4
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
  console.error('Connection URI:', process.env.MONGO_URI?.replace(/\/\/[^:]+:[^@]+@/, '//<credentials>@'));
  console.error('Full error:', err.stack);
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

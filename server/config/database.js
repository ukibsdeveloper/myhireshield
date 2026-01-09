import mongoose from 'mongoose';

/**
 * MONGODB CONNECTION CONFIGURATION
 * Handles initial connection, event monitoring, and graceful shutdown.
 */
const connectDB = async () => {
  try {
    // Mongoose 7+ compatibility setting
    mongoose.set('strictQuery', false);

    const options = {
      maxPoolSize: 10, // Connection pooling for better performance
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    const conn = await mongoose.connect(process.env.MONGODB_URI, options);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📁 Database Name: ${conn.connection.name}`);

    // --- CONNECTION EVENT LISTENERS ---
    
    mongoose.connection.on('error', (err) => {
      console.error(`❌ Mongoose Connection Error: ${err}`);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('⚠️ Mongoose disconnected from MongoDB. Attempting to reconnect...');
    });

    // --- GRACEFUL SHUTDOWN HANDLERS ---
    // Closes DB connection when the server stops (Ctrl+C or System Kill)
    
    const gracefulExit = async () => {
      await mongoose.connection.close();
      console.log('👋 Mongoose connection closed gracefully.');
      process.exit(0);
    };

    process.on('SIGINT', gracefulExit);  // For Ctrl+C
    process.on('SIGTERM', gracefulExit); // For system termination (Heroku/Docker)

    return conn;
  } catch (error) {
    console.error(`❌ MongoDB Connection Failed: ${error.message}`);
    console.error('💡 Pro Tip: Check your MONGODB_URI and IP Whitelist in MongoDB Atlas.');
    process.exit(1);
  }
};

export default connectDB;
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import connectDB from '../config/database.js';
import User from '../models/User.model.js';
import Employee from '../models/Employee.model.js';
import Company from '../models/Company.model.js';
import Review from '../models/Review.model.js';
import Document from '../models/Document.model.js';
import AuditLog from '../models/AuditLog.model.js';

dotenv.config();

const run = async () => {
  try {
    console.log('🔄 Connecting to MongoDB using MONGODB_URI from .env...');
    const conn = await connectDB();

    console.log('✅ Connected. Syncing indexes for all core collections...');

    // NOTE:
    // - syncIndexes() will create any missing indexes and remove indexes
    //   that are no longer defined in your schemas.
    // - This is usually enough to fix "corrupted" index state.
    await Promise.all([
      User.syncIndexes(),
      Employee.syncIndexes(),
      Company.syncIndexes(),
      Review.syncIndexes(),
      Document.syncIndexes(),
      AuditLog.syncIndexes(),
    ]);

    console.log('✅ Index sync complete.');

    // If you ever REALLY need to drop everything and recreate from scratch,
    // uncomment the line below — but be aware it will delete ALL data.
    //
    // await conn.connection.db.dropDatabase();
    // console.log('⚠️ Database dropped. Collections will be recreated automatically on next use.');

    await mongoose.connection.close();
    console.log('✅ MongoDB connection closed. Done.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Rebuild script failed:', error);
    process.exit(1);
  }
};

run();


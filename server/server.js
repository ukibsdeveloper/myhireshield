import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// --- CONFIGURATION ---
dotenv.config();

// Get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Import database connection
import connectDB from './config/database.js';

// Import routes
import authRoutes from './routes/auth.routes.js';
import employeeRoutes from './routes/employee.routes.js';
import companyRoutes from './routes/company.routes.js';
import reviewRoutes from './routes/review.routes.js';
import documentRoutes from './routes/document.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';

// Import middleware
import { errorHandler } from './middleware/errorHandler.js';
import { notFound } from './middleware/notFound.js';

// Handle Uncaught Exceptions (Error in code outside of requests)
process.on('uncaughtException', (err) => {
  console.error('❌ UNCAUGHT EXCEPTION! Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

// Initialize express app
const app = express();

// --- MIDDLEWARES ---

// 1. Security Middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false // Development mein ease ke liye
}));

// 2. CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.PRODUCTION_URL 
    : process.env.FRONTEND_URL,
  credentials: true,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// 3. Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 4. Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// 5. Static Files Security
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- ROUTES ---

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'MyHireShield API is active',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/documents', documentRoutes);
app.use('/api/analytics', analyticsRoutes);

// --- ERROR HANDLING ---
app.use(notFound);
app.use(errorHandler);

// --- STARTUP ---

const PORT = process.env.PORT || 5000;

// Connect to DB and then start server
const startServer = async () => {
  try {
    await connectDB();
    const server = app.listen(PORT, () => {
      console.log(`
🚀 MyHireShield Server Running
📍 Environment: ${process.env.NODE_ENV}
🌐 Server: http://localhost:${PORT}
💚 Health: http://localhost:${PORT}/api/health
      `);
    });

    // Handle Unhandled Promise Rejections (e.g. DB connection issues)
    process.on('unhandledRejection', (err) => {
      console.error('❌ UNHANDLED REJECTION! Shutting down server...');
      console.error(err.name, err.message);
      server.close(() => {
        process.exit(1);
      });
    });

  } catch (error) {
    console.error(`❌ DB Connection failed: ${error.message}`);
    process.exit(1);
  }
};

startServer();
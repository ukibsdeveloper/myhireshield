import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import compression from 'compression';

// --- CONFIGURATION ---
dotenv.config();

// Get __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Force Node to use public DNS resolvers (helps in some hosting environments)
import { setServers } from 'node:dns/promises';
setServers(['1.1.1.1', '8.8.8.8']);  // Cloudflare + Google DNS
console.log('DNS servers set to public resolvers');

// Import database connection
import connectDB from './config/database.js';

// Import WebSocket service
import webSocketService from './services/websocket.js';

// Import routes
import authRoutes from './routes/auth.routes.js';
import employeeRoutes from './routes/employee.routes.js';
import companyRoutes from './routes/company.routes.js';
import reviewRoutes from './routes/review.routes.js';
import documentRoutes from './routes/document.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import auditRoutes from './routes/audit.routes.js';
import consentRoutes from './routes/consent.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import adminRoutes from './routes/admin.routes.js';

// Import middleware
import { errorHandler } from './middleware/errorHandler.js';
import { notFound } from './middleware/notFound.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import {
  requestId,
  xssSanitizer,
  securityHeaders,
  payloadValidator,
  suspiciousRequestDetector,
  ipTracker
} from './middleware/security.middleware.js';
import { csrfMiddleware, getCSRFToken, secureCookieMiddleware } from './middleware/csrf.middleware.js';

// Handle Uncaught Exceptions (Error in code outside of requests)
process.on('uncaughtException', (err) => {
  console.error('❌ UNCAUGHT EXCEPTION! Shutting down...');
  console.error(err.name, err.message);
  process.exit(1);
});

// Initialize express app
const app = express();

// ═══════════════════════════════════════════
// ██  SECURITY MIDDLEWARE STACK (ORDER MATTERS)
// ═══════════════════════════════════════════

// 1. Request ID — Unique trace ID for every request
app.use(requestId);

// 2. IP Tracking — Capture real client IP
app.use(ipTracker);
app.set('trust proxy', 1); // Trust first proxy (for reverse proxy setups)

// 3. Helmet — Industry-standard security headers
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https://cdnjs.cloudflare.com", "https://fonts.googleapis.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com", "https://cdnjs.cloudflare.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdnjs.cloudflare.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      connectSrc: ["'self'", process.env.FRONTEND_URL || 'http://localhost:3000', process.env.PRODUCTION_URL || 'https://myhireshield.com'],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'none'"],
      upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? [] : null,
    }
  },
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true
  },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  xssFilter: true,
  noSniff: true,
  ieNoOpen: true,
  dnsPrefetchControl: { allow: false },
  frameguard: { action: 'deny' },
  permittedCrossDomainPolicies: { permittedPolicies: 'none' }
}));

// 3.5. Compression — Reduce payload size (Gzip/Brotli)
app.use(compression());

// 4. Additional Security Headers
app.use(securityHeaders);

// 5. CORS — Strict origin control
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  process.env.PRODUCTION_URL,
  process.env.CORS_ORIGIN,
  'https://myhireshield.com',
  'https://www.myhireshield.com',
  'http://myhireshield.com',
  'http://www.myhireshield.com'
].filter(Boolean);

console.log('🔓 CORS Allowed Origins:', allowedOrigins);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, server-to-server)
    if (!origin) {
      console.log('✅ No origin header - allowing request');
      return callback(null, true);
    }
    if (allowedOrigins.includes(origin)) {
      console.log(`✅ CORS: Allowing origin ${origin}`);
      return callback(null, true);
    }
    console.warn(`❌ CORS: Blocked origin ${origin}`);
    return callback(new Error('CORS policy violation: Origin not allowed'), false);
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-Id', 'X-Requested-With'],
  exposedHeaders: ['X-Request-Id'],
  maxAge: 86400 // Cache preflight for 24 hours
};
app.use(cors(corsOptions));

// 6. Request Size Limits
app.use(payloadValidator);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 7. Data Sanitization — NoSQL Injection Protection
app.use(mongoSanitize({
  replaceWith: '_',
  onSanitize: ({ req, key }) => {
    console.warn(`🚨 SECURITY: NoSQL injection attempt sanitized in ${key} from IP ${req.clientIP}`);
  }
}));

// 8. XSS Sanitization — Clean malicious HTML/script
app.use(xssSanitizer);

// 9. HTTP Parameter Pollution — Prevent duplicate query params
app.use(hpp({
  whitelist: ['page', 'limit', 'sort', 'status', 'role'] // Allow these to be arrays
}));

// 10. Suspicious Request Detection
app.use(suspiciousRequestDetector);

// 11. Global API Rate Limiter
app.use('/api', apiLimiter);

// 12. Logging — Request audit trail
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan(':remote-addr - :method :url :status :response-time ms - :req[user-agent]', {
    skip: (req) => req.url === '/api/health'
  }));
}

// 13. Static Files — With security headers for uploads
app.use('/uploads', (req, res, next) => {
  // Prevent directory listing
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Content-Disposition', 'attachment');
  res.setHeader('Cache-Control', 'private, no-cache');
  next();
}, express.static(path.join(__dirname, 'uploads')));

// ═══════════════════════════════════════════
// ██  API ROUTES
// ═══════════════════════════════════════════

// Health check (unprotected)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'MyHireShield API is active',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    requestId: req.requestId,
    origin: req.get('origin') || 'No origin header',
    mongoConnected: !!process.env.MONGODB_URI
  });
});

// Diagnostic endpoint (unprotected)
app.get('/api/diagnose', (req, res) => {
  res.status(200).json({
    success: true,
    api: 'MyHireShield API',
    status: 'operational',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    frontend: {
      url: process.env.FRONTEND_URL,
      productionUrl: process.env.PRODUCTION_URL,
      corsOrigin: process.env.CORS_ORIGIN
    },
    requestInfo: {
      origin: req.get('origin') || 'No origin header',
      method: req.method,
      ip: req.clientIP || req.ip,
      userAgent: req.get('user-agent')
    },
    versions: {
      node: process.version,
      npm: 'Check package.json'
    }
  });
});

// CSRF token endpoint
app.get('/api/csrf-token', getCSRFToken);

// Mount Routes with CSRF protection
app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/reviews', csrfMiddleware, reviewRoutes);
app.use('/api/documents', csrfMiddleware, documentRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/audit', auditRoutes);
app.use('/api/consent', consentRoutes);
app.use('/api/payment', csrfMiddleware, paymentRoutes);
app.use('/api/admin', csrfMiddleware, adminRoutes);

// ═══════════════════════════════════════════
// ██  ERROR HANDLING
// ═══════════════════════════════════════════
app.use(notFound);
app.use(errorHandler);

// ═══════════════════════════════════════════
// ██  SERVER STARTUP
// ═══════════════════════════════════════════

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    const server = app.listen(PORT, () => {
      console.log(`
🚀 MyHireShield Server Running
📍 Environment: ${process.env.NODE_ENV}
🌐 Server: http://localhost:${PORT}
💚 Health: http://localhost:${PORT}/api/health
🔐 Security: Helmet + CSP + MongoSanitize + XSS + HPP + Rate Limiting
🔌 WebSocket: ws://localhost:${PORT}/ws
      `);
    });

    // Initialize WebSocket service
    webSocketService.initialize(server);

    // Graceful shutdown timeout
    server.keepAliveTimeout = 65000;
    server.headersTimeout = 66000;

    // Handle Unhandled Promise Rejections
    process.on('unhandledRejection', (err) => {
      console.error('❌ UNHANDLED REJECTION! Shutting down server...');
      console.error(err.name, err.message);
      server.close(() => {
        process.exit(1);
      });
    });

    // Graceful shutdown on SIGTERM
    process.on('SIGTERM', () => {
      console.log('👋 SIGTERM received. Shutting down gracefully...');
      server.close(() => {
        console.log('Process terminated.');
      });
    });

  } catch (error) {
    console.error(`❌ DB Connection failed: ${error.message}`);
    process.exit(1);
  }
};

startServer();
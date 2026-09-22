import 'dotenv/config';
import express, { Application } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import compression from 'compression';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';

import { config } from './config/env';
import { connectDatabase } from './config/database';
import { logger } from './utils/logger';
import { globalErrorHandler } from './middleware/errorHandler';
import { notFoundHandler } from './middleware/notFound';
import apiRoutes from './routes/index';

const app: Application = express();

// ─── Security Middleware ────────────────────────────────────────────────────
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'res.cloudinary.com', '*.cloudinary.com'],
        scriptSrc: ["'self'"],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

// ─── CORS ──────────────────────────────────────────────────────────────────
const allowedOrigins = config.CORS_ORIGINS.split(',').map((origin) => origin.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g., mobile apps, curl, Postman in dev)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS: Origin ${origin} is not allowed`));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  })
);

// ─── Global Rate Limit ──────────────────────────────────────────────────────
const globalRateLimit = rateLimit({
  windowMs: config.RATE_LIMIT_WINDOW_MS,
  max: config.RATE_LIMIT_MAX_REQUESTS,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests from this IP. Please try again later.',
    },
  },
});

app.use('/api/', globalRateLimit);

// ─── Body Parsing & Compression ────────────────────────────────────────────
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─── Sanitization ──────────────────────────────────────────────────────────
// Prevents MongoDB operator injection attacks
app.use(mongoSanitize());

// ─── HTTP Request Logging ──────────────────────────────────────────────────
if (config.NODE_ENV !== 'test') {
  app.use(
    morgan(config.NODE_ENV === 'production' ? 'combined' : 'dev', {
      stream: {
        write: (message) => logger.http(message.trim()),
      },
    })
  );
}

// ─── Trust Proxy (for Render / Vercel / Railway) ───────────────────────────
app.set('trust proxy', 1);

// ─── Health Check Root Alias ───────────────────────────────────────────
import healthRoutes from './routes/health.routes';
app.use('/health', healthRoutes);

// ─── API Routes ────────────────────────────────────────────────────────────
app.use('/api/v1', apiRoutes);

// ─── 404 & Global Error Handlers ───────────────────────────────────────────
app.use(notFoundHandler);
app.use(globalErrorHandler);

// ─── Bootstrap ────────────────────────────────────────────────────────────
async function bootstrap(): Promise<void> {
  try {
    // Connect to MongoDB
    await connectDatabase(config.MONGODB_URI);

    // Start server
    const server = app.listen(config.PORT, () => {
      logger.info(`🚀 High School Youth Club API is running`);
      logger.info(`   ├── Environment: ${config.NODE_ENV}`);
      logger.info(`   ├── Port: ${config.PORT}`);
      logger.info(`   └── API: ${config.API_BASE_URL}/api/v1`);
    });

    // Ensure default Super Admin exists (background with safe retry)
    (async () => {
      try {
        const { withDbRetry } = await import('./config/database');
        const UserProfile = (await import('./models/UserProfile.model')).default;
        const adminExists = await withDbRetry(() => UserProfile.findOne({ role: { $in: ['SUPER_ADMIN', 'ADMIN'] } }));
        if (!adminExists) {
          const bcrypt = await import('bcryptjs');
          const salt = await bcrypt.default.genSalt(10);
          const passwordHash = await bcrypt.default.hash('Admin@12345', salt);
          await withDbRetry(() =>
            UserProfile.create({
              fullName: 'High School Youth Club Admin',
              email: 'admin@highschoolyouthclub.org',
              phone: '+977 9748886690',
              role: 'SUPER_ADMIN',
              status: 'active',
              passwordHash,
              adminId: 'HSYC-ADM-000001',
              memberId: 'HSYC-ADM-000001',
              isEmailVerified: true,
              isPhoneVerified: true,
            })
          );
          logger.info('✅ Default Super Admin initialized: admin@highschoolyouthclub.org');
        }
      } catch (err: any) {
        logger.warn(`Admin initialization background check: ${err.message}`);
      }
    })();

    // Graceful shutdown handlers
    const shutdown = async (signal: string): Promise<void> => {
      logger.info(`\n${signal} received. Shutting down gracefully...`);
      server.close(async () => {
        logger.info('HTTP server closed');
        const { disconnectDatabase } = await import('./config/database');
        await disconnectDatabase();
        process.exit(0);
      });

      // Force exit if graceful shutdown takes too long
      setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    // Handle uncaught exceptions and rejections
    process.on('uncaughtException', (err) => {
      logger.error('Uncaught Exception:', err);
      process.exit(1);
    });

    process.on('unhandledRejection', (reason) => {
      logger.error('Unhandled Rejection:', reason);
      process.exit(1);
    });
  } catch (err) {
    logger.error('Failed to bootstrap server:', err);
    process.exit(1);
  }
}

if (require.main === module) {
  bootstrap();
}

export default app;

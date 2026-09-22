import mongoose from 'mongoose';
import { logger } from '../utils/logger';

let retryCount = 0;

export async function connectDatabase(mongoUri: string): Promise<void> {
  if (mongoose.connection.readyState === 1) {
    logger.info('MongoDB: Already connected');
    return;
  }

  mongoose.set('strictQuery', true);

  // Register connection event listeners once
  if (mongoose.connection.listenerCount('connected') === 0) {
    mongoose.connection.on('connected', () => {
      retryCount = 0;
      logger.info('✅ MongoDB: Connection established');
    });

    mongoose.connection.on('error', (err) => {
      logger.error(`❌ MongoDB: Connection error: ${err.message}`);
    });

    mongoose.connection.on('disconnected', () => {
      logger.warn('⚠️  MongoDB: Connection disconnected. Driver will attempt automatic reconnection.');
    });

    mongoose.connection.on('reconnected', () => {
      retryCount = 0;
      logger.info('✅ MongoDB: Reconnected successfully');
    });
  }

  await attemptConnection(mongoUri);
}

async function attemptConnection(mongoUri: string): Promise<void> {
  while (mongoose.connection.readyState !== 1) {
    try {
      await mongoose.connect(mongoUri, {
        serverSelectionTimeoutMS: 15000,
        socketTimeoutMS: 45000,
        connectTimeoutMS: 15000,
        maxPoolSize: 10,
        minPoolSize: 0,
        retryWrites: true,
        retryReads: true,
        tlsAllowInvalidHostnames: true,
      });
      retryCount = 0;
      return;
    } catch (err) {
      const error = err as Error;
      retryCount++;
      logger.error(`❌ MongoDB: Connection attempt ${retryCount} failed: ${error.message}`);
      await mongoose.disconnect().catch(() => {});
      const backoff = Math.min(1500 * Math.pow(1.3, Math.min(retryCount, 8)), 8000);
      logger.info(`MongoDB: Retrying in ${(backoff / 1000).toFixed(1)}s... (attempt ${retryCount})`);
      await delay(backoff);
    }
  }
}

export async function withDbRetry<T>(fn: () => Promise<T>, maxRetries = 3): Promise<T> {
  let lastError: any;
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (err: any) {
      lastError = err;
      const isTransient =
        err?.name === 'MongoNetworkError' ||
        err?.name === 'MongoPoolClearedError' ||
        err?.name === 'MongooseServerSelectionError' ||
        err?.message?.includes('SSL') ||
        err?.message?.includes('tlsv1 alert') ||
        err?.message?.includes('ECONNRESET') ||
        err?.message?.includes('ETIMEDOUT');
      if (isTransient && attempt < maxRetries) {
        logger.warn(`⚠️ Transient DB error (${err.message}). Retrying query (${attempt}/${maxRetries})...`);
        await delay(350 * attempt);
        continue;
      }
      throw err;
    }
  }
  throw lastError;
}

export async function disconnectDatabase(): Promise<void> {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
    logger.info('MongoDB: Connection closed');
  }
}

export function getDatabaseStatus(): { connected: boolean; readyState: number } {
  return {
    connected: mongoose.connection.readyState === 1,
    readyState: mongoose.connection.readyState,
  };
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

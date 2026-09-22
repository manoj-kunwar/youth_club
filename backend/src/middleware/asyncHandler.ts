import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

async function waitForConnection(timeoutMs = 6000): Promise<boolean> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (mongoose.connection.readyState === 1) return true;
    await new Promise((r) => setTimeout(r, 200));
  }
  return mongoose.connection.readyState === 1;
}

/**
 * Wraps async route handlers to forward errors to Express error middleware.
 * Automatically retries idempotent GET requests if a transient MongoDB connection drop occurs.
 */
export const asyncHandler =
  (fn: (req: Request, res: Response, next: NextFunction) => Promise<void | Response>) =>
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await fn(req, res, next);
    } catch (err: any) {
      const isTransientMongoError =
        err?.name === 'MongoPoolClearedError' ||
        err?.name === 'MongoNetworkError' ||
        err?.name === 'MongoServerSelectionError' ||
        (err?.message &&
          (err.message.includes('tlsv1 alert') ||
            err.message.includes('Connection pool') ||
            err.message.includes('buffering timed out')));

      if (req.method === 'GET' && isTransientMongoError && !res.headersSent) {
        for (let attempt = 1; attempt <= 2; attempt++) {
          try {
            await new Promise((r) => setTimeout(r, attempt * 400));
            await waitForConnection(6000);
            await fn(req, res, next);
            return;
          } catch (retryErr) {
            if (attempt === 2) return next(retryErr);
          }
        }
      }
      next(err);
    }
  };

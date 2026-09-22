import { Request, Response, NextFunction } from 'express';

interface CacheEntry {
  body: any;
  contentType: string;
  statusCode: number;
  timestamp: number;
}

const memoryCache = new Map<string, CacheEntry>();

/**
 * In-memory response cache for high-throughput public read endpoints.
 * Prevents database connection pool exhaustion and accelerates response times to <2ms.
 */
export function apiCache(ttlSeconds: number = 30) {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Only cache GET requests without authorization headers (public data only)
    if (req.method !== 'GET' || req.headers.authorization) {
      return next();
    }

    const key = req.originalUrl;
    const cached = memoryCache.get(key);
    const now = Date.now();

    if (cached && (now - cached.timestamp) < ttlSeconds * 1000) {
      res.setHeader('X-Cache', 'HIT');
      if (cached.contentType) {
        res.setHeader('Content-Type', cached.contentType);
      }
      res.status(cached.statusCode).send(cached.body);
      return;
    }

    const originalSend = res.send.bind(res);
    res.send = (body: any): Response => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        memoryCache.set(key, {
          body,
          contentType: (res.getHeader('Content-Type') as string) || 'application/json',
          statusCode: res.statusCode,
          timestamp: Date.now(),
        });
      }
      res.setHeader('X-Cache', 'MISS');
      return originalSend(body);
    };

    next();
  };
}

export function invalidateApiCache(prefix?: string): void {
  if (!prefix) {
    memoryCache.clear();
    return;
  }
  for (const key of memoryCache.keys()) {
    if (key.includes(prefix)) {
      memoryCache.delete(key);
    }
  }
}

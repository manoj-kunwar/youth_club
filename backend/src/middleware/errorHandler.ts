import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import mongoose from 'mongoose';
import { logger } from '../utils/logger';
import { sendError } from '../utils/apiResponse';

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: string;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number, code: string, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, AppError.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(resource = 'Resource') {
    super(`${resource} not found`, 404, 'RESOURCE_NOT_FOUND');
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'Authentication required') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Insufficient permissions') {
    super(message, 403, 'FORBIDDEN');
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 422, 'VALIDATION_ERROR');
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409, 'CONFLICT');
  }
}

export const globalErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Operational errors (AppError instances)
  if (err instanceof AppError) {
    logger.warn(`[${err.code}] ${err.message}`, {
      path: req.path,
      method: req.method,
    });
    sendError(res, err.statusCode, err.code, err.message);
    return;
  }

  // Zod validation errors
  if (err instanceof ZodError) {
    const message = err.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join('; ');
    logger.warn(`[VALIDATION_ERROR] ${message}`);
    sendError(res, 422, 'VALIDATION_ERROR', message, err.errors);
    return;
  }

  // Mongoose duplicate key error
  if ((err as NodeJS.ErrnoException).name === 'MongoServerError' && 'code' in err && (err as { code: number }).code === 11000) {
    const field = Object.keys((err as { keyValue?: Record<string, unknown> }).keyValue || {})[0] || 'field';
    sendError(res, 409, 'DUPLICATE_KEY', `A record with this ${field} already exists`);
    return;
  }

  // Mongoose CastError (invalid ObjectId)
  if (err instanceof mongoose.Error.CastError) {
    sendError(res, 400, 'INVALID_ID', `Invalid value for field: ${err.path}`);
    return;
  }

  // Mongoose ValidationError
  if (err instanceof mongoose.Error.ValidationError) {
    const message = Object.values(err.errors)
      .map((e) => e.message)
      .join('; ');
    sendError(res, 422, 'VALIDATION_ERROR', message);
    return;
  }

  // MongoDB Network / TLS Connection errors
  if (
    (err as any)?.name === 'MongoNetworkError' ||
    (err as any)?.name === 'MongoServerSelectionError' ||
    (err as any)?.name === 'MongoPoolClearedError' ||
    err.message?.includes('SSL routines') ||
    err.message?.includes('tlsv1 alert')
  ) {
    logger.error(`Database network/TLS issue: ${err.message}`);
    sendError(
      res,
      503,
      'SERVICE_UNAVAILABLE',
      'The database service is momentarily reconnecting. Please try again in a few moments.'
    );
    return;
  }

  // Unknown / programming errors — never expose stack in production
  logger.error('Unhandled error:', { error: err.message, stack: err.stack, path: req.path });
  sendError(
    res,
    500,
    'INTERNAL_SERVER_ERROR',
    process.env['NODE_ENV'] === 'production'
      ? 'An unexpected error occurred'
      : err.message
  );
};

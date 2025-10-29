import { Request, Response, NextFunction } from 'express';

export interface ErrorResponse {
  success: false;
  error: string;
  message: string;
  timestamp: string;
}

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  console.error('Error:', err);

  let statusCode = 500;
  let message = 'Internal server error';

  if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err.message === 'User not found') {
    statusCode = 404;
    message = err.message;
  } else if (err.message === 'Email already exists') {
    statusCode = 409;
    message = err.message;
  } else if (err.message.includes('validation')) {
    statusCode = 400;
    message = err.message;
  }

  const errorResponse: ErrorResponse = {
    success: false,
    error: statusCode >= 500 ? 'Internal server error' : 'Request failed',
    message,
    timestamp: new Date().toISOString()
  };

  res.status(statusCode).json(errorResponse);
};

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    error: 'Not found',
    message: `Route ${req.originalUrl} not found`,
    timestamp: new Date().toISOString()
  });
};
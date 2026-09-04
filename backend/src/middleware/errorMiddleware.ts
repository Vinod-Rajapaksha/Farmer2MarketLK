import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { errorResponse } from '../utils/apiResponse';
import { logger } from '../utils/logger';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.error(err.message, err.stack);

  if (err instanceof ZodError) {
    const formattedErrors = (err as any).errors.map((e: any) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    return res.status(400).json(errorResponse('Validation failed', formattedErrors));
  }

  if (err.name === 'ValidationError') {
    return res.status(400).json(errorResponse('Validation failed', err.message));
  }

  if (err.name === 'CastError') {
    return res.status(400).json(errorResponse('Resource not found', { id: err.value }));
  }
  
  if (err.code === 11000) {
    return res.status(409).json(errorResponse('Duplicate field value entered'));
  }

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  return res.status(statusCode).json(
    errorResponse(err.message || 'Internal Server Error', 
      process.env.NODE_ENV === 'production' ? null : err.stack
    )
  );
};

export const notFoundHandler = (req: Request, res: Response, next: NextFunction) => {
  const error = new Error(`Not Found - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

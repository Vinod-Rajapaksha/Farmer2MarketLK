import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { UserRole } from '../models/User';
import { errorResponse } from '../utils/apiResponse';

export interface AuthPayload {
  userId: string;
  role: UserRole;
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json(errorResponse('Not authorized, no token provided'));
    }

    const decoded = jwt.verify(token, env.JWT_SECRET) as AuthPayload;
    
    req.user = decoded;
    
    next();
  } catch (error) {
    return res.status(401).json(errorResponse('Not authorized, token failed'));
  }
};
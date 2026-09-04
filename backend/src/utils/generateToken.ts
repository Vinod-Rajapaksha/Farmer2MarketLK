import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { UserRole } from '../models/User';

export const generateToken = (userId: string, role: UserRole): string => {
  return jwt.sign({ userId, role }, env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

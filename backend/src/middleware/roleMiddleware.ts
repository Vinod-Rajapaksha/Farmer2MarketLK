import { Request, Response, NextFunction } from 'express';
import { UserRole } from '../models/User';
import { errorResponse } from '../utils/apiResponse';

export const roleMiddleware = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json(errorResponse('Not authorized'));
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json(errorResponse(`Forbidden: Requires one of following roles: ${roles.join(', ')}`));
    }

    next();
  };
};

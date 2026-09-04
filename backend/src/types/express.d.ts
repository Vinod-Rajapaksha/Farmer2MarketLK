import { AuthPayload } from '../middleware/authMiddleware';

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

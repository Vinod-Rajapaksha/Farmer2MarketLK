import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/authService';
import { successResponse, errorResponse } from '../utils/apiResponse';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userData = await authService.registerUser(req.body);
    res.status(201).json(successResponse('User registered successfully', userData));
  } catch (error: any) {
    if (error.message === 'User already exists') {
      res.status(409).json(errorResponse(error.message));
    } else {
      next(error);
    }
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userData = await authService.loginUser(req.body);
    res.status(200).json(successResponse('Login successful', userData));
  } catch (error: any) {
    if (error.message === 'Invalid email or password') {
      res.status(401).json(errorResponse(error.message));
    } else {
      next(error);
    }
  }
};

export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json(errorResponse('Not authorized'));
    }
    const user = await authService.getUserById(req.user.userId);
    res.status(200).json(successResponse('User fetched successfully', user));
  } catch (error) {
    next(error);
  }
};
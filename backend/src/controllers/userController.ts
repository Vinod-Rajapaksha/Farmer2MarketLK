import { Request, Response, NextFunction } from 'express';
import { User, UserRole } from '../models/User';
import { successResponse, errorResponse } from '../utils/apiResponse';

export const getProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user?.userId).select('-passwordHash');
    if (!user) {
      return res.status(404).json(errorResponse('User not found'));
    }
    res.status(200).json(successResponse('Profile fetched successfully', user));
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, phone, district } = req.body;
    const user = await User.findById(req.user?.userId);
    
    if (!user) {
      return res.status(404).json(errorResponse('User not found'));
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (district) user.district = district;

    const updatedUser = await user.save();
    
    const userObject = updatedUser.toObject();
    delete (userObject as any).passwordHash;

    res.status(200).json(successResponse('Profile updated successfully', userObject));
  } catch (error) {
    next(error);
  }
};

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find().select('-passwordHash').sort({ createdAt: -1 });
    res.status(200).json(successResponse('Users fetched successfully', users));
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json(errorResponse('User not found'));
    }

    if (user.role === UserRole.ADMIN) {
      return res.status(403).json(errorResponse('Cannot delete an admin user'));
    }

    await User.findByIdAndDelete(id);
    res.status(200).json(successResponse('User deleted successfully', null));
  } catch (error) {
    next(error);
  }
};
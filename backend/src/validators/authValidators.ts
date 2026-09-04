import { z } from 'zod';
import { UserRole } from '../models/User';

export const registerSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name is too short'),
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    phone: z.string().min(10, 'Phone number is too short'),
    district: z.string().min(2, 'District is required'),
    role: z.union([z.literal('FARMER'), z.literal('BUYER')], {
      message: 'Invalid role',
    }),
  }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
  }),
});
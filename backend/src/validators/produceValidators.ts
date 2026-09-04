import { z } from 'zod';
import { ProduceStatus } from '../models/Produce';

export const createProduceSchema = z.object({
  body: z.object({
    name: z.string().min(2, 'Name is required'),
    category: z.string().min(2, 'Category is required'),
    quantity: z.preprocess((val) => Number(val), z.number().min(0.1, 'Quantity must be greater than 0')),
    unit: z.string().min(1, 'Unit is required'),
    price: z.preprocess((val) => Number(val), z.number().min(1, 'Price must be greater than 0')),
    district: z.string().min(2, 'District is required'),
    availableDate: z.preprocess((arg) => {
      if (typeof arg === 'string' || arg instanceof Date) return new Date(arg);
    }, z.date()),
    description: z.string().optional(),
  }),
});

export const updateProduceSchema = z.object({
  body: z.object({
    name: z.string().optional(),
    category: z.string().optional(),
    quantity: z.preprocess((val) => val === undefined ? undefined : Number(val), z.number().min(0.1).optional()),
    unit: z.string().optional(),
    price: z.preprocess((val) => val === undefined ? undefined : Number(val), z.number().min(1).optional()),
    district: z.string().optional(),
    availableDate: z.preprocess((arg) => {
      if (!arg) return undefined;
      if (typeof arg === 'string' || arg instanceof Date) return new Date(arg);
    }, z.date().optional()),
    description: z.string().optional(),
  }),
});
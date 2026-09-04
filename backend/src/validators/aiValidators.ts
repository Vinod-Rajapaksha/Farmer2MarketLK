import { z } from 'zod';

export const recommendSchema = z.object({
  body: z.object({
    query: z.string().min(5, 'Query is too short. Please describe what you need in detail.'),
  }),
});

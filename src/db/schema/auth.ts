import env from '@/lib/env';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { users } from './users';

export const loginSchema = createSelectSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const authResponseSchema = z.object({
  user: createSelectSchema(users).omit({
    password: env.NODE_ENV === 'production' ? true : undefined
  }),
  token: z.string()
});

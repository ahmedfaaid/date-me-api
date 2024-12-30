import env from '@/lib/env';
import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema
} from 'drizzle-zod';
import { z } from 'zod';

const defaultNow = sql`(cast((julianday('now') - 2440587.5)*86400000 as integer))`;

export const users = sqliteTable('users', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  email: text('email', { mode: 'text' }).notNull(),
  password: text('password', { mode: 'text' }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .default(defaultNow)
    .notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .default(defaultNow)
    .$onUpdate(() => new Date())
    .notNull()
});

export const selectUsersSchema = createSelectSchema(users).omit({
  password: env.NODE_ENV === 'production' ? true : undefined
});
export const insertUsersSchema = createInsertSchema(users, {
  email: (schema) => schema.email()
}).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});
export const updateUsersSchema = createUpdateSchema(users).omit({
  id: true,
  email: true,
  createdAt: true,
  updatedAt: true,
  password: true
});

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

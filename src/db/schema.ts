import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createSelectSchema } from 'drizzle-zod';

const defaultNow = sql`(cast((julianday('now') - 2440587.5)*86400000 as integer))`

export const users = sqliteTable('users', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  name: text('name', { mode: 'text' }).notNull(),
  phone: text('phone', { mode: 'text' }).notNull(),
  email: text('email', { mode: 'text' }).notNull(),
  password: text('password', { mode: 'text' }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).default(defaultNow).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).default(defaultNow).$onUpdate(() => new Date()).notNull()
});

export const selectUsersSchema = createSelectSchema(users);

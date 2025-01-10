import env from '@/lib/env';
import { defaultNow } from '@/lib/timestamp';
import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { profiles } from './profiles';

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

export const userRelations = relations(users, ({ one }) => ({
  profile: one(profiles, {
    fields: [users.id],
    references: [profiles.userId]
  })
}));

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

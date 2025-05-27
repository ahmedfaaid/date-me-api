import { defaultNow } from '@/lib/timestamp';
import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { users } from './users';

export const stories = sqliteTable('stories', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  fileName: text('file_name', { mode: 'text' }).notNull(),
  filePath: text('file_path', { mode: 'text' }).notNull(),
  userId: integer('user_id', { mode: 'number' })
    .references(() => users.id)
    .notNull()
    .unique(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .default(defaultNow)
    .notNull()
});

export const storiesRelations = relations(stories, ({ one }) => ({
  user: one(users)
}));

export const selectStoriesSchema = createSelectSchema(stories);
export const insertStoriesSchema = createInsertSchema(stories).omit({
  id: true,
  createdAt: true
});

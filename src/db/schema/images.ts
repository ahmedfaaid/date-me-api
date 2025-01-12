import { defaultNow } from '@/lib/timestamp';
import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createInsertSchema } from 'drizzle-zod';
import { users } from './users';

export const images = sqliteTable('images', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  postedBy: integer('posted_by', { mode: 'number' })
    .references(() => users.id)
    .notNull(),
  filename: text('filename', { mode: 'text' }).notNull(),
  mimetype: text('mimetype', { mode: 'text' }).notNull(),
  path: text('path', { mode: 'text' }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .default(defaultNow)
    .notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .default(defaultNow)
    .$onUpdate(() => new Date())
    .notNull()
});

export const imageRelations = relations(images, ({ one }) => ({
  postedBy: one(users, {
    fields: [images.postedBy],
    references: [users.id]
  })
}));

export const insertImageSchema = createInsertSchema(images).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

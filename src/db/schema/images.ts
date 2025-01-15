import { defaultNow } from '@/lib/timestamp';
import { relations } from 'drizzle-orm';
import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
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

export const insertImageSchema = z
  .any()
  .refine(
    (file) =>
      ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'].includes(
        file?.type
      ),
    {
      message: 'Invalid image file type'
    }
  );
export const selectImageSchema = createSelectSchema(images);

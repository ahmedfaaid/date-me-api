import { defaultNow } from '@/lib/timestamp';
import { relations } from 'drizzle-orm';
import { integer, real, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import {
  createInsertSchema,
  createSelectSchema,
  createUpdateSchema
} from 'drizzle-zod';
import { images } from './images';
import { users } from './users';

export const profiles = sqliteTable('profiles', {
  id: integer('id', { mode: 'number' }).primaryKey({ autoIncrement: true }),
  userId: integer('user_id', { mode: 'number' })
    .references(() => users.id)
    .notNull()
    .unique(),
  name: text('name', { mode: 'text' }).notNull(),
  phone: text('phone', { mode: 'text' }).notNull(),
  profilePictureId: integer('profile_picture_id', {
    mode: 'number'
  }).references(() => images.id),
  bio: text('bio', { mode: 'text' }),
  birthDate: integer('birth_date').notNull(),
  locationLat: real('location_lat').notNull(),
  locationLon: real('location_lon').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' })
    .default(defaultNow)
    .notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .default(defaultNow)
    .$onUpdate(() => new Date())
    .notNull()
});

export const profileRelations = relations(profiles, ({ one }) => ({
  user: one(users, {
    fields: [profiles.userId],
    references: [users.id]
  }),
  profilePicture: one(images, {
    fields: [profiles.profilePictureId],
    references: [images.id]
  })
}));

export const insertProfileSchema = createInsertSchema(profiles, {
  birthDate: (schema) => schema.transform((timestamp) => new Date(timestamp))
}).omit({
  id: true,
  profilePictureId: true,
  createdAt: true,
  updatedAt: true
});
export const selectProfilesSchema = createSelectSchema(profiles);
export const updateProfileSchema = createUpdateSchema(profiles).omit({
  id: true,
  userId: true,
  createdAt: true,
  updatedAt: true
});

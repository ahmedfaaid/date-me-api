import db from '@/db';
import { stories as storiesSchema } from '@/db/schema/stories';
import {
  removeExtension,
  returnExtension,
  secondsToMilliseconds
} from '@/lib/functions';
import { CREATED, NO_CONTENT, NOT_FOUND, OK } from '@/lib/http-status-codes';
import { NOT_FOUND as NOT_FOUND_PHRASE } from '@/lib/http-status-phrases';
import { twentyFourHoursAgo } from '@/lib/timestamp';
import { AppRouteHandler } from '@/types';
import { file, write } from 'bun';
import { and, eq, gte } from 'drizzle-orm';
import path from 'node:path';
import {
  AddStoryRoute,
  DeleteStoryRoute,
  UserStoriesRoute
} from './story.route';

export const userStories: AppRouteHandler<UserStoriesRoute> = async (c) => {
  const { userId } = c.req.valid('param');

  const stories = await db.query.stories.findMany({
    where: and(
      eq(storiesSchema.userId, userId),
      gte(storiesSchema.createdAt, twentyFourHoursAgo)
    )
  });

  if (!stories)
    return c.json(
      {
        message: NOT_FOUND_PHRASE
      },
      NOT_FOUND
    );

  return c.json(stories, OK);
};

export const addStory: AppRouteHandler<AddStoryRoute> = async (c) => {
  const { userId } = c.req.valid('param');
  const { story, duration } = c.req.valid('form');

  const uploads = path.join(process.cwd(), 'src', 'uploads');

  const fileName = removeExtension(story.name);
  const ext = returnExtension(story.name);

  const playTime = secondsToMilliseconds(duration) || 5000;

  const [insertedStory] = await db
    .insert(storiesSchema)
    .values({
      fileName,
      playTime,
      filePath: `/uploads/stories/${story.name}`,
      userId
    })
    .returning();
  await write(file(`${uploads}/stories/${fileName}.${ext}`), story);

  return c.json(insertedStory, CREATED);
};

export const deleteStory: AppRouteHandler<DeleteStoryRoute> = async (c) => {
  const { userId, storyId } = c.req.valid('param');

  const story = await db.query.stories.findFirst({
    where: and(eq(storiesSchema.id, storyId), eq(storiesSchema.userId, userId))
  });

  if (!story) return c.json({ message: NOT_FOUND_PHRASE }, NOT_FOUND);

  await file(path.join(process.cwd(), 'src', story.filePath)).delete();

  const result = await db
    .delete(storiesSchema)
    .where(
      and(eq(storiesSchema.id, storyId), eq(storiesSchema.userId, userId))
    );

  if (result.rowsAffected === 0)
    return c.json(
      {
        message: NOT_FOUND_PHRASE
      },
      NOT_FOUND
    );

  return c.body(null, NO_CONTENT);
};

import db from '@/db';
import { stories as storiesSchema } from '@/db/schema/stories';
import { NOT_FOUND, OK } from '@/lib/http-status-codes';
import { NOT_FOUND as NOT_FOUND_PHRASE } from '@/lib/http-status-phrases';
import { defaultNow } from '@/lib/timestamp';
import { AppRouteHandler } from '@/types';
import { and, eq, lte } from 'drizzle-orm';
import { UserStoriesRoute } from './story.route';

export const userStories: AppRouteHandler<UserStoriesRoute> = async (c) => {
  const { userId } = c.req.valid('param');

  const stories = await db.query.stories.findMany({
    where: and(
      eq(storiesSchema.userId, userId),
      lte(storiesSchema.createdAt, defaultNow)
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

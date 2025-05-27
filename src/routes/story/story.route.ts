import { selectStoriesSchema } from '@/db/schema/stories';
import { notFoundSchema } from '@/lib/constants';
import createErrorSchema from '@/lib/create-error-schema';
import * as HttpStatusCodes from '@/lib/http-status-codes';
import jsonContent from '@/lib/json-content';
import UserIdParamsSchema from '@/lib/userId-params';
import { createRoute, z } from '@hono/zod-openapi';

export const userStories = createRoute({
  tags: ['stories'],
  method: 'get',
  path: '/stories/{userId}',
  request: {
    params: UserIdParamsSchema
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(selectStoriesSchema),
      'The requested stories'
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(UserIdParamsSchema),
      'Invalid id error'
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      'Stories were not found'
    )
  }
});

export type UserStoriesRoute = typeof userStories;

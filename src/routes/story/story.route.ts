import { insertStoriesSchema, selectStoriesSchema } from '@/db/schema/stories';
import { notFoundSchema } from '@/lib/constants';
import createErrorSchema from '@/lib/create-error-schema';
import * as HttpStatusCodes from '@/lib/http-status-codes';
import jsonContent from '@/lib/json-content';
import multipartContent from '@/lib/multipart-content';
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

export const addStory = createRoute({
  tags: ['stories'],
  method: 'post',
  path: '/stories/{userId}',
  request: {
    params: UserIdParamsSchema,
    body: multipartContent(
      z.object({
        story: insertStoriesSchema,
        duration: z.coerce.number()
      }),
      'The story to add'
    )
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      selectStoriesSchema,
      'The story to add'
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(UserIdParamsSchema),
      'Validation error(s)'
    )
  }
});

export type UserStoriesRoute = typeof userStories;
export type AddStoryRoute = typeof addStory;

import { insertStoriesSchema, selectStoriesSchema } from '@/db/schema/stories';
import { notFoundSchema } from '@/lib/constants';
import createErrorSchema from '@/lib/create-error-schema';
import DeleteStoryParamsSchema from '@/lib/delete-story-params';
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

export const deleteStory = createRoute({
  tags: ['stories'],
  method: 'delete',
  path: '/stories/{userId}/{storyId}',
  request: {
    params: DeleteStoryParamsSchema
  },
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: 'Story deleted successfully'
    },
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(DeleteStoryParamsSchema),
      'Invalid user id or story id error'
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, 'Story not found')
  }
});

export type UserStoriesRoute = typeof userStories;
export type AddStoryRoute = typeof addStory;
export type DeleteStoryRoute = typeof deleteStory;

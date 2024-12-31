import { selectProfilesSchema } from '@/db/schema';
import { notFoundSchema } from '@/lib/constants';
import createErrorSchema from '@/lib/create-error-schema';
import * as HttpStatusCodes from '@/lib/http-status-codes';
import jsonContent from '@/lib/json-content';
import UserIdParamsSchema from '@/lib/userId-params';
import { createRoute } from '@hono/zod-openapi';

export const profile = createRoute({
  tags: ['profiles'],
  method: 'get',
  path: '/profiles/{userId}',
  request: {
    params: UserIdParamsSchema
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectProfilesSchema,
      'The requested profile'
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(UserIdParamsSchema),
      'Invalid id error'
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      'Profile not found'
    )
  }
});

export type ProfileRoute = typeof profile;

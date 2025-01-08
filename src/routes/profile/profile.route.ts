import {
  insertProfileSchema,
  selectProfilesSchema
} from '@/db/schema/profiles';
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

export const createProfile = createRoute({
  tags: ['profiles'],
  method: 'post',
  path: '/profiles',
  request: {
    body: jsonContent(insertProfileSchema, 'The profile to create')
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      selectProfilesSchema,
      'The created profile'
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertProfileSchema),
      'Validation error(s)'
    )
  }
});

export type ProfileRoute = typeof profile;
export type CreateProfileRoute = typeof createProfile;

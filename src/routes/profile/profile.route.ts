import {
  insertProfileSchema,
  selectProfilesSchema,
  updateProfileSchema
} from '@/db/schema/profiles';
import { notFoundSchema } from '@/lib/constants';
import createErrorSchema from '@/lib/create-error-schema';
import * as HttpStatusCodes from '@/lib/http-status-codes';
import jsonContent from '@/lib/json-content';
import jsonContentRequired from '@/lib/json-content-required';
import multipartContent from '@/lib/multipart-content';
import UserIdParamsSchema from '@/lib/userId-params';
import { createRoute, z } from '@hono/zod-openapi';

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
    body: multipartContent(
      z.object({
        profile: z
          .string()
          .transform((str, ctx): z.infer<typeof insertProfileSchema> => {
            try {
              return JSON.parse(str);
            } catch (error) {
              ctx.addIssue({ code: 'custom', message: 'Invalid JSON' });
              return z.NEVER;
            }
          }),
        image: insertImageSchema
      }),
      'The profile to create'
    )
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

export const updateProfile = createRoute({
  tags: ['profiles'],
  method: 'patch',
  path: '/profiles/{userId}',
  request: {
    params: UserIdParamsSchema,
    body: jsonContentRequired(updateProfileSchema, 'The profile updates')
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectProfilesSchema,
      'The updated profile'
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(updateProfileSchema).or(
        createErrorSchema(UserIdParamsSchema)
      ),
      'Validation error(s)'
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      'Profile not found'
    )
  }
});

export type ProfileRoute = typeof profile;
export type CreateProfileRoute = typeof createProfile;
export type UpdateProfileRoute = typeof updateProfile;

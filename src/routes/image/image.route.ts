import { insertImageSchema, selectImageSchema } from '@/db/schema/images';
import { notFoundSchema } from '@/lib/constants';
import createErrorSchema from '@/lib/create-error-schema';
import * as HttpStatusCodes from '@/lib/http-status-codes';
import jsonContent from '@/lib/json-content';
import multipartContent from '@/lib/multipart-content';
import ProfileIdParamsSchema from '@/lib/profileId-params';
import { createRoute, z } from '@hono/zod-openapi';

export const addProfilePicture = createRoute({
  tags: ['images'],
  method: 'post',
  path: '/images/profile/{profileId}',
  request: {
    params: ProfileIdParamsSchema,
    body: multipartContent(
      z.object({
        image: insertImageSchema
      }),
      'The image to change'
    )
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      selectImageSchema,
      'The new profile picture'
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(ProfileIdParamsSchema),
      'Invalid id error'
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      'Profile not found'
    )
  }
});

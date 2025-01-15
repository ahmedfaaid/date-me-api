import { z } from '@hono/zod-openapi';

const ProfileIdParamsSchema = z.object({
  profileId: z.coerce.number().openapi({
    param: {
      name: 'profileId',
      in: 'path',
      required: true
    },
    required: ['profileId'],
    example: 321
  })
});

export default ProfileIdParamsSchema;

import { z } from '@hono/zod-openapi';

const UserIdParamsSchema = z.object({
  userId: z.coerce.number().openapi({
    param: {
      name: 'userId',
      in: 'path',
      required: true
    },
    required: ['userId'],
    example: 321
  })
});

export default UserIdParamsSchema;

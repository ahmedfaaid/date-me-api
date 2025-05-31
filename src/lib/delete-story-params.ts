import { z } from '@hono/zod-openapi';

const DeleteStoryParamsSchema = z.object({
  userId: z.coerce.number().openapi({
    param: {
      name: 'userId',
      in: 'path',
      required: true
    },
    required: ['userId'],
    example: 321
  }),
  storyId: z.coerce.number().openapi({
    param: {
      name: 'storyId',
      in: 'path',
      required: true
    },
    required: ['userId'],
    example: 456
  })
});

export default DeleteStoryParamsSchema;

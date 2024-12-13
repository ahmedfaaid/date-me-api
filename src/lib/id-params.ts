import { z } from 'zod';

const IdParamsSchema = z.object({
  id: z.coerce.number().openapi({
    param: {
      name: 'id',
      in: 'path',
      required: true
    },
    required: ['id'],
    example: 321
  }),
});

export default IdParamsSchema;

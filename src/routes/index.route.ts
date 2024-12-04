import { createRouter } from '@/lib/create-app';
import * as HttpStatusCodes from '@/lib/http-status-codes';
import jsonContent from '@/lib/json-content';
import { createRoute, z } from '@hono/zod-openapi';

const router = createRouter()
  .openapi(createRoute({
    tags: ['Index'],
    method: 'get',
    path: '/',
    responses: {
      [HttpStatusCodes.OK]: jsonContent(z.object({
        message: z.string()
      }), 'Date me index')
    }
  }),
    (c) => {
      return c.json({ message: 'Hello from Date ME' }, HttpStatusCodes.OK);
    }
  );

export default router;
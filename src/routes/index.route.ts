import { createRouter } from '@/lib/create-app';
import * as HttpStatusCodes from '@/lib/http-status-codes';
import { createRoute, z } from '@hono/zod-openapi';

const router = createRouter()
  .openapi(createRoute({
    method: 'get',
    path: '/',
    responses: {
      [HttpStatusCodes.OK]: {
        description: 'Date me index',
        content: {
          'application/json': {
            schema: z.object({
              message: z.string()
            })
          }
        }
      }
    }
  }),
    (c) => {
      return c.json({ message: 'Hello from Date ME' }, HttpStatusCodes.OK);
    }
  );

export default router;
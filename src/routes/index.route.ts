import { createRouter } from '@/lib/create-app';
import { createRoute, z } from '@hono/zod-openapi';

const router = createRouter()
  .openapi(createRoute({
    method: 'get',
    path: '/',
    responses: {
      200: {
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
    return c.json({ message: 'Hello from Date ME' });
  }
);

export default router;
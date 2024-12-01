import { OpenAPIHono } from '@hono/zod-openapi';
import { NOT_FOUND as NOT_FOUND_MESSAGE } from './lib/http-status-phrases';
import { NOT_FOUND } from './lib/http-status-codes';

const app = new OpenAPIHono();

app.notFound((c) => {
  return c.json({
    message: `${NOT_FOUND_MESSAGE} - ${c.req.path}`
  }, NOT_FOUND);
});

app.get('/', (c) => {
  return c.json({
    message: 'Hello from Date ME'
  });
});

export default app;
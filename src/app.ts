import { OpenAPIHono } from '@hono/zod-openapi';

const app = new OpenAPIHono();

app.get('/', (c) => {
  return c.json({
    message: 'Hello from Date ME'
  });
});

export default app;
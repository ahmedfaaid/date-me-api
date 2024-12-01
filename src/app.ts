import { OpenAPIHono } from '@hono/zod-openapi';
import notFound from './middlewares/not-found';
import onError from './middlewares/on-error';

const app = new OpenAPIHono();

app.notFound(notFound);

app.onError(onError)

app.get('/', (c) => {
  return c.json({
    message: 'Hello from Date ME'
  });
});

export default app;
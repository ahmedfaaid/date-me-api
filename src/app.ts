import { OpenAPIHono } from '@hono/zod-openapi';
import notFound from './middlewares/not-found';
import onError from './middlewares/on-error';
import pinoLogger from '@/middlewares/pino-logger';

const app = new OpenAPIHono();

app.notFound(notFound);
app.onError(onError);
app.use(pinoLogger());

app.get('/', (c) => {
  return c.json({
    message: 'Hello from Date ME'
  });
});

export default app;

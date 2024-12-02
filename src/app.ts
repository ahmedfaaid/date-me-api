import { OpenAPIHono } from '@hono/zod-openapi';
import notFound from './middlewares/not-found';
import onError from './middlewares/on-error';
import pinoLogger from '@/middlewares/pino-logger';
import { PinoLogger } from 'hono-pino';

type AppBindings = {
  Variables: {
    logger: PinoLogger;
  };
};

const app = new OpenAPIHono<AppBindings>();

app.notFound(notFound);
app.onError(onError);
app.use(pinoLogger());

app.get('/error', (c) => {
  c.status(422);
  c.var.logger.info('Some logs here');
  throw new Error("Man something ain't right");
});

app.get('/', (c) => {
  return c.json({
    message: 'Hello from Date ME'
  });
});

export default app;

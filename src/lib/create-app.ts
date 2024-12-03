import notFound from '@/middlewares/not-found';
import onError from '@/middlewares/on-error';
import pinoLogger from '@/middlewares/pino-logger';
import { AppBindings } from '@/types';
import { OpenAPIHono } from '@hono/zod-openapi';

export function createRouter() {
  return new OpenAPIHono<AppBindings>({
    strict: false
  });
}

export default function createApp() {
  const app = createRouter();

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

  return app;
}

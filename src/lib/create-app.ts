import notFound from '@/middlewares/not-found';
import onError from '@/middlewares/on-error';
import pinoLogger from '@/middlewares/pino-logger';
import { OpenAPIHono } from '@hono/zod-openapi';
import { PinoLogger } from 'hono-pino';

type AppBindings = {
  Variables: {
    logger: PinoLogger;
  };
};

export default function createApp() {
  const app = new OpenAPIHono<AppBindings>();

  app.notFound(notFound);
  app.onError(onError);
  app.use(pinoLogger());

  return app;
}

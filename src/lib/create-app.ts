import notFound from '@/middlewares/not-found';
import onError from '@/middlewares/on-error';
import pinoLogger from '@/middlewares/pino-logger';
import { AppBindings, AppOpenApi } from '@/types';
import { OpenAPIHono } from '@hono/zod-openapi';
import defaultHook from './default-hook';

export function createRouter() {
  return new OpenAPIHono<AppBindings>({
    strict: false,
    defaultHook
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

export function createTestApp(router: AppOpenApi) {
  const testApp = createApp();
  testApp.route('/', router);
  return testApp;
}

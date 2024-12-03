import { OpenAPIHono } from '@hono/zod-openapi';
import { PinoLogger } from 'hono-pino';

export type AppBindings = {
  Variables: {
    logger: PinoLogger;
  };
};

export type AppOpenApi = OpenAPIHono<AppBindings>;

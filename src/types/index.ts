import { OpenAPIHono, z } from '@hono/zod-openapi';
import { PinoLogger } from 'hono-pino';

export type AppBindings = {
  Variables: {
    logger: PinoLogger;
  };
};

export type AppOpenApi = OpenAPIHono<AppBindings>;

export type ZodSchema = z.ZodUnion<any> | z.AnyZodObject | z.ZodArray<z.AnyZodObject>;

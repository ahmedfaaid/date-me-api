import { OpenAPIHono } from '@hono/zod-openapi';
import { NOT_FOUND as NOT_FOUND_MESSAGE } from './lib/http-status-phrases';
import { INTERNAL_SERVER_ERROR, NOT_FOUND, OK } from './lib/http-status-codes';
import { StatusCode } from 'hono/utils/http-status';

const app = new OpenAPIHono();

app.notFound((c) => {
  return c.json({
    message: `${NOT_FOUND_MESSAGE} - ${c.req.path}`
  }, NOT_FOUND);
});

app.onError((error, c) => {
  const currentStatus = "status" in error
    ? error.status
    : c.newResponse(null).status;
  const statusCode = currentStatus !== OK
    ? (currentStatus as StatusCode)
    : INTERNAL_SERVER_ERROR;
  // eslint-disable-next-line node/prefer-global/process
  const env = process.env?.NODE_ENV;
  return c.json(
    {
      message: error.message,

      stack: env === "production"
        ? undefined
        : error.stack,
    },
    statusCode,
  );
})

app.get('/', (c) => {
  return c.json({
    message: 'Hello from Date ME'
  });
});

export default app;
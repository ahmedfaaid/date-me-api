import { INTERNAL_SERVER_ERROR, NOT_FOUND, OK } from '@/lib/http-status-codes';
import { StatusCode } from 'hono/utils/http-status';
import type { ErrorHandler } from 'hono';
import env from '@/lib/env';

const onError: ErrorHandler = (error, c) => {
  const currentStatus =
    'status' in error ? error.status : c.newResponse(null).status;
  const statusCode =
    currentStatus !== OK
      ? (currentStatus as StatusCode)
      : INTERNAL_SERVER_ERROR;
  return c.json(
    {
      message: error.message,

      stack: env.NODE_ENV === 'production' ? undefined : error.stack
    },
    statusCode
  );
};

export default onError;

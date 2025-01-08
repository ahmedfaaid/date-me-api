import { authResponseSchema, loginSchema } from '@/db/schema/auth';
import { insertUsersSchema } from '@/db/schema/users';
import createErrorSchema from '@/lib/create-error-schema';
import * as HttpStatusCodes from '@/lib/http-status-codes';
import jsonContent from '@/lib/json-content';
import jsonContentRequired from '@/lib/json-content-required';
import { createRoute } from '@hono/zod-openapi';

export const login = createRoute({
  tags: ['auth'],
  method: 'post',
  path: '/auth/login',
  request: {
    body: jsonContentRequired(loginSchema, 'Login credentials')
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(authResponseSchema, 'Login successful'),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      createErrorSchema(loginSchema),
      'Invalid credentials'
    )
  }
});

export const register = createRoute({
  tags: ['auth'],
  method: 'post',
  path: '/auth/register',
  request: {
    body: jsonContentRequired(insertUsersSchema, 'Registration details')
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      authResponseSchema,
      'Registration successful'
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertUsersSchema),
      'Validation error(s)'
    )
  }
});

export type LoginRoute = typeof login;
export type RegisterRoute = typeof register;

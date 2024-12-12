import { insertUsersSchema, selectUsersSchema } from '@/db/schema';
import * as HttpStatusCodes from '@/lib/http-status-codes';
import jsonContent from '@/lib/json-content';
import jsonContentRequired from '@/lib/json-content-required';
import { createRoute, z } from '@hono/zod-openapi';

export const users = createRoute({
  tags: ['users'],
  method: 'get',
  path: '/users',
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(selectUsersSchema),
      'List of users'
    )
  }
});

export const createUser = createRoute({
  tags: ['users'],
  method: 'post',
  path: '/users',
  request: {
    body: jsonContentRequired(insertUsersSchema, 'The user to create')
  },
  responses: {
    [HttpStatusCodes.CREATED]: jsonContent(
      selectUsersSchema,
      'The created user'
    )
  }
});

export type UsersRoute = typeof users;
export type CreateUserRoute = typeof createUser;

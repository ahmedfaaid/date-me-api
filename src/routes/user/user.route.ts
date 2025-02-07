import { insertUsersSchema, selectUsersSchema } from '@/db/schema/users';
import { notFoundSchema } from '@/lib/constants';
import createErrorSchema from '@/lib/create-error-schema';
import * as HttpStatusCodes from '@/lib/http-status-codes';
import IdParamsSchema from '@/lib/id-params';
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
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertUsersSchema),
      'The validation error(s)'
    )
  }
});

export const getOneUser = createRoute({
  tags: ['users'],
  method: 'get',
  path: '/users/{id}',
  request: {
    params: IdParamsSchema
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(selectUsersSchema, 'The requested user'),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      'Invalid id error'
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, 'User not found')
  }
});

export const deleteUser = createRoute({
  tags: ['users'],
  method: 'delete',
  path: '/users/{id}',
  request: {
    params: IdParamsSchema
  },
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: 'User deleted successfully'
    },
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(IdParamsSchema),
      'Invalid id error'
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(notFoundSchema, 'User not found')
  }
});

export type UsersRoute = typeof users;
export type CreateUserRoute = typeof createUser;
export type GetOneUserRoute = typeof getOneUser;
export type DeleteUserRoute = typeof deleteUser;

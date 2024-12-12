import { selectUsersSchema } from '@/db/schema';
import * as HttpStatusCodes from '@/lib/http-status-codes';
import jsonContent from '@/lib/json-content';
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

export type UsersRoute = typeof users;
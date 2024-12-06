import * as HttpStatusCodes from '@/lib/http-status-codes';
import jsonContent from '@/lib/json-content';
import { createRoute, z } from '@hono/zod-openapi';
import validator from 'validator';

export const users = createRoute({
  tags: ['users'],
  method: 'get',
  path: '/users',
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(z.object({
        name: z.string(),
        phone: z.string().refine(validator.isMobilePhone),
        email: z.string().email(),
        password: z.string().min(6)
      })),
      'List of users'
    )
  }
});

export type UsersRoute = typeof users;
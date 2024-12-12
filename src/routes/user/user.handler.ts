import db from '@/db';
import { AppRouteHandler } from '@/types';
import { UsersRoute } from './user.route';

export const users: AppRouteHandler<UsersRoute> = async (c) => {
  const users = await db.query.users.findMany();
  return c.json(users);
}


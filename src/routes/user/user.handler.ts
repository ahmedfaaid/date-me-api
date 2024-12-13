import db from '@/db';
import { users as usersSchema } from '@/db/schema';
import { CREATED } from '@/lib/http-status-codes';
import { AppRouteHandler } from '@/types';
import { password } from 'bun';
import { CreateUserRoute, UsersRoute } from './user.route';

export const users: AppRouteHandler<UsersRoute> = async (c) => {
  const users = await db.query.users.findMany();
  return c.json(users);
}

export const createUser: AppRouteHandler<CreateUserRoute> = async (c) => {
  const user = c.req.valid('json');
  const hashedPassword = await password.hash(user.password);
  const [insertedUser] = await db.insert(usersSchema).values({ ...user, password: hashedPassword }).returning();
  return c.json(insertedUser, CREATED);
}

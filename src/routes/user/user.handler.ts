import db from '@/db';
import { users as usersSchema } from '@/db/schema';
import { CREATED, NOT_FOUND, OK } from '@/lib/http-status-codes';
import { CreateUserRoute, GetOneUserRoute, UsersRoute } from '@/routes/user/user.route';
import { AppRouteHandler } from '@/types';
import { password } from 'bun';

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

export const getOneUser: AppRouteHandler<GetOneUserRoute> = async (c) => {
  const { id } = c.req.valid('param');
  const user = await db.query.users.findFirst({
    where(fields, operators) {
      return operators.eq(fields.id, id)
    }
  });

  if (!user) return c.json({
    message: 'User not found'
  }, NOT_FOUND)

  return c.json(user, OK)
}

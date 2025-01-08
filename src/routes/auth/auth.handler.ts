import db from '@/db';
import { users as usersSchema } from '@/db/schema/users';
import env from '@/lib/env';
import { CREATED, OK, UNAUTHORIZED } from '@/lib/http-status-codes';
import { AppRouteHandler } from '@/types';
import { password } from 'bun';
import { sign } from 'hono/jwt';
import { LoginRoute, RegisterRoute } from './auth.route';

export const loginUser: AppRouteHandler<LoginRoute> = async (c) => {
  const { email, password: plainPassword } = c.req.valid('json');

  const user = await db.query.users.findFirst({
    where(fields, operators) {
      return operators.eq(fields.email, email);
    }
  });

  if (!user || !(await password.verify(plainPassword, user.password))) {
    return c.json(
      {
        error: {
          name: 'UnauthorizedError',
          issues: []
        },
        success: false
      },
      UNAUTHORIZED
    );
  }

  const payload = {
    id: user.id,
    email: user.email,
    exp: Math.floor(Date.now() / 1000) + 5 * 24 * 60 * 60 * 1000 // 5 days from current date
  };

  const token = await sign(payload, env.JWT_SECRET);

  return c.json(
    {
      user,
      token
    },
    OK
  );
};

export const registerUser: AppRouteHandler<RegisterRoute> = async (c) => {
  const user = c.req.valid('json');
  const hashedPassword = await password.hash(user.password);
  const [insertedUser] = await db
    .insert(usersSchema)
    .values({ ...user, password: hashedPassword })
    .returning();
  const payload = {
    id: insertedUser.id,
    email: insertedUser.email,
    exp: Math.floor(Date.now() / 1000) + 5 * 24 * 60 * 60 * 1000 // 5 days from current date
  };

  const token = await sign(payload, env.JWT_SECRET);

  return c.json(
    {
      user: insertedUser,
      token
    },
    CREATED
  );
};

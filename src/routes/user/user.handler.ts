import db from '@/db';
import { users as usersSchema } from '@/db/schema/users';
import { ZOD_ERROR_CODES, ZOD_ERROR_MESSAGES } from '@/lib/constants';
import {
  CREATED,
  NO_CONTENT,
  NOT_FOUND,
  OK,
  UNPROCESSABLE_ENTITY
} from '@/lib/http-status-codes';
import { NOT_FOUND as NOT_FOUND_PHRASE } from '@/lib/http-status-phrases';
import {
  CreateUserRoute,
  DeleteUserRoute,
  GetOneUserRoute,
  UpdateUserRoute,
  UsersRoute
} from '@/routes/user/user.route';
import { AppRouteHandler } from '@/types';
import { password } from 'bun';
import { eq } from 'drizzle-orm';

export const users: AppRouteHandler<UsersRoute> = async (c) => {
  const users = await db.query.users.findMany();
  return c.json(users);
};

export const createUser: AppRouteHandler<CreateUserRoute> = async (c) => {
  const user = c.req.valid('json');
  const hashedPassword = await password.hash(user.password);
  const [insertedUser] = await db
    .insert(usersSchema)
    .values({ ...user, password: hashedPassword })
    .returning();
  return c.json(insertedUser, CREATED);
};

export const getOneUser: AppRouteHandler<GetOneUserRoute> = async (c) => {
  const { id } = c.req.valid('param');
  const user = await db.query.users.findFirst({
    where(fields, operators) {
      return operators.eq(fields.id, id);
    }
  });

  if (!user)
    return c.json(
      {
        message: NOT_FOUND_PHRASE
      },
      NOT_FOUND
    );

  return c.json(user, OK);
};

export const updateUser: AppRouteHandler<UpdateUserRoute> = async (c) => {
  const { id } = c.req.valid('param');
  const updates = c.req.valid('json');

  if (Object.keys(updates).length === 0) {
    return c.json(
      {
        success: false,
        error: {
          issues: [
            {
              code: ZOD_ERROR_CODES.INVALID_UPDATES,
              path: [],
              message: ZOD_ERROR_MESSAGES.NO_UPDATES
            }
          ],
          name: 'ZodError'
        }
      },
      UNPROCESSABLE_ENTITY
    );
  }

  const [user] = await db
    .update(usersSchema)
    .set(updates)
    .where(eq(usersSchema.id, id))
    .returning();

  if (!user)
    return c.json(
      {
        message: NOT_FOUND_PHRASE
      },
      NOT_FOUND
    );

  return c.json(user, OK);
};

export const deleteUser: AppRouteHandler<DeleteUserRoute> = async (c) => {
  const { id } = c.req.valid('param');
  const result = await db.delete(usersSchema).where(eq(usersSchema.id, id));

  if (result.rowsAffected === 0)
    return c.json(
      {
        message: NOT_FOUND_PHRASE
      },
      NOT_FOUND
    );

  return c.body(null, NO_CONTENT);
};

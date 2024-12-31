import db from '@/db';
import { NOT_FOUND, OK } from '@/lib/http-status-codes';
import { NOT_FOUND as NOT_FOUND_PHRASE } from '@/lib/http-status-phrases';
import { ProfileRoute } from '@/routes/profile/profile.route';
import { AppRouteHandler } from '@/types';

export const profile: AppRouteHandler<ProfileRoute> = async (c) => {
  const { userId } = c.req.valid('param');

  const profile = await db.query.profiles.findFirst({
    where(fields, operators) {
      return operators.eq(fields.userId, userId);
    }
  });

  if (!profile)
    return c.json(
      {
        message: NOT_FOUND_PHRASE
      },
      NOT_FOUND
    );

  return c.json(profile, OK);
};

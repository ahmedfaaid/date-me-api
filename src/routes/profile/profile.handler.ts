import db from '@/db';
import { images as imagesSchema } from '@/db/schema/images';
import { profiles as profilesSchema } from '@/db/schema/profiles';
import { ZOD_ERROR_CODES, ZOD_ERROR_MESSAGES } from '@/lib/constants';
import { removeExtension, returnExtension } from '@/lib/functions';
import {
  CREATED,
  NOT_FOUND,
  OK,
  UNPROCESSABLE_ENTITY
} from '@/lib/http-status-codes';
import { NOT_FOUND as NOT_FOUND_PHRASE } from '@/lib/http-status-phrases';
import {
  ProfileRoute,
  UpdateProfileRoute
} from '@/routes/profile/profile.route';
import { AppRouteHandler } from '@/types';
import { file, write } from 'bun';
import { eq } from 'drizzle-orm';
import path from 'node:path';

export const profile: AppRouteHandler<ProfileRoute> = async (c) => {
  const { userId } = c.req.valid('param');

  const profile = await db.query.profiles.findFirst({
    where(fields, operators) {
      return operators.eq(fields.userId, userId);
    },
    with: {
      user: true,
      profilePicture: true
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

export const createProfile = async (c: any) => {
  const { profile, image } = c.req.valid('form');
  let profilePictureId;
  let imageResult = null;

  const uploads = path.join(process.cwd(), 'src', 'uploads');

  if (image) {
    const filename = removeExtension(image.name);
    const ext = returnExtension(image.name);

    const [insertedImage] = await db
      .insert(imagesSchema)
      .values({
        filename,
        mimetype: image.type,
        path: `/uploads/${image.name}`,
        postedBy: profile.userId
      })
      .returning();
    profilePictureId = insertedImage.id;
    imageResult = insertedImage;
    await write(
      file(`${uploads}/${filename}-${profilePictureId}.${ext}`),
      image
    );
  }

  const [insertedProfile] = await db
    .insert(profilesSchema)
    .values({ ...profile, profilePictureId })
    .returning();

  return c.json({ ...insertedProfile, profilePicture: imageResult }, CREATED);
};

export const updateProfile: AppRouteHandler<UpdateProfileRoute> = async (c) => {
  const { userId } = c.req.valid('param');
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

  const validatedUpdates = Object.fromEntries(
    Object.entries(updates).filter(([key, value]) => {
      if (typeof value === 'string' && !value.trim()) return false;
      if (
        ['locationLat', 'locationLon'].includes(key) &&
        (isNaN(Number(value)) || value === null)
      )
        return false;
      if (key === 'birthDate' && (isNaN(Number(value)) || value === null))
        return false;
      return true;
    })
  );

  if (Object.keys(validatedUpdates).length === 0) {
    return c.json(
      {
        success: false,
        error: {
          issues: [
            {
              code: ZOD_ERROR_CODES.INVALID_UPDATES,
              path: [],
              message: ZOD_ERROR_MESSAGES.INVALID_UPDATES
            }
          ],
          name: 'ZodError'
        }
      },
      UNPROCESSABLE_ENTITY
    );
  }

  const [profile] = await db
    .update(profilesSchema)
    .set(validatedUpdates)
    .where(eq(profilesSchema.userId, userId))
    .returning();

  if (!profile)
    return c.json(
      {
        message: NOT_FOUND_PHRASE
      },
      NOT_FOUND
    );

  return c.json(profile, OK);
};

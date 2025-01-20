import db from '@/db';
import { images as imagesSchema } from '@/db/schema/images';
import { profiles as profilesSchema } from '@/db/schema/profiles';
import { removeExtension, returnExtension } from '@/lib/functions';
import { NO_CONTENT, NOT_FOUND, OK } from '@/lib/http-status-codes';
import { NOT_FOUND as NOT_FOUND_PHRASE } from '@/lib/http-status-phrases';
import { AppRouteHandler } from '@/types';
import { file, write } from 'bun';
import { eq } from 'drizzle-orm';
import path from 'node:path';
import {
  AddProfilePictureRoute,
  DeleteProfilePictureRoute
} from './image.route';

export const addProfilePicture: AppRouteHandler<
  AddProfilePictureRoute
> = async (c) => {
  const { profileId } = c.req.valid('param');
  const { image } = c.req.valid('form');

  const uploads = path.join(process.cwd(), 'src', 'uploads');

  const filename = removeExtension(image.name);
  const ext = returnExtension(image.name);

  const profile = await db.query.profiles.findFirst({
    where: eq(profilesSchema.id, profileId),
    with: {
      user: true,
      profilePicture: true
    }
  });

  if (!profile) {
    return c.json(
      {
        message: NOT_FOUND_PHRASE
      },
      NOT_FOUND
    );
  }

  if (profile.profilePicture) {
    await file(
      path.join(process.cwd(), 'src', profile.profilePicture.path)
    ).delete();
    await db
      .update(profilesSchema)
      .set({
        profilePictureId: null
      })
      .where(eq(profilesSchema.id, profile.id));
    await db
      .delete(imagesSchema)
      .where(eq(imagesSchema.id, profile.profilePicture.id));
  }

  const [insertedImage] = await db
    .insert(imagesSchema)
    .values({
      filename,
      mimetype: image.type,
      path: `/uploads/images/${image.name}`,
      postedBy: profile.userId
    })
    .returning();
  await write(file(`${uploads}/images/${filename}.${ext}`), image);
  await db
    .update(profilesSchema)
    .set({
      profilePictureId: insertedImage.id
    })
    .where(eq(profilesSchema.id, profile.id));

  return c.json(insertedImage, OK);
};

export const deleteProfilePicture: AppRouteHandler<
  DeleteProfilePictureRoute
> = async (c) => {
  const { profileId } = c.req.valid('param');

  const profile = await db.query.profiles.findFirst({
    where: eq(profilesSchema.id, profileId),
    with: {
      profilePicture: true
    }
  });

  if (!profile || (profile.profilePictureId || profile.profilePicture) === null)
    return c.json(
      {
        message: NOT_FOUND_PHRASE
      },
      NOT_FOUND
    );

  await file(
    path.join(process.cwd(), 'src', profile.profilePicture!.path)
  ).delete();
  await db
    .update(profilesSchema)
    .set({ profilePictureId: null })
    .where(eq(profilesSchema.id, profile.id));

  const result = await db
    .delete(imagesSchema)
    .where(eq(imagesSchema.id, profile.profilePictureId!));

  if (result.rowsAffected === 0)
    return c.json(
      {
        message: NOT_FOUND_PHRASE
      },
      NOT_FOUND
    );

  return c.body(null, NO_CONTENT);
};

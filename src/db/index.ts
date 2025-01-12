import * as auth from '@/db/schema/auth';
import * as images from '@/db/schema/images';
import * as profiles from '@/db/schema/profiles';
import * as users from '@/db/schema/users';
import env from '@/lib/env';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';

const client = createClient({
  url: env.DATABASE_URL,
  authToken: env.DATABASE_AUTH_TOKEN
});

const db = drizzle(client, {
  schema: { ...users, ...profiles, ...auth, ...images }
});

export default db;

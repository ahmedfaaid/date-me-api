import * as schema from '@/db/schema';
import env from '@/lib/env';
import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';

const client = createClient({
  url: env.DATABASE_URL,
  authToken: env.DATABASE_AUTH_TOKEN
});

const db = drizzle(client, {
  schema
});

export default db;

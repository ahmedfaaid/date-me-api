import env from '@/lib/env';
import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema',
  out: './src/db/migrations',
  dialect: 'sqlite',
  dbCredentials: {
    url: env.DATABASE_URL,
    token: env.DATABASE_AUTH_TOKEN
  }
});

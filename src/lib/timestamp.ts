import { sql } from 'drizzle-orm';

export const defaultNow = sql`(cast((julianday('now') - 2440587.5)*86400000 as integer))`;

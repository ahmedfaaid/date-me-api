import { sql } from 'drizzle-orm';

export const defaultNow = sql`(cast((julianday('now') - 2440587.5)*86400000 as integer))`;

export const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

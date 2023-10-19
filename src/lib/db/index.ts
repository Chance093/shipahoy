import { drizzle } from 'drizzle-orm/planetscale-serverless';
import { connect } from '@planetscale/database';
import { env } from '@/lib/env.mjs';

// create the connection
export const connection = connect({
  url: env.DATABASE_HOST,
});

export const db = drizzle(connection);

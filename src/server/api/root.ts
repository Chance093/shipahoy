import { createTRPCRouter } from '~/server/api/trpc';
import { balanceRouter } from './routers/balance';
import { labelGroupRouter } from './routers/labelGroup';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  balance: balanceRouter,
  labelGroup: labelGroupRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

import { computersRouter } from './computers';
import { balanceRouter } from './balance';
import { router } from '../trpc';

export const appRouter = router({
  computers: computersRouter,
  balance: balanceRouter,
});

export type AppRouter = typeof appRouter;

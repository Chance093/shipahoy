import { computersRouter } from './computers';
import { balanceRouter } from './balance';
import { labelGroupRouter } from './labelGroup';
import { router } from '../trpc';

export const appRouter = router({
  computers: computersRouter,
  balance: balanceRouter,
  labelGroup: labelGroupRouter,
});

export type AppRouter = typeof appRouter;

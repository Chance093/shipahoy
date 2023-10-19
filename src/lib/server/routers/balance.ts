import { publicProcedure, router } from '../trpc';
import { getBalance } from '@/lib/api/balance.ts/queries';

export const balanceRouter = router({
  getBalance: publicProcedure.query(async () => {
    return getBalance();
  }),
});

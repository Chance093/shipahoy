import { publicProcedure, createTRPCRouter } from '../trpc';

export const balanceRouter = createTRPCRouter({
  getBalance: publicProcedure.query(async () => {}),
});

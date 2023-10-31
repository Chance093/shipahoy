import { eq } from 'drizzle-orm';
import { protectedProcedure, createTRPCRouter } from '../trpc';
import { balance } from '~/server/db/schema';

export const balanceRouter = createTRPCRouter({
  getAmount: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.balance.findFirst({
      where: eq(balance.userId, ctx.auth.userId),
      columns: { amount: true },
    });
  }),
});

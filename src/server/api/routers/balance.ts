import { eq } from 'drizzle-orm';
import { protectedProcedure, publicProcedure, createTRPCRouter } from '../trpc';
import { balance } from '~/server/db/schema';

export const balanceRouter = createTRPCRouter({
  hello: publicProcedure.query(({ ctx }) => {
    return {
      greeting: `Hello ${ctx.auth.userId}`,
    };
  }),

  getAmount: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.balance.findFirst({
      where: eq(balance.userId, ctx.auth.userId),
      columns: { amount: true },
    });
  }),
});

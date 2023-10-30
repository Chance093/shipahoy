import { eq } from 'drizzle-orm';
import { createTRPCRouter, protectedProcedure } from '../trpc';
import { invoice } from '~/server/db/schema';

export const labelGroupRouter = createTRPCRouter({
  getShippingHistory: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.invoice.findMany({
      where: eq(invoice.userId, ctx.auth.userId),
      with: {
        labelGroup: {
          with: {
            shippingService: true,
          },
        },
      },
    });
  }),
});

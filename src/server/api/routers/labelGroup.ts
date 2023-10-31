import { eq } from 'drizzle-orm';
import { createTRPCRouter, protectedProcedure } from '../trpc';
import { labelGroup } from '~/server/db/schema';

export const labelGroupRouter = createTRPCRouter({
  getShippingHistory: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.labelGroup.findMany({
      where: eq(labelGroup.userId, ctx.auth.userId),
      columns: {
        id: true,
        totalPrice: true,
        labelCount: true,
        createdAt: true,
      },
      with: {
        shippingService: {
          columns: {
            service: true,
          },
        },
      },
    });
  }),
});

import { createTRPCRouter, protectedProcedure } from '../trpc';
import { uspsService } from '~/server/db/schema';

export const pricingRouter = createTRPCRouter({
  getUspsPricing: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.uspsService.findMany();
  }),
});

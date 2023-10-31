import { createTRPCRouter, protectedProcedure } from '../trpc';

export const pricingRouter = createTRPCRouter({
  getUspsPricing: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.uspsService.findMany();
  }),
});

import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '../trpc';
import { pricing } from '~/server/db/schema';
import { eq } from 'drizzle-orm';


export const pricingRouter = createTRPCRouter({
  getPricingByUserId: protectedProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.db.query.pricing.findFirst({
      where: eq(pricing.userId, input),
      columns: {
        zeroToFour: true,
        fourToEight: true,
        eightToFifteen: true,
        fifteenToTwentyFive: true,
        twentyFiveToThirtyFive: true,
        thirtyFiveToFortyFive: true,
        fortyFiveToFiftyFive: true,
        fiftyFiveToSixtyFive: true,
        sixtyFiveToSeventy: true,
      },
    })
  })
});

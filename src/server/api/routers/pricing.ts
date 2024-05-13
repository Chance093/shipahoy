import { z } from "zod";

import { adminProcedure, createTRPCRouter, protectedProcedure } from "../trpc";

import { pricing } from "~/server/db/schema";
import { eq } from "drizzle-orm";

export const pricingRouter = createTRPCRouter({
  getPricingByUserId: adminProcedure.input(z.string()).query(({ ctx, input }) => {
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
    });
  }),
  getPricing: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.pricing.findFirst({
      where: eq(pricing.userId, ctx.auth.userId),
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
    });
  }),
  updatePricingByUserId: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
        zeroToFour: z.string(),
        fourToEight: z.string(),
        eightToFifteen: z.string(),
        fifteenToTwentyFive: z.string(),
        twentyFiveToThirtyFive: z.string(),
        thirtyFiveToFortyFive: z.string(),
        fortyFiveToFiftyFive: z.string(),
        fiftyFiveToSixtyFive: z.string(),
        sixtyFiveToSeventy: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(pricing)
        .set({
          zeroToFour: input.zeroToFour,
          fourToEight: input.fourToEight,
          eightToFifteen: input.eightToFifteen,
          fifteenToTwentyFive: input.fifteenToTwentyFive,
          twentyFiveToThirtyFive: input.twentyFiveToThirtyFive,
          thirtyFiveToFortyFive: input.thirtyFiveToFortyFive,
          fortyFiveToFiftyFive: input.fortyFiveToFiftyFive,
          fiftyFiveToSixtyFive: input.fiftyFiveToSixtyFive,
          sixtyFiveToSeventy: input.sixtyFiveToSeventy,
        })
        .where(eq(pricing.userId, input.userId));
    }),
});

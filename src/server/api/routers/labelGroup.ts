import { eq } from "drizzle-orm";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { labelGroup } from "~/server/db/schema";
import { z } from "zod";

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

  add: protectedProcedure
    .input(
      z.object({
        shippingServiceId: z.number(),
        labelCount: z.number(),
        totalPrice: z.string(),
        pdf: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const lbgroup = await ctx.db.insert(labelGroup).values({
        userId: ctx.auth.userId,
        shippingServiceId: input.shippingServiceId,
        labelCount: input.labelCount,
        totalPrice: input.totalPrice,
        pdf: input.pdf,
      });
    }),
});

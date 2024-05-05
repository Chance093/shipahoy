import { eq } from "drizzle-orm";
import { protectedProcedure, createTRPCRouter, adminProcedure } from "../trpc";
import { balance } from "~/server/db/schema";
import { z } from "zod";

export const balanceRouter = createTRPCRouter({
  getAmount: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.balance.findFirst({
      where: eq(balance.userId, ctx.auth.userId),
      columns: { amount: true, id: true },
    });
  }),

  getAmountByUserId: adminProcedure
    .input(z.string())
    .query(({ ctx, input }) => {
      return ctx.db.query.balance.findFirst({
        where: eq(balance.userId, input),
        columns: { amount: true, id: true },
      });
    }),

  update: protectedProcedure
    .input(
      z.object({
        amount: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(balance)
        .set({
          amount: input.amount,
        })
        .where(eq(balance.userId, ctx.auth.userId));
    }),

  updateByUserId: protectedProcedure
    .input(
      z.object({
        amount: z.string(),
        userId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(balance)
        .set({
          amount: input.amount,
        })
        .where(eq(balance.userId, input.userId));
    }),
});

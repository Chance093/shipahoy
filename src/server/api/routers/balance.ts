import { eq } from "drizzle-orm";
import { protectedProcedure, createTRPCRouter } from "../trpc";
import { balance } from "~/server/db/schema";
import { z } from "zod";

export const balanceRouter = createTRPCRouter({
  getAmount: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.balance.findFirst({
      where: eq(balance.userId, ctx.auth.userId),
      columns: { amount: true },
    });
  }),

  getAmountByUserId: protectedProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.db.query.balance.findFirst({
      where: eq(balance.userId, input),
      columns: { amount: true },
    });
  }),

  add: protectedProcedure.mutation(async ({ ctx }) => {
    const existingBalance = await ctx.db.query.balance.findFirst({
      where: eq(balance.userId, ctx.auth.userId),
    });
    if (existingBalance) return;
    await ctx.db.insert(balance).values({
      userId: ctx.auth.userId,
      amount: "0.00",
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
});

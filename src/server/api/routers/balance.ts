import { eq } from "drizzle-orm";
import { protectedProcedure, createTRPCRouter, adminProcedure } from "../trpc";
import { balance } from "~/server/db/schema";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const balanceRouter = createTRPCRouter({
  getAmount: protectedProcedure.query(async ({ ctx }) => {
    const amount = await ctx.db.query.balance.findFirst({
      where: eq(balance.userId, ctx.auth.userId),
      columns: { amount: true, id: true },
    });

    if (amount === undefined) {
      throw new TRPCError({ code: "NOT_FOUND", message: "There is no balance associated with your account." });
    }

    if (amount.amount === null) {
      throw new TRPCError({ code: "NOT_FOUND", message: "Balance amount has not been set for your account." });
    }

    return amount;
  }),

  getAmountByUserId: adminProcedure.input(z.string()).query(({ ctx, input }) => {
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

  updateByUserId: adminProcedure
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

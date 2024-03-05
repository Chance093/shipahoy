import { eq } from "drizzle-orm";
import { protectedProcedure, createTRPCRouter } from "../trpc";
import { invoice } from "~/server/db/schema";
import { z } from "zod";

export const invoiceRouter = createTRPCRouter({
  getInvoices: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.invoice.findMany({
      where: eq(invoice.userId, ctx.auth.userId),
      columns: {
        id: true,
        amount: true,
        paymentMethod: true,
        createdAt: true,
      },
      with: {
        paymentStatus: {
          columns: {
            status: true,
          },
        },
      },
    });
  }),

  getInvoicesByUserId: protectedProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.db.query.invoice.findMany({
      where: eq(invoice.userId, input),
      columns: {
        id: true,
        amount: true,
        paymentMethod: true,
        createdAt: true,
      },
      with: {
        paymentStatus: {
          columns: {
            status: true,
          },
        },
      },
    });
  }),

  add: protectedProcedure
    .input(
      z.object({
        balanceId: z.number(),
        amount: z.string(),
        paymentMethod: z.string(),
        paymentStatusId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(invoice).values({
        userId: ctx.auth.userId,
        balanceId: input.balanceId,
        amount: input.amount,
        paymentMethod: input.paymentMethod,
        paymentStatusId: input.paymentStatusId,
      });
    }),
});

import { eq } from "drizzle-orm";
import { protectedProcedure, createTRPCRouter, adminProcedure } from "../trpc";
import { invoice } from "~/server/db/schema";
import { z } from "zod";

export const invoiceRouter = createTRPCRouter({
  getAllInvoices: protectedProcedure.query(({ ctx }) => {
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

  getAllInvoicesByUserId: adminProcedure.input(z.string()).query(({ ctx, input }) => {
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

  getInvoices: protectedProcedure.input(z.number()).query(({ ctx, input }) => {
    const offset = (input - 1) * 10;
    const limit = 10;
    return ctx.db.query.invoice.findMany({
      where: eq(invoice.userId, ctx.auth.userId),
      limit,
      offset,
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

  getInvoicesByUserId: adminProcedure
    .input(
      z.object({
        page: z.number(),
        userId: z.string(),
      }),
    )
    .query(({ ctx, input }) => {
      const offset = (input.page - 1) * 10;
      const limit = 10;
      return ctx.db.query.invoice.findMany({
        where: eq(invoice.userId, input.userId),
        limit,
        offset,
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

  addByUserId: adminProcedure
    .input(
      z.object({
        userId: z.string(),
        balanceId: z.number(),
        amount: z.string(),
        paymentMethod: z.string(),
        paymentStatusId: z.number(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.insert(invoice).values({
        userId: input.userId,
        balanceId: input.balanceId,
        amount: input.amount,
        paymentMethod: input.paymentMethod,
        paymentStatusId: input.paymentStatusId,
      });
    }),
});

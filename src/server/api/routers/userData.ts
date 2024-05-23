import { eq, sql } from "drizzle-orm";
import { protectedProcedure, createTRPCRouter, adminProcedure } from "../trpc";
import { userData } from "~/server/db/schema";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const userDataRouter = createTRPCRouter({
  getLabelCount: protectedProcedure.query(async ({ ctx }) => {
    const labelCount = await ctx.db.query.userData.findFirst({
      where: eq(userData.userId, ctx.auth.userId),
      columns: { labelCount: true },
    });

    if (labelCount === undefined) {
      throw new TRPCError({ code: "NOT_FOUND", message: "There is no label count associated with your account" });
    }

    return labelCount.labelCount;
  }),

  getOrderCount: protectedProcedure.query(async ({ ctx }) => {
    const orderCount = await ctx.db.query.userData.findFirst({
      where: eq(userData.userId, ctx.auth.userId),
      columns: { orderCount: true },
    });

    if (orderCount === undefined) {
      throw new TRPCError({ code: "NOT_FOUND", message: "There is no order count associated with your account" });
    }

    return orderCount.orderCount;
  }),

  getLabelAndOrderCount: protectedProcedure.query(async ({ ctx }) => {
    const labelAndOrderCount = await ctx.db.query.userData.findFirst({
      where: eq(userData.userId, ctx.auth.userId),
      columns: { labelCount: true, orderCount: true },
    });

    if (labelAndOrderCount === undefined) {
      throw new TRPCError({ code: "NOT_FOUND", message: "There is no user data associated with your account" });
    }

    return labelAndOrderCount;
  }),

  getInvoiceCount: protectedProcedure.query(async ({ ctx }) => {
    const invoiceCount = await ctx.db.query.userData.findFirst({
      where: eq(userData.userId, ctx.auth.userId),
      columns: { invoiceCount: true },
    });

    if (invoiceCount === undefined) {
      throw new TRPCError({ code: "NOT_FOUND", message: "There is no invoice count associated with your account" });
    }

    return invoiceCount.invoiceCount;
  }),

  getUserData: protectedProcedure.query(async ({ ctx }) => {
    const allUserData = await ctx.db.query.userData.findFirst({
      where: eq(userData.userId, ctx.auth.userId),
      columns: { invoiceCount: true, orderCount: true, labelCount: true },
    });

    if (allUserData === undefined) {
      throw new TRPCError({ code: "NOT_FOUND", message: "There is no user data associated with your account" });
    }

    return allUserData;
  }),

  updateOrderCount: protectedProcedure
    .input(
      z.object({
        incrementValue: z.number().positive().int(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(userData)
        .set({
          orderCount: sql`${userData.orderCount} + ${input.incrementValue}`,
        })
        .where(eq(userData.userId, ctx.auth.userId));
    }),

  updateLabelCount: protectedProcedure
    .input(
      z.object({
        incrementValue: z.number().positive().int(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(userData)
        .set({
          labelCount: sql`${userData.labelCount} + ${input.incrementValue}`,
        })
        .where(eq(userData.userId, ctx.auth.userId));
    }),

  updateOrderAndLabelCount: protectedProcedure
    .input(
      z.object({
        incrementOrderValue: z.number().positive().int(),
        incrementLabelValue: z.number().positive().int(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(userData)
        .set({
          orderCount: sql`${userData.orderCount} + ${input.incrementOrderValue}`,
          labelCount: sql`${userData.labelCount} + ${input.incrementLabelValue}`,
        })
        .where(eq(userData.userId, ctx.auth.userId));
    }),

  updateInvoiceCount: protectedProcedure
    .input(
      z.object({
        incrementValue: z.number().positive().int(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(userData)
        .set({
          invoiceCount: sql`${userData.invoiceCount} + ${input.incrementValue}`,
        })
        .where(eq(userData.userId, ctx.auth.userId));
    }),

  updateUserDataByUserId: adminProcedure
    .input(
      z.object({
        userId: z.string(),
        orderCount: z.number().positive().int(),
        labelCount: z.number().positive().int(),
        invoiceCount: z.number().positive().int(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db
        .update(userData)
        .set({
          orderCount: input.orderCount,
          labelCount: input.labelCount,
          invoiceCount: input.invoiceCount,
        })
        .where(eq(userData.userId, input.userId));
    }),
});

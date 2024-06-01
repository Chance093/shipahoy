import { desc, eq } from "drizzle-orm";
import { adminProcedure, createTRPCRouter, protectedProcedure } from "../trpc";
import { labelGroup } from "~/server/db/schema";
import { z } from "zod";

export const shippingHistoryRouter = createTRPCRouter({
  getAllShippingHistory: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.labelGroup.findMany({
      where: eq(labelGroup.userId, ctx.auth.userId),
      columns: {
        id: true,
        totalPrice: true,
        labelCount: true,
        pdfLink: true,
        csvLink: true,
        zipLink: true,
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

  getAllShippingHistoryByUserId: adminProcedure.input(z.string()).query(({ ctx, input }) => {
    return ctx.db.query.labelGroup.findMany({
      where: eq(labelGroup.userId, input),
      columns: {
        id: true,
        totalPrice: true,
        labelCount: true,
        pdfLink: true,
        csvLink: true,
        zipLink: true,
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

  getShippingHistory: protectedProcedure.input(z.number()).query(({ ctx, input }) => {
    const offset = (input - 1) * 10;
    const limit = 10;
    return ctx.db.query.labelGroup.findMany({
      where: eq(labelGroup.userId, ctx.auth.userId),
      limit,
      offset,
      orderBy: [desc(labelGroup.id)],
      columns: {
        id: true,
        totalPrice: true,
        labelCount: true,
        pdfLink: true,
        csvLink: true,
        zipLink: true,
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

  getShippingHistoryByUserId: adminProcedure
    .input(
      z.object({
        page: z.number(),
        userId: z.string(),
      }),
    )
    .query(({ ctx, input }) => {
      const offset = (input.page - 1) * 10;
      const limit = 10;
      return ctx.db.query.labelGroup.findMany({
        where: eq(labelGroup.userId, input.userId),
        limit,
        offset,
        orderBy: [desc(labelGroup.id)],
        columns: {
          id: true,
          totalPrice: true,
          labelCount: true,
          pdfLink: true,
          csvLink: true,
          zipLink: true,
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
});

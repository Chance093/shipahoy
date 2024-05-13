import { eq } from "drizzle-orm";
import { adminProcedure, createTRPCRouter, protectedProcedure } from "../trpc";
import { labelGroup } from "~/server/db/schema";
import { z } from "zod";

export const shippingHistoryRouter = createTRPCRouter({
  getShippingHistory: protectedProcedure.query(({ ctx }) => {
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

  getShippingHistoryByUserId: adminProcedure.input(z.string()).query(({ ctx, input }) => {
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
});

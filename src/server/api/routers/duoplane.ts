import { fetchDuoplaneData, updateDuoplane } from "~/lib/fetchDuoplane";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { type DuoplaneResponseHeaders, type DuoplaneState } from "~/lib/definitions";
import { TRPCError } from "@trpc/server";
import { DuoplaneAxiosClientError, DuoplaneAxiosRedirectError, DuoplaneCreateShipmentError } from "~/lib/customErrors";
import { eq } from "drizzle-orm";
import { duoplaneKey } from "~/server/db/schema";
import { z } from "zod";

export const duoplaneRouter = createTRPCRouter({
  getDuoplaneOrders: protectedProcedure.query(async ({ ctx }) => {
    try {
      // * Get duoplane key from db
      const keyPass = await ctx.db.query.duoplaneKey.findFirst({
        where: eq(duoplaneKey.userId, ctx.auth.userId),
        columns: { key: true, password: true },
      });

      // * If user doesn't have duoplane key, throw error
      if (keyPass === undefined) {
        throw new DuoplaneAxiosRedirectError("Missing Duoplane Key - This user does not have a key");
      }

      // * Fetch duoplane data using duoplane key
      const response: { data: DuoplaneState[]; headers: DuoplaneResponseHeaders } = await fetchDuoplaneData(keyPass);

      return response;
    } catch (err) {
      // * Create custom TRPC Error based on error type
      if (err instanceof DuoplaneAxiosClientError) {
        throw new TRPCError({
          message: err.message,
          code: "UNAUTHORIZED",
        });
      }
      if (err instanceof DuoplaneAxiosRedirectError) {
        throw new TRPCError({
          message: err.message,
          code: "CONFLICT",
        });
      }
      if (err instanceof Error)
        throw new TRPCError({
          message: err.message,
          code: "INTERNAL_SERVER_ERROR",
        });
    }
  }),

  createShipment: protectedProcedure
    .input(
      z.object({
        poIds: z.array(z.number()),
        payloads: z.array(
          z.object({
            shipment: z.object({
              shipper_name: z.string(),
              shipment_items_attributes: z.array(
                z.object({
                  order_item_id: z.number(),
                  quantity: z.number(),
                }),
              ),
              shipment_trackings_attributes: z.array(
                z.object({
                  tracking: z.string(),
                }),
              ),
            }),
          }),
        ),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      try {
        // * Get duoplane key from db
        const keyPass = await ctx.db.query.duoplaneKey.findFirst({
          where: eq(duoplaneKey.userId, ctx.auth.userId),
          columns: { key: true, password: true },
        });

        // * If user doesn't have duoplane key, throw error
        if (keyPass === undefined) {
          throw new DuoplaneAxiosRedirectError("Missing Duoplane Key - This user does not have a key");
        }

        // * Update duoplane with shipment tracking numbers
        await updateDuoplane(input, keyPass);
      } catch (err) {
        // * Create custom TRPC Error based on error type
        if (err instanceof DuoplaneCreateShipmentError) {
          throw new TRPCError({
            message: err.message,
            code: "NOT_IMPLEMENTED",
          });
        }
        if (err instanceof DuoplaneAxiosRedirectError) {
          throw new TRPCError({
            message: err.message,
            code: "CONFLICT",
          });
        }
        if (err instanceof Error)
          throw new TRPCError({
            message: err.message,
            code: "INTERNAL_SERVER_ERROR",
          });
      }
    }),
});

import { fetchDuoplaneData } from "~/lib/fetchDuoplane";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { type DuoplaneState } from "~/lib/definitions";
import { TRPCError } from "@trpc/server";
import { DuoplaneAxiosClientError, DuoplaneAxiosRedirectError } from "~/lib/customErrors";
import { eq } from "drizzle-orm";
import { duoplaneKey } from "~/server/db/schema";

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
      const data: DuoplaneState[] = await fetchDuoplaneData(keyPass);

      return data;
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
});

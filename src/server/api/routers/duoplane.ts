import { fetchDuoplaneData } from "~/lib/fetchDuoplane";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { type DuoplaneState } from "~/lib/definitions";
import { TRPCError } from "@trpc/server";
import { DuoplaneAxiosClientError, DuoplaneAxiosRedirectError } from "~/lib/customErrors";

export const duoplaneRouter = createTRPCRouter({
  getDuoplaneOrders: protectedProcedure.query(async () => {
    // * Fetch duoplane key from our db, if there isn't one, return error

    try {
      const data: DuoplaneState[] = await fetchDuoplaneData();

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

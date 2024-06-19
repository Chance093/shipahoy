import { fetchDuoplaneData } from "~/lib/fetchDuoplane";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { type DuoplaneState } from "~/lib/definitions";

export const duoplaneRouter = createTRPCRouter({
  getDuoplaneOrders: protectedProcedure.query(async () => {
    // * Fetch duoplane key from our db, if there isn't one, return error

    const data: DuoplaneState[] = await fetchDuoplaneData();

    return data;
  }),
});

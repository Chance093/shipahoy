import { publicProcedure, createTRPCRouter } from '../trpc';

export const labelGroupRouter = createTRPCRouter({
  getShippingHistory: publicProcedure.query(async () => {}),
});

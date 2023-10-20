import { publicProcedure, router } from '../trpc';
import { getShippingHistory } from '@/lib/api/labelGroup/queries';

export const labelGroupRouter = router({
  getShippingHistory: publicProcedure.query(async () => {
    return getShippingHistory();
  }),
});

import { eq } from 'drizzle-orm';
import { protectedProcedure, createTRPCRouter } from '../trpc';
import { invoice } from '~/server/db/schema';

export const invoiceRouter = createTRPCRouter({
  getInvoices: protectedProcedure.query(({ ctx }) => {
    return ctx.db.query.invoice.findMany({
      where: eq(invoice.userId, ctx.auth.userId),
      columns: {
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
});

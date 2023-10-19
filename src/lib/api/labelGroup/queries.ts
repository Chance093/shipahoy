import { db } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { getUserAuth } from '@/lib/auth/utils';
import { labelGroup } from '@/lib/db/schema/labelGroup';
import { invoice } from '@/lib/db/schema/invoice';
import { uspsService } from '@/lib/db/schema/labelGroup';

export const getShippingHistory = async () => {
  const { session } = await getUserAuth();
  const userId = session?.user.id;
  if (userId) {
    const shippingHistory = await db
      .select()
      .from(labelGroup)
      .where(eq(labelGroup.userId, userId))
      .innerJoin(uspsService, eq(labelGroup.uspsServiceId, uspsService.id))
      .innerJoin(invoice, eq(labelGroup.invoiceId, invoice.id));
    return shippingHistory;
  }
};

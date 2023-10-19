import { db } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { getUserAuth } from '@/lib/auth/utils';
import { balance } from '@/lib/db/schema/balance';

export const getBalance = async () => {
  const { session } = await getUserAuth();
  const userBalance = await db.select().from(balance);
  return userBalance;
};

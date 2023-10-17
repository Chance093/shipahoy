import {
  mysqlTable,
  serial,
  varchar,
  decimal,
  timestamp,
} from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';
import { invoice } from './invoice';

export const balance = mysqlTable('balance', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 200 }).notNull(),
  amount: decimal('amount', { precision: 7, scale: 2 }),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const balanceRelations = relations(balance, ({ many }) => ({
  invoice: many(invoice),
}));

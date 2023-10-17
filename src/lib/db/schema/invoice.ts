import {
  mysqlTable,
  serial,
  varchar,
  int,
  decimal,
  timestamp,
} from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';
import { balance } from './balance';

export const invoice = mysqlTable('invoice', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 200 }).notNull(),
  balanceId: int('balance_id').notNull(),
  paymentStatusId: int('payment_status_id').notNull(),
  totalPrice: decimal('total_price', { precision: 6, scale: 2 }).notNull(),
  paymentMethod: varchar('payment_method', { length: 100 }).notNull(),
  createAt: timestamp('created_at').defaultNow(),
});

export const paymentStatus = mysqlTable('payment_status', {
  id: serial('id').primaryKey(),
  status: varchar('status', { length: 8 }),
});

export const paymentStatusRelations = relations(paymentStatus, ({ many }) => ({
  invoice: many(invoice),
}));

export const invoiceRelations = relations(invoice, ({ one }) => ({
  paymentStatus: one(paymentStatus, {
    fields: [invoice.paymentStatusId],
    references: [paymentStatus.id],
  }),
  balance: one(balance, {
    fields: [invoice.balanceId],
    references: [balance.id],
  }),
}));

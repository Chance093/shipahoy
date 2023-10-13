import { createInsertSchema, createSelectSchema } from 'drizzle-zod';
import { z } from 'zod';
import { v4 as uuid } from 'uuid';
import { sql } from 'drizzle-orm';
import {
  integer,
  sqliteTable,
  text,
  real,
  blob,
} from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('user', {
  userId: text('user_id').primaryKey().default(uuid()),
  isAdmin: integer('is_admin', { mode: 'boolean' }),
  passwordHash: text('password_hash').notNull(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  company: text('company').notNull(),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

export const balance = sqliteTable('balance', {
  balanceId: text('balance_id').primaryKey().default(uuid()),
  userId: text('user_id').references(() => user.userId),
  amount: real('amount').notNull(),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

type ReceiptStatus = 'pending' | 'denied' | 'completed';

export const receipt = sqliteTable('receipt', {
  receiptId: text('receipt_id').primaryKey().default(uuid()),
  userId: text('user_id').references(() => user.userId),
  balanceId: text('balance_id').references(() => balance.balanceId),
  amount: real('amount').notNull(),
  method: text('method').notNull(),
  status: text('status').notNull().$type<ReceiptStatus>(),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

export const csv = sqliteTable('csv', {
  csvId: text('csv_id').primaryKey().default(uuid()),
  userId: text('user_id').references(() => user.userId),
  fileName: text('file_name').notNull(),
  uploadDate: text('upload_date').default(sql`CURRENT_TIMESTAMP`),
});

export const paymentMethod = sqliteTable('payment_method', {
  paymentMethodId: text('method_id').primaryKey().default(uuid()),
  userId: text('user_id').references(() => user.userId),
  isPrimary: integer('is_primary', { mode: 'boolean' }).notNull(),
  methodName: text('method_name').notNull(),
  cardNumber: integer('card_number', { mode: 'number' }).notNull(),
  last4CardNumber: integer('last_4_card_number', { mode: 'number' }).notNull(),
  cardExpiration: text('card_expiration').notNull(),
  cardSecurityCode: integer('card_security_code', { mode: 'number' }).notNull(),
  bankRouting: integer('bank_routing', { mode: 'number' }).notNull(),
  bankAccountNumber: integer('bank_account_number', {
    mode: 'number',
  }).notNull(),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

export const labelGroup = sqliteTable('label_group', {
  labelGroupId: text('label_group_id').primaryKey().default(uuid()),
  userId: text('user_id').references(() => user.userId),
  receiptId: text('receipt_id').references(() => receipt.receiptId),
  labelCount: text('label_count').notNull(),
  amount: real('amount').notNull(),
  csv: blob('csv', { mode: 'json' }),
  pdf: blob('pdf', { mode: 'json' }).notNull(),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

export const label = sqliteTable('label', {
  labelId: text('label_id').primaryKey().default(uuid()),
  labelGroupId: text('label_group_id').references(
    () => labelGroup.labelGroupId
  ),
  amount: real('amount').notNull(),
  tracking: text('tracking').notNull(),
  from_name: text('from_name').notNull(),
  from_company: text('from_company').notNull(),
  from_addressOne: text('from_address_one').notNull(),
  from_addressTwo: text('from_address_two').notNull(),
  from_zipCode: text('from_zip_code').notNull(),
  from_city: text('from_city').notNull(),
  from_state: text('from_state').notNull(),
  from_country: text('from_country').notNull(),
  from_phone: text('from_phone').notNull(),
  to_name: text('to_name').notNull(),
  to_company: text('to_company').notNull(),
  to_addressOne: text('to_address_one').notNull(),
  to_addressTwo: text('to_address_two').notNull(),
  to_zipCode: text('to_zip_code').notNull(),
  to_city: text('to_city').notNull(),
  to_state: text('to_state').notNull(),
  to_country: text('to_country').notNull(),
  to_phone: text('to_phone').notNull(),
  uspsServiceType: text('usps_service_type').notNull(),
  weight: text('weight').notNull(),
  length: text('length').notNull(),
  width: text('width').notNull(),
  height: text('height').notNull(),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

export const computers = sqliteTable('computers', {
  id: integer('id').primaryKey(),
  brand: text('brand').notNull(),
  cores: integer('cores').notNull(),
});
// Schema for CRUD - used to validate API requests
export const insertComputerSchema = createInsertSchema(computers);
export const selectComputerSchema = createSelectSchema(computers);
export const computerIdSchema = selectComputerSchema.pick({ id: true });
export const updateComputerSchema = selectComputerSchema;

export type Computer = z.infer<typeof selectComputerSchema>;
export type NewComputer = z.infer<typeof insertComputerSchema>;
export type ComputerId = z.infer<typeof computerIdSchema>['id'];

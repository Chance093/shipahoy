import { v4 as uuid } from 'uuid';
import { sql } from 'drizzle-orm';
import { integer, sqliteTable, text, real } from 'drizzle-orm/sqlite-core';

export const user = sqliteTable('user', {
  userId: text('user_id').primaryKey().default(uuid()),
  isAdmin: integer('is_admin', {mode: 'boolean'}),
  username: text('username'),
  passwordHash: text('password_hash'),
  name: text('name'),
  email: text('email'),
  company: text('company'),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

export const balance = sqliteTable('balance', {
  balanceId: text('balance_id').primaryKey().default(uuid()),
  userId: text('user_id').references(() => user.userId),
  amount: real('amount'),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

export const invoice = sqliteTable('invoice', {
  invoiceId: text('invoice_id').primaryKey().default(uuid()),
  userId: text('user_id').references(() => user.userId),
  balanceId: text('balance_id').references(() => balance.balanceId),
  amount: real('amount'),
  method: text('method'),
  status: text('status'),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

export const csv = sqliteTable('csv', {
  csvId: text('csv_id').primaryKey().default(uuid()),
  userId: text('user_id').references(() => user.userId),
  fileName: text('file_name'),
  uploadDate: text('upload_date'),
  downloadDate: text('download_date'),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

export const paymentMethod = sqliteTable('payment_method', {
  paymentMethodId: text('method_id').primaryKey().default(uuid()),
  userId: text('user_id').references(() => user.userId),
  isPrimary: integer('is_primary', { mode: 'boolean' }),
  methodName: text('method_name'),
  cardNumber: integer('card_number', { mode: 'number'}),
  cardExpiration: integer('card_expiration', { mode: 'timestamp'}),
  cardSecurityCode: integer('card_security_code', { mode: 'number'}),
  bankRouting: integer('bank_routing', { mode: 'number'}),
  bankAccountNumber: integer('bank_account_number', { mode: 'number'}),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

export const labelGroup = sqliteTable('label_group', {
  labelGroupId: text('label_group_id').primaryKey().default(uuid()),
  userId: text('user_id').references(() => user.userId),
  invoiceId: text('invoice_id').references(() => invoice.invoiceId),
  labelCount: text('label_count'),
  amount: real('amount'),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

export const label = sqliteTable('label', {
  labelId: text('label_id').primaryKey().default(uuid()),
  labelGroupId: text('label_group_id').references(() => labelGroup.labelGroupId),
  amount: real('amount').notNull(),
  tracking: text('tracking').notNull(), // problem
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
  status: text('status').notNull(),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});

export const order = sqliteTable('order', {
  orderId: text('order_id').primaryKey().default(uuid()),
  userId: text('user_id').references(() => user.userId),
  status: text('status'),
  dateCreated: text('date_created'),
  updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
  createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
});
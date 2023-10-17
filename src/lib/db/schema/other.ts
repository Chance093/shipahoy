// import { v4 as uuid } from 'uuid';
// import { sql } from 'drizzle-orm';
// import { integer, sqliteTable, text, real } from 'drizzle-orm/sqlite-core';

// export const balance = sqliteTable('balance', {
//   balanceId: text('balance_id').primaryKey().default(uuid()),
//   userId: text('user_id').notNull(),
//   amount: real('amount').notNull(),
//   updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
//   brother: text('brother').default('yo'),
// });

// export const invoice = sqliteTable('invoice', {
//   invoiceId: text('invoice_id').primaryKey().default(uuid()),
//   balanceId: text('balance_id').references(() => balance.balanceId),
//   paymentStatusId: text('payment_status_id').references(
//     () => paymentStatus.paymentStatusId
//   ),
//   userId: text('user_id').notNull(),
//   amount: real('amount').notNull(),
//   paymentMethod: text('payment_method').notNull(),
//   createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
// });

// export const paymentStatus = sqliteTable('payment_status', {
//   paymentStatusId: text('payment_status_id').primaryKey().default(uuid()),
//   status: text('status').notNull(),
// });

// export const creditCard = sqliteTable('credit_card', {
//   creditCardId: text('credit_card_id').primaryKey().default(uuid()),
//   userId: text('user_id').notNull(),
//   cardName: text('card_name').notNull(),
//   cardNumber: integer('card_number', { mode: 'number' }).notNull(),
//   last4CardNumber: integer('last_4_card_number', { mode: 'number' }).notNull(),
//   cardExpiration: text('card_expiration').notNull(),
//   cardSecurityCode: integer('card_security_code', { mode: 'number' }).notNull(),
//   updatedAt: text('updated_at').default(sql`CURRENT_TIMESTAMP`),
//   createdAt: text('created_at').default(sql`CURRENT_TIMESTAMP`),
// });

// export const labelGroup = sqliteTable('label_group', {
//   labelGroupId: text('label_group_id').primaryKey().default(uuid()),
//   userId: text('user_id').notNull(),
//   invoiceId: text('invoice_id').references(() => invoice.invoiceId),
//   labelCount: integer('label_count', { mode: 'number' }).notNull(),
//   upspServiceId: text('usps_service_type').references(
//     () => uspsService.uspsServiceId
//   ),
//   pdf: text('pdf', { mode: 'json' }).notNull(),
// });

// export const uspsService = sqliteTable('usps_service', {
//   uspsServiceId: text('usps_service_id').primaryKey().default(uuid()),
//   uspsService: text('usps_service'),
// });

// export const label = sqliteTable('label', {
//   labelId: text('label_id').primaryKey().default(uuid()),
//   labelGroupId: text('label_group_id').references(
//     () => labelGroup.labelGroupId
//   ),
//   price: real('price').notNull(),
//   tracking: text('tracking').notNull(),
// });

// export const parcel = sqliteTable('parcel', {
//   parcelId: text('parcel_id').primaryKey().default(uuid()),
//   labelId: text('label_id').references(() => label.labelId),
//   weight: integer('weight', { mode: 'number' }).notNull(),
//   length: integer('length', { mode: 'number' }).notNull(),
//   width: integer('width', { mode: 'number' }).notNull(),
//   height: integer('height', { mode: 'number' }).notNull(),
// });

// export const labelAddress = sqliteTable('label_address', {
//   labelAddressId: text('label_address_id').primaryKey().default(uuid()),
//   labelId: text('label_id').references(() => label.labelId),
//   name: text('name').notNull(),
//   isSender: integer('is_sender', { mode: 'boolean' }).notNull(),
//   company: text('company').notNull(),
//   streetOne: text('street_one').notNull(),
//   streetTwo: text('street_two').notNull(),
//   city: text('city').notNull(),
//   state: text('state').notNull(),
//   zipCode: text('zip_code').notNull(),
//   country: text('country').notNull(),
//   phoneNumber: text('phone_number').notNull(),
// });

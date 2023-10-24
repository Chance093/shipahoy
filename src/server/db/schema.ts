import {
  mysqlTable,
  serial,
  varchar,
  decimal,
  timestamp,
  uniqueIndex,
  char,
  index,
  int,
  smallint,
  customType,
  boolean,
  double,
} from 'drizzle-orm/mysql-core';

import { relations } from 'drizzle-orm';

// Balance

export const balance = mysqlTable(
  'balance',
  {
    id: serial('id').primaryKey(),
    userId: varchar('user_id', { length: 200 }).notNull(),
    amount: decimal('amount', { precision: 7, scale: 2 }),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => ({ userIdx: uniqueIndex('user_idx').on(table.userId) })
);

export const balanceRelations = relations(balance, ({ many }) => ({
  invoice: many(invoice),
}));

// Credit Card

export const creditCard = mysqlTable(
  'credit_card',
  {
    id: serial('id').primaryKey(),
    userId: varchar('user_id', { length: 200 }).notNull(),
    name: varchar('name', { length: 100 }).notNull(),
    cardAlias: varchar('card_alias', { length: 100 }),
    number: varchar('number', { length: 20 }).notNull(),
    last4Number: char('last_4_number', { length: 4 }).notNull(),
    expiration: char('expiration', { length: 5 }).notNull(),
    securityCode: char('security_code', { length: 3 }).notNull(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow(),
  },
  (table) => ({ userIdx: index('user_idx').on(table.userId) })
);

// Invoice

export const invoice = mysqlTable(
  'invoice',
  {
    id: serial('id').primaryKey(),
    userId: varchar('user_id', { length: 200 }).notNull(),
    balanceId: int('balance_id').notNull(),
    paymentStatusId: int('payment_status_id').notNull(),
    totalPrice: decimal('total_price', { precision: 6, scale: 2 }).notNull(),
    paymentMethod: varchar('payment_method', { length: 100 }).notNull(),
    createAt: timestamp('created_at').defaultNow(),
  },
  (table) => ({ userIdx: index('user_idx').on(table.userId) })
);

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
  labelGroup: one(labelGroup, {
    fields: [invoice.id],
    references: [labelGroup.invoiceId],
  }),
}));

// Label

export const label = mysqlTable('label', {
  id: serial('id').primaryKey(),
  labelGroupId: int('label_group_id').notNull(),
  uspsServiceId: int('usps_service_id'),
  uspsExternalServiceId: int('usps_external_service_id'),
  price: decimal('price', { precision: 4, scale: 2 }).notNull(),
  tracking: varchar('tracking', { length: 24 }),
});

export const labelAddress = mysqlTable('label_address', {
  id: serial('id').primaryKey(),
  labelId: int('label_id').notNull(),
  isSender: boolean('is_sender').notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  company: varchar('company', { length: 100 }).notNull(),
  streetOne: varchar('street_one', { length: 100 }).notNull(),
  streetTwo: varchar('street_two', { length: 100 }).notNull(),
  city: varchar('city', { length: 100 }).notNull(),
  state: char('state', { length: 2 }).notNull(),
  zipCode: varchar('zip_code', { length: 10 }).notNull(),
  country: varchar('country', { length: 56 }).notNull(),
  phoneNumber: varchar('phone_number', { length: 15 }).notNull(),
});

export const parcel = mysqlTable('parcel', {
  id: serial('id').primaryKey(),
  labelId: int('label_id').notNull(),
  weight: double('weight').notNull(),
  length: double('length').notNull(),
  width: double('width').notNull(),
  height: double('height').notNull(),
});

export const uspsService = mysqlTable('usps_service', {
  id: serial('id').primaryKey(),
  service: varchar('service', { length: 24 }).notNull(),
  price: decimal('price', { precision: 4, scale: 2 }).notNull(),
});

export const uspsExternalService = mysqlTable('usps_external_service', {
  id: serial('id').primaryKey(),
  service: varchar('service', { length: 29 }).notNull(),
  price: decimal('price', { precision: 4, scale: 2 }).notNull(),
});

export const labelRelations = relations(label, ({ one, many }) => ({
  labelAddress: many(labelAddress),
  parcel: one(parcel, {
    fields: [label.id],
    references: [parcel.labelId],
  }),
  labelGroup: one(labelGroup, {
    fields: [label.labelGroupId],
    references: [labelGroup.id],
  }),
  uspsService: one(uspsService, {
    fields: [label.uspsServiceId],
    references: [uspsService.id],
  }),
  uspsExternalService: one(uspsExternalService, {
    fields: [label.uspsExternalServiceId],
    references: [uspsExternalService.id],
  }),
}));

export const labelAddressRelations = relations(labelAddress, ({ one }) => ({
  label: one(label, {
    fields: [labelAddress.labelId],
    references: [label.id],
  }),
}));

export const uspsServiceRelations = relations(uspsService, ({ many }) => ({
  label: many(label),
}));

export const uspsExternalServiceRelations = relations(
  uspsExternalService,
  ({ many }) => ({
    label: many(label),
  })
);

// Label Group

const customBlob = customType<{ data: Blob }>({
  dataType() {
    return `blob`;
  },
});

export const labelGroup = mysqlTable(
  'label_group',
  {
    id: serial('id').primaryKey(),
    userId: varchar('user_id', { length: 200 }).notNull(),
    invoiceId: int('invoice_id').notNull(),
    shippingServiceId: int('shipping_service_id').notNull(),
    labelCount: smallint('label_count').notNull(),
    pdf: customBlob('pdf').notNull(),
  },
  (table) => ({ userIdx: index('user_idx').on(table.userId) })
);

export const shippingService = mysqlTable('shipping_service', {
  id: serial('id').primaryKey(),
  service: varchar('service', { length: 24 }).notNull(),
});

export const shippingServiceRelations = relations(
  shippingService,
  ({ many }) => ({
    labelGroup: many(labelGroup),
  })
);

export const labelGroupRelations = relations(labelGroup, ({ one, many }) => ({
  shippingService: one(shippingService, {
    fields: [labelGroup.shippingServiceId],
    references: [shippingService.id],
  }),
  label: many(label),
}));

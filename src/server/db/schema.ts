import { mysqlTable, serial, varchar, decimal, timestamp, uniqueIndex, char, index, int, smallint, boolean, double } from "drizzle-orm/mysql-core";

import { relations } from "drizzle-orm";

// Balance

export const balance = mysqlTable(
  "balance",
  {
    id: serial("id").primaryKey(),
    userId: varchar("user_id", { length: 200 }).notNull(),
    amount: decimal("amount", { precision: 7, scale: 2 }),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => ({ userIdx: uniqueIndex("user_idx").on(table.userId) }),
);

export const balanceRelations = relations(balance, ({ many }) => ({
  invoice: many(invoice),
}));

// Credit Card

export const creditCard = mysqlTable(
  "credit_card",
  {
    id: serial("id").primaryKey(),
    userId: varchar("user_id", { length: 200 }).notNull(),
    name: varchar("name", { length: 100 }).notNull(),
    cardAlias: varchar("card_alias", { length: 100 }),
    number: varchar("number", { length: 20 }).notNull(),
    last4Number: char("last_4_number", { length: 4 }).notNull(),
    expiration: char("expiration", { length: 5 }).notNull(),
    securityCode: char("security_code", { length: 3 }).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
  },
  (table) => ({ userIdx: index("user_idx").on(table.userId) }),
);

// Invoice

export const invoice = mysqlTable(
  "invoice",
  {
    id: serial("id").primaryKey(),
    userId: varchar("user_id", { length: 200 }).notNull(),
    balanceId: int("balance_id").notNull(),
    amount: decimal("amount", { precision: 6, scale: 2 }).notNull(),
    paymentMethod: varchar("payment_method", { length: 50 }).notNull(),
    paymentStatusId: int("payment_status_id").notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({ userIdx: index("user_idx").on(table.userId) }),
);

export const pricing = mysqlTable("pricing", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 200 }).notNull(),
  zeroToFour: decimal("0-4", { precision: 4, scale: 2 }).default("7.00").notNull(),
  fourToEight: decimal("4-8", { precision: 4, scale: 2 }).default("9.00").notNull(),
  eightToFifteen: decimal("8-15", { precision: 4, scale: 2 }).default("14.00").notNull(),
  fifteenToTwentyFive: decimal("15-25", { precision: 4, scale: 2 }).default("18.00").notNull(),
  twentyFiveToThirtyFive: decimal("25-35", { precision: 4, scale: 2 }).default("22.00").notNull(),
  thirtyFiveToFortyFive: decimal("35-45", { precision: 4, scale: 2 }).default("26.00").notNull(),
  fortyFiveToFiftyFive: decimal("45-55", { precision: 4, scale: 2 }).default("28.00").notNull(),
  fiftyFiveToSixtyFive: decimal("55-65", { precision: 4, scale: 2 }).default("30.00").notNull(),
  sixtyFiveToSeventy: decimal("65-70", { precision: 4, scale: 2 }).default("32.00").notNull(),
});

export const paymentStatus = mysqlTable("payment_status", {
  id: serial("id").primaryKey(),
  status: varchar("status", { length: 8 }),
});

export const paymentStatusRelations = relations(paymentStatus, ({ many }) => ({
  invoice: many(invoice),
}));

export const invoiceRelations = relations(invoice, ({ one }) => ({
  balance: one(balance, {
    fields: [invoice.balanceId],
    references: [balance.id],
  }),
  paymentStatus: one(paymentStatus, {
    fields: [invoice.paymentStatusId],
    references: [paymentStatus.id],
  }),
}));

// Label

export const label = mysqlTable("label", {
  id: serial("id").primaryKey(),
  labelGroupId: int("label_group_id").notNull(),
  uspsServiceId: int("usps_service_id"),
  uspsExternalServiceId: int("usps_external_service_id"),
  reference: varchar("reference", { length: 60 }),
  price: decimal("price", { precision: 4, scale: 2 }),
  tracking: varchar("tracking", { length: 40 }),
});

export const labelAddress = mysqlTable("label_address", {
  id: serial("id").primaryKey(),
  labelId: int("label_id").notNull(),
  isSender: boolean("is_sender").notNull(),
  name: varchar("name", { length: 100 }).notNull(),
  company: varchar("company", { length: 100 }),
  streetOne: varchar("street_one", { length: 100 }).notNull(),
  streetTwo: varchar("street_two", { length: 100 }).notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  state: char("state", { length: 20 }).notNull(),
  zipCode: varchar("zip_code", { length: 10 }).notNull(),
  country: varchar("country", { length: 56 }).notNull(),
  phoneNumber: varchar("phone_number", { length: 30 }),
});

export const parcel = mysqlTable("parcel", {
  id: serial("id").primaryKey(),
  labelId: int("label_id").notNull(),
  weight: double("weight").notNull(),
  length: double("length").notNull(),
  width: double("width").notNull(),
  height: double("height").notNull(),
});

export const uspsService = mysqlTable("usps_service", {
  id: serial("id").primaryKey(),
  service: varchar("service", { length: 50 }).notNull(),
  price: decimal("price", { precision: 4, scale: 2 }).notNull(),
});

export const uspsExternalService = mysqlTable("usps_external_service", {
  id: serial("id").primaryKey(),
  service: varchar("service", { length: 50 }).notNull(),
  price: decimal("price", { precision: 4, scale: 2 }).notNull(),
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

export const uspsExternalServiceRelations = relations(uspsExternalService, ({ many }) => ({
  label: many(label),
}));

// Label Group

export const labelGroup = mysqlTable(
  "label_group",
  {
    id: serial("id").primaryKey(),
    userId: varchar("user_id", { length: 200 }).notNull(),
    shippingServiceId: int("shipping_service_id").notNull(),
    labelCount: smallint("label_count").notNull(),
    totalPrice: decimal("total_price", { precision: 6, scale: 2 }).notNull(),
    pdfLink: varchar("pdf", { length: 250 }).notNull(),
    csvLink: varchar("csv", { length: 250 }).notNull(),
    zipLink: varchar("zip", { length: 250 }).notNull(),
    createdAt: timestamp("created_at").defaultNow(),
  },
  (table) => ({ userIdx: index("user_idx").on(table.userId) }),
);

export const shippingService = mysqlTable("shipping_service", {
  id: serial("id").primaryKey(),
  service: varchar("service", { length: 50 }).notNull(),
});

export const shippingServiceRelations = relations(shippingService, ({ many }) => ({
  labelGroup: many(labelGroup),
}));

export const labelGroupRelations = relations(labelGroup, ({ one, many }) => ({
  shippingService: one(shippingService, {
    fields: [labelGroup.shippingServiceId],
    references: [shippingService.id],
  }),
  label: many(label),
}));

export const userData = mysqlTable("user_data", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 200 }).notNull(),
  orderCount: int("order_count").notNull(),
  labelCount: int("label_count").notNull(),
  invoiceCount: int("invoice_count").notNull(),
});

export const duoplaneKey = mysqlTable("duoplane_key", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 200 }).notNull(),
  key: varchar("key", { length: 200 }).notNull(),
  password: varchar("password", { length: 200 }).notNull(),
});

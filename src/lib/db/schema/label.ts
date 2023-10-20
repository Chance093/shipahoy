import {
  mysqlTable,
  serial,
  varchar,
  int,
  boolean,
  decimal,
  char,
  double,
} from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';
import { labelGroup } from './labelGroup';

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

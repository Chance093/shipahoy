import {
  mysqlTable,
  serial,
  varchar,
  int,
  smallint,
  decimal,
  customType,
  index,
} from 'drizzle-orm/mysql-core';
import { relations } from 'drizzle-orm';
import { label } from './label';

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
    uspsServiceId: int('usps_service_id'),
    uspsExternalServiceId: int('usps_external_service_id'),
    labelCount: smallint('label_count').notNull(),
    pdf: customBlob('pdf').notNull(),
  },
  (table) => ({ userIdx: index('user_idx').on(table.userId) })
);

export const uspsService = mysqlTable('usps_service', {
  id: serial('id').primaryKey(),
  service: varchar('usps_service', { length: 24 }).notNull(),
  price: decimal('price', { precision: 4, scale: 2 }).notNull(),
});

export const uspsExternalService = mysqlTable('usps_external_service', {
  id: serial('id').primaryKey(),
  service: varchar('usps_service', { length: 29 }).notNull(),
  price: decimal('price', { precision: 4, scale: 2 }).notNull(),
});

export const uspsServiceRelations = relations(uspsService, ({ many }) => ({
  labelGroup: many(labelGroup),
}));

export const uspsExternalServiceRelations = relations(
  uspsExternalService,
  ({ many }) => ({
    labelGroup: many(labelGroup),
  })
);

export const labelGroupRelations = relations(labelGroup, ({ one, many }) => ({
  uspsService: one(uspsService, {
    fields: [labelGroup.uspsServiceId],
    references: [uspsService.id],
  }),
  uspsExternalService: one(uspsExternalService, {
    fields: [labelGroup.uspsExternalServiceId],
    references: [uspsExternalService.id],
  }),
  label: many(label),
}));

import {
  mysqlTable,
  serial,
  varchar,
  int,
  smallint,
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

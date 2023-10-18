import {
  mysqlTable,
  serial,
  varchar,
  char,
  timestamp,
  uniqueIndex,
} from 'drizzle-orm/mysql-core';

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
  (table) => ({ userIdx: uniqueIndex('user_idx').on(table.userId) })
);

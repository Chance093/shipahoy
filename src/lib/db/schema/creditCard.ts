import {
  mysqlTable,
  serial,
  varchar,
  char,
  timestamp,
  customType,
} from 'drizzle-orm/mysql-core';

const customCardNumber = customType<{ data: string }>({
  dataType() {
    return `char(4) AS (SUBSTRING(number, -4))`;
  },
});

export const creditCard = mysqlTable('credit_card', {
  id: serial('id').primaryKey(),
  userId: varchar('user_id', { length: 200 }).notNull(),
  name: varchar('name', { length: 100 }).notNull(),
  cardAlias: varchar('card_alias', { length: 100 }),
  number: varchar('number', { length: 20 }).notNull(),
  last4Number: customCardNumber('last_4_number').notNull(),
  expiration: char('expiration', { length: 5 }).notNull(),
  securityCode: char('security_code', { length: 3 }).notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

## Project scope

**NOTE: Any content starting with [+] is <u>NOT</u> included in the alpha deployment version**

The deployment version will have some of the following requirements:

1. Client area such that users can
   1. manage
      1. orders
      2. shipping labels
   2. add
      1. funds
      2. shipping profiles
         1. ship-from
         2. package presets; weight and dimensions
   3. upload and download CSVs
2. Admin panel such that administrators can
   1. manage
      1. client
         1. onboarding
         2. offboarding
         3. pricing
      2. shipping contract updates
   2. generate
      1. client & profit reports
      2. pricing projections

## Stack

### Front-end

[Next.js](https://nextjs.org/docs)
[TypeScript](https://www.typescriptlang.org/docs/)
[Tailwind CSS](https://tailwindcss.com/docs/installation)

### Back-end

[Next.js](https://nextjs.org/docs)
[SQLite](https://www.sqlite.org/docs.html)
[Drizzle](https://orm.drizzle.team/docs/overview)

### Additional dependencies

[tRPC](https://trpc.io/docs)
[NextAuth.js](https://next-auth.js.org/)
[Chart.js](https://www.chartjs.org/docs/latest/getting-started/installation.html)

### Payment processor

[Stripe](https://stripe.com) or [Helcim](https://helcim.com)

### Hosting

[Vercel](https://vercel.com/solutions/nextjs)

## Requirements

### Client area

Authentication on non-cached login

#### Views

##### Landing

###### Balance widget

Display current balance and CTAs to add funds or manage payment settings

###### [+] Orders display

Refresh (ShipStation API) orders and optionally filter based on:

- inbound
- cancelled
- outbound
- fulfilled

###### Contact modal

For submitting a ticket or requesting support

##### Shipping labels

Create individual labels via form or create multiple labels using batch [[#Upload]]

[+] Paste US address & autofill form fields for individual labels

###### Validation

Weight: 0 > weight <= 69.9lbs

Dimensions: length + girth < 108"

##### Balance

###### Funds

Add or _reload_ a balance. This can be based on any dollar amount or fixed _reloads_

###### Payment method(s)

Add, remove, or update payment methods
Set a primary payment method

[+] Set an optional back-up

##### Profile settings

###### [+] Accessibility

Language & theme toggle

###### Logistics

Save or delete commonly used ship-from addresses and package presets

###### [+] Authorized users

Create or remove authorized users & configure user permissions

###### Basic info

Name\*, company\*, role in company, email\*

##### CSVs

###### Upload

- Client uploads CSV
- CSV is parsed for validation
- Present price
- Client pays, so balance is recalculated
- Req is sent to WeShipSmart

###### Download

Parse response and render download buttons for

- zip
- pdf
- csv

[+] Extract folders and files for client

1. Parse response or CSV and POST data to client's workbook
   1. Workbook path _needs_ to be standardized (specified in client settings)
2. Unzip labels.zip
3. labels.zip uploaded to their drive folder (specified in client settings)
4. doPost in client's workbook; fetch pdf links by tracking number

### Admin panel

Hosted on sub-folder & authentication on non-cached login

#### Views

##### Landing

###### Month to date

Gross, net, and total usage across all clients

###### Messages

Tickets or support submitted by clients

###### Client quick view

On-hover tool-tips containing client summaries

##### Client profile

###### Usage

Labels created by day, week, month & CSV upload/downloads

###### Mark-up rates

Custom rate settings varying client to client

[+] Pricing varies by package dimensions

##### Business settings

###### Our rates

Based on our connection or a shipping contract

[+] Pricing varies by package dimensions

### Data architecture

#### Client (User)

##### Transactions

Creation of labels

- bulk transactions are stored together
- bulk transactions are broken down into individual transactions and all of those transactions are stored together

##### [+] Orders

- store `awaiting_shipment` orders from ShipStation API

##### Settings

- logistics
- basic info

##### Auth

- login info
- authentication string

##### Uploads

###### CSVs

- uploaded
- downloaded

###### zips

- downloaded

###### pdfs

- downloaded

#### Admin

##### Clients

- clients based on ID
  - client data
    - usage
    - balance
    - rates

##### Rates

- our cost
- individual clients rates (we set this)

##### KPIs

By day, week, month

- overall balance
- bulk transactions
- individual transactions
- profit

#### Database architecture

##### Schema

```javascript
admin {
  admin_id string pk
}

client {
    client_id string pk
    role string
}

user_info {
    user_Login_id string pk
    admin_id string fk
    client_id string fk
    username string
    email string
    password_hash string
    name string
    is_admin boolean
}

balance {
    balance_id string pk
    client_id string fk
    amount number
}

invoices {
    invoice_id string pk
    client_id string fk
    balance_id string fk
    label_group_id string fk
    date timestamp
    amount number
    method string
    status boolean
}

csv {
    csv_id string pk
    client_id string fk
    file_name string
    upload_date timestamp
    download_date timestamp
}

payment_methods {
    method_id string pk
    client_id string fk
    is_primary boolean
    method_name string
    card_number number
    card_expiration string
    card_security_code number
    bank_routing number
    bank_account_number number
}

orders {
    order_id string pk
    client_id string fk
    status string
    date_created timestamp
}

label_group {
    label_group_id string pk
    client_id string fk
    date_created timestamp
    label_count number
    amount number
}

label {
    label_id string pk
    label_group_id string fk
    from_address string fk
    to_address string fk
    usps_service_type string
    weight number
    length number
    width number
    height number
    amount number
    status boolean
    tracking string
    date timestamp
}

label_address {
    address_id string pk
    name string
    company string
    address_one string
    address_two string
    zip_code string
    city string
    state string
    country string
    phone number
}

label_from {
    from_id string pk
    address_id string fk
}

label_to {
    to_id string pk
    address_id string fk
}

user_info.admin_id > admin.admin_id
user_info.client_id > client.client_id
balance.balance_id > client.client_id
invoices.balance_id > balance.balance_id
invoices.client_id > client.client_id
orders.client_id > client.client_id
payment_methods.client_id > client.client_id
csv.client_id > client.client_id
label_group.client_id > client.client_id
label_group.label_group_id > invoices.label_group_id
label.label_group_id >label_group.label_group_id
label.from_address > label_address.address_id
label.to_address > label_address.address_id
label_from.address_id > label_address.address_id
label_to.address_id > label_address.address_id
```

##### Prisma

```javascript
model Admin {
  admin_id String @id
  user_info UserInfo[]
}

model Client {
  client_id String @id
  user_info UserInfo[]
  balance Balance[]
  invoices Invoices[]
  csv Csv[]
  payment_methods PaymentMethods[]
  orders Orders[]
  label_group LabelGroup[]
}

model UserInfo {
  user_Login_id String @id
  admin_id String
  client_id String
  username String
  email String
  password_hash String
  name String
  is_admin Boolean
  admin Admin @relation(fields: [admin_id], references: [admin_id])
  client Client @relation(fields: [client_id], references: [client_id])
}

model Balance {
  balance_id String @id
  client_id String
  amount Float
  client Client @relation(fields: [client_id], references: [client_id])
  invoices Invoices[]
}

model Invoices {
  invoice_id String @id
  client_id String
  balance_id String
  label_group_id String
  date DateTime
  amount Float
  method String
  status Boolean
  client Client @relation(fields: [client_id], references: [client_id])
  balance Balance @relation(fields: [balance_id], references: [balance_id])
  label_group LabelGroup @relation(fields: [label_group_id], references: [label_group_id])
}

model Csv {
  csv_id String @id
  client_id String
  file_name String
  upload_date DateTime
  download_date DateTime
  client Client @relation(fields: [client_id], references: [client_id])
}

model PaymentMethods {
  method_id String @id
  client_id String
  is_primary Boolean
  method_name String
  card_number Int
  card_expiration String
  card_security_code Int
  bank_routing Int
  bank_account_number Int
  client Client @relation(fields: [client_id], references: [client_id])
}

model Orders {
  order_id String @id
  client_id String
  status String
  date_created DateTime
  client Client @relation(fields: [client_id], references: [client_id])
}

model LabelGroup {
  label_group_id String @id
  client_id String
  date_created DateTime
  label_count Int
  amount Float
  client Client @relation(fields: [client_id], references: [client_id])
  invoices Invoices[]
  label Label[]
}

model Label {
  label_id String @id
  label_group_id String
  from_address String
  to_address String
  usps_service_type String
  weight Float
  length Float
  width Float
  height Float
  amount Float
  status Boolean
  tracking String
  date DateTime
  label_group LabelGroup @relation(fields: [label_group_id], references: [label_group_id])
  label_from LabelFrom @relation(fields: [from_address], references: [address_id])
  label_to LabelTo @relation(fields: [to_address], references: [address_id])
}

model LabelAddress {
  address_id String @id
  name String
  company String
  address_one String
  address_two String
  zip_code String
  city String
  state String
  country String
  phone Int
  label_from LabelFrom[]
  label_to LabelTo[]
}

model LabelFrom {
  from_id String @id
  address_id String
  label_address LabelAddress @relation(fields: [address_id], references: [address_id])
}

model LabelTo {
  to_id String @id
  address_id String
  label_address LabelAddress @relation(fields: [address_id], references: [address_id])
}
```

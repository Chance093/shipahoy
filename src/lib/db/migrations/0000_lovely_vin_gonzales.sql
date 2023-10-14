CREATE TABLE `computers` (
	`id` integer PRIMARY KEY NOT NULL,
	`brand` text NOT NULL,
	`cores` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `balance` (
	`balance_id` text PRIMARY KEY DEFAULT '76c7caba-0b14-4b25-a264-805a4282cdf0' NOT NULL,
	`user_id` text NOT NULL,
	`amount` real NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `csv` (
	`csv_id` text PRIMARY KEY DEFAULT '0240b21e-9448-4cf5-97cc-bf631b9edecc' NOT NULL,
	`user_id` text NOT NULL,
	`file_name` text NOT NULL,
	`upload_date` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `label` (
	`label_id` text PRIMARY KEY DEFAULT '777fe232-e8a1-498a-8145-a9901f43c105' NOT NULL,
	`label_group_id` text,
	`amount` real NOT NULL,
	`tracking` text NOT NULL,
	`from_name` text NOT NULL,
	`from_company` text NOT NULL,
	`from_address_one` text NOT NULL,
	`from_address_two` text NOT NULL,
	`from_zip_code` text NOT NULL,
	`from_city` text NOT NULL,
	`from_state` text NOT NULL,
	`from_country` text NOT NULL,
	`from_phone` text NOT NULL,
	`to_name` text NOT NULL,
	`to_company` text NOT NULL,
	`to_address_one` text NOT NULL,
	`to_address_two` text NOT NULL,
	`to_zip_code` text NOT NULL,
	`to_city` text NOT NULL,
	`to_state` text NOT NULL,
	`to_country` text NOT NULL,
	`to_phone` text NOT NULL,
	`usps_service_type` text NOT NULL,
	`weight` text NOT NULL,
	`length` text NOT NULL,
	`width` text NOT NULL,
	`height` text NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`label_group_id`) REFERENCES `label_group`(`label_group_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `label_group` (
	`label_group_id` text PRIMARY KEY DEFAULT '7011c936-2b09-46a5-a126-4e57f7c93aed' NOT NULL,
	`user_id` text NOT NULL,
	`receipt_id` text,
	`label_count` text NOT NULL,
	`amount` real NOT NULL,
	`csv` blob,
	`pdf` blob NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`receipt_id`) REFERENCES `receipt`(`receipt_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `payment_method` (
	`method_id` text PRIMARY KEY DEFAULT 'd56324e4-eb9f-43d0-8bf2-2f47d09a5543' NOT NULL,
	`user_id` text NOT NULL,
	`is_primary` integer NOT NULL,
	`method_name` text NOT NULL,
	`card_number` integer NOT NULL,
	`last_4_card_number` integer NOT NULL,
	`card_expiration` text NOT NULL,
	`card_security_code` integer NOT NULL,
	`bank_routing` integer NOT NULL,
	`bank_account_number` integer NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);
--> statement-breakpoint
CREATE TABLE `receipt` (
	`receipt_id` text PRIMARY KEY DEFAULT '26189328-a981-4195-bc4a-f3e7c23cd3dc' NOT NULL,
	`user_id` text NOT NULL,
	`balance_id` text,
	`amount` real NOT NULL,
	`method` text NOT NULL,
	`status` text NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`balance_id`) REFERENCES `balance`(`balance_id`) ON UPDATE no action ON DELETE no action
);

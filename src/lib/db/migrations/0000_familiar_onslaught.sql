CREATE TABLE `computers` (
	`id` integer PRIMARY KEY NOT NULL,
	`brand` text NOT NULL,
	`cores` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `balance` (
	`balance_id` text PRIMARY KEY DEFAULT 'a7578bfa-e1b2-429b-92e9-f86de8b55b29' NOT NULL,
	`user_id` text,
	`amount` real NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `csv` (
	`csv_id` text PRIMARY KEY DEFAULT '5f23f48e-0617-4a68-ad6a-c786b715fdf7' NOT NULL,
	`user_id` text,
	`file_name` text NOT NULL,
	`upload_date` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `label` (
	`label_id` text PRIMARY KEY DEFAULT '32a62429-cf16-46e2-be04-c5bf6bd11d29' NOT NULL,
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
	`label_group_id` text PRIMARY KEY DEFAULT '86c2618f-c5a6-4542-8a86-e46a51326843' NOT NULL,
	`user_id` text,
	`receipt_id` text,
	`label_count` text NOT NULL,
	`amount` real NOT NULL,
	`csv` blob,
	`pdf` blob NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`receipt_id`) REFERENCES `receipt`(`receipt_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `payment_method` (
	`method_id` text PRIMARY KEY DEFAULT 'afb36862-dcdd-4b87-9ac6-e105f8e04e5c' NOT NULL,
	`user_id` text,
	`is_primary` integer NOT NULL,
	`method_name` text NOT NULL,
	`card_number` integer NOT NULL,
	`last_4_card_number` integer NOT NULL,
	`card_expiration` text NOT NULL,
	`card_security_code` integer NOT NULL,
	`bank_routing` integer NOT NULL,
	`bank_account_number` integer NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `receipt` (
	`receipt_id` text PRIMARY KEY DEFAULT 'aea17fcc-8b86-4d73-9d24-1dd614190579' NOT NULL,
	`user_id` text,
	`balance_id` text,
	`amount` real NOT NULL,
	`method` text NOT NULL,
	`status` text NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`user_id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`balance_id`) REFERENCES `balance`(`balance_id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `user` (
	`user_id` text PRIMARY KEY DEFAULT 'f56fd64d-e421-4d5d-93b3-6d3da0c99684' NOT NULL,
	`is_admin` integer,
	`password_hash` text NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`company` text NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP,
	`created_at` text DEFAULT CURRENT_TIMESTAMP
);

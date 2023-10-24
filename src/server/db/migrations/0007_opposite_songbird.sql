CREATE TABLE `label` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`label_group_id` int NOT NULL,
	`price` decimal(4,2) NOT NULL,
	`tracking` varchar(24),
	CONSTRAINT `label_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `label_address` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`label_id` int NOT NULL,
	`is_sender` boolean NOT NULL,
	`name` varchar(100) NOT NULL,
	`company` varchar(100) NOT NULL,
	`street_one` varchar(100) NOT NULL,
	`street_two` varchar(100) NOT NULL,
	`city` varchar(100) NOT NULL,
	`state` char(2) NOT NULL,
	`zip_code` varchar(10) NOT NULL,
	`country` varchar(56) NOT NULL,
	`phone_number` varchar(15) NOT NULL,
	CONSTRAINT `label_address_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `parcel` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`label_id` int NOT NULL,
	`weight` double NOT NULL,
	`length` double NOT NULL,
	`width` double NOT NULL,
	`height` double NOT NULL,
	CONSTRAINT `parcel_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `credit_card` MODIFY COLUMN `last_4_number` char(4) NOT NULL;
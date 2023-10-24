CREATE TABLE `label_group` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`user_id` varchar(200) NOT NULL,
	`invoice_id` int NOT NULL,
	`usps_service_id` int,
	`usps_external_service_id` int,
	`label_count` smallint NOT NULL,
	`pdf` blob NOT NULL,
	CONSTRAINT `label_group_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `usps_external_service` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`usps_service` varchar(29) NOT NULL,
	`price` decimal(4,2) NOT NULL,
	CONSTRAINT `usps_external_service_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `usps_service` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`usps_service` varchar(24) NOT NULL,
	`price` decimal(4,2) NOT NULL,
	CONSTRAINT `usps_service_id` PRIMARY KEY(`id`)
);

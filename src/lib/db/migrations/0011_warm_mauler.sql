CREATE TABLE `usps_external_service` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`usps_service` varchar(29) NOT NULL,
	`price` decimal(4,2) NOT NULL,
	CONSTRAINT `usps_external_service_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `label` ADD `usps_external_service_id` int;
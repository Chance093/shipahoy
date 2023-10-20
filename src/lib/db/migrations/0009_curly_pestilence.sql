CREATE TABLE `shipping_service` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`service` varchar(24) NOT NULL,
	CONSTRAINT `shipping_service_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `label` ADD `usps_service_id` int;--> statement-breakpoint
ALTER TABLE `label` ADD `usps_external_service_id` int;--> statement-breakpoint
ALTER TABLE `label_group` ADD `shipping_service_id` int NOT NULL;--> statement-breakpoint
ALTER TABLE `label_group` DROP COLUMN `usps_service_id`;--> statement-breakpoint
ALTER TABLE `label_group` DROP COLUMN `usps_external_service_id`;
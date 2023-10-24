CREATE TABLE `invoice` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`user_id` varchar(200) NOT NULL,
	`balance_id` int NOT NULL,
	`payment_status_id` int NOT NULL,
	`total_price` decimal(6,2) NOT NULL,
	`payment_method` varchar(100) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	CONSTRAINT `invoice_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `payment_status` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`status` varchar(8),
	CONSTRAINT `payment_status_id` PRIMARY KEY(`id`)
);

CREATE TABLE `balance` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`user_id` varchar(200) NOT NULL,
	`amount` decimal(7,2),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `balance_id` PRIMARY KEY(`id`)
);

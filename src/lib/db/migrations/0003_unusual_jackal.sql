CREATE TABLE `credit_card` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`user_id` varchar(200) NOT NULL,
	`name` varchar(100) NOT NULL,
	`number` varchar(20) NOT NULL,
	`last_4_number` char(4) AS (SUBSTRING(number, -4)) NOT NULL,
	`expiration` char(5) NOT NULL,
	`security_code` char(3) NOT NULL,
	`created_at` timestamp DEFAULT (now()),
	`updated_at` timestamp DEFAULT (now()),
	CONSTRAINT `credit_card_id` PRIMARY KEY(`id`)
);

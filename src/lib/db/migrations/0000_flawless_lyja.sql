CREATE TABLE `computers` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`brand` varchar(256) NOT NULL,
	`cores` int NOT NULL,
	CONSTRAINT `computers_id` PRIMARY KEY(`id`)
);

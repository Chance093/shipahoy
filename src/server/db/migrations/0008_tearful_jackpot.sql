CREATE INDEX `user_idx` ON `credit_card` (`user_id`);--> statement-breakpoint
CREATE INDEX `user_idx` ON `invoice` (`user_id`);--> statement-breakpoint
CREATE INDEX `user_idx` ON `label_group` (`user_id`);--> statement-breakpoint
ALTER TABLE `balance` ADD CONSTRAINT `user_idx` UNIQUE(`user_id`);
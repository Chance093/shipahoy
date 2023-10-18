ALTER TABLE `balance` ADD CONSTRAINT `user_idx` UNIQUE(`user_id`);--> statement-breakpoint
ALTER TABLE `credit_card` ADD CONSTRAINT `user_idx` UNIQUE(`user_id`);--> statement-breakpoint
ALTER TABLE `invoice` ADD CONSTRAINT `user_idx` UNIQUE(`user_id`);--> statement-breakpoint
ALTER TABLE `label_group` ADD CONSTRAINT `user_idx` UNIQUE(`user_id`);
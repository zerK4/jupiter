CREATE TABLE `session` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`expires_at` integer NOT NULL
);
--> statement-breakpoint
ALTER TABLE `users` RENAME COLUMN `phone` TO `hashed_password`;--> statement-breakpoint
ALTER TABLE `users` ADD `avatar_url` text;--> statement-breakpoint
ALTER TABLE `users` ADD `username` text;--> statement-breakpoint
ALTER TABLE `users` ADD `database_name` text;--> statement-breakpoint
ALTER TABLE `users` ADD `database_token` text;--> statement-breakpoint
ALTER TABLE `users` ADD `token` text;--> statement-breakpoint
ALTER TABLE `users` ADD `created_at` integer;--> statement-breakpoint
ALTER TABLE `users` ADD `updated_at` integer;
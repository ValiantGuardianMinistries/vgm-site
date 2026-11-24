CREATE TABLE `material` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`summary` text NOT NULL,
	`body` text NOT NULL,
	`section` text NOT NULL,
	`era` text NOT NULL,
	`type` text NOT NULL,
	`age` integer NOT NULL,
	`involvement` text NOT NULL,
	`status` text NOT NULL,
	`file_key` text DEFAULT '' NOT NULL,
	`updated_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `activity_totals` (
	`day` text NOT NULL,
	`content_id` text NOT NULL,
	`event` text NOT NULL,
	`count` integer DEFAULT 0 NOT NULL,
	PRIMARY KEY(`day`, `content_id`, `event`)
);

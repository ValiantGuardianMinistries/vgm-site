import { sqliteTable, text, integer, primaryKey } from 'drizzle-orm/sqlite-core';
export const material = sqliteTable('material', {
 id: text('id').primaryKey(), title: text('title').notNull(), summary: text('summary').notNull(),
 body: text('body').notNull(), section: text('section').notNull(), era: text('era').notNull(),
 type: text('type').notNull(), age: integer('age').notNull(), involvement: text('involvement').notNull(),
 status: text('status').notNull(), fileKey: text('file_key').notNull().default(''), updatedAt: text('updated_at').notNull()
});
export const totals = sqliteTable('activity_totals', {
 day: text('day').notNull(), contentId: text('content_id').notNull(), event: text('event').notNull(), count: integer('count').notNull().default(0)
}, t => [primaryKey({columns:[t.day,t.contentId,t.event]})]);

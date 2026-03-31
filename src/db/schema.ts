import {
	integer,
	sqliteTable,
	text,
	uniqueIndex,
} from 'drizzle-orm/sqlite-core'

export const userProgress = sqliteTable(
	'user_progress',
	{
		id: text('id')
			.primaryKey()
			.$defaultFn(() => crypto.randomUUID()),
		userId: text('user_id').notNull(),
		slug: text('slug').notNull(),
		completed: integer('completed', { mode: 'boolean' })
			.notNull()
			.default(false),
		updatedAt: integer('updated_at', { mode: 'timestamp' })
			.notNull()
			.$defaultFn(() => new Date()),
	},
	(table) => [uniqueIndex('idx_user_slug').on(table.userId, table.slug)],
)

import { and, eq, like } from 'drizzle-orm'
import type { createDb } from '@/db'
import { userProgress } from '@/db/schema'

type Db = ReturnType<typeof createDb>

export async function getProgress(
	db: Db,
	userId: string,
	subject: string,
	grade?: string,
): Promise<Record<string, boolean>> {
	const pattern = grade ? `${subject}/%/${grade}` : `${subject}/%`

	const rows = await db
		.select({ slug: userProgress.slug, completed: userProgress.completed })
		.from(userProgress)
		.where(
			and(eq(userProgress.userId, userId), like(userProgress.slug, pattern)),
		)

	const result: Record<string, boolean> = {}
	for (const row of rows) {
		result[row.slug] = row.completed
	}
	return result
}

export async function toggleProgress(
	db: Db,
	userId: string,
	slug: string,
	completed: boolean,
) {
	const [row] = await db
		.insert(userProgress)
		.values({ userId, slug, completed })
		.onConflictDoUpdate({
			target: [userProgress.userId, userProgress.slug],
			set: { completed, updatedAt: new Date() },
		})
		.returning()

	return row
}

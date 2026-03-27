import { and, eq, like } from 'drizzle-orm'
import type { createDb } from '@/db'
import { userProgress } from '@/db/schema'

const SLUG_RE = /^[a-z0-9-]+(?:\/[a-z0-9-]+){1,2}\/[0-9]+-rocnik$/
const SUBJECT_RE = /^[a-z0-9-]+(?:\/[a-z0-9-]+)?$/
const GRADE_RE = /^[0-9]+-rocnik$/

export function isProgressSlug(value: unknown): value is string {
	return typeof value === 'string' && SLUG_RE.test(value)
}

export function isSubjectParam(value: unknown): value is string {
	return typeof value === 'string' && value.length > 0 && SUBJECT_RE.test(value)
}

export function isGradeParam(value: unknown): value is string {
	return typeof value === 'string' && GRADE_RE.test(value)
}

export function isProgressBody(
	value: unknown,
): value is { slug: string; completed: boolean } {
	return (
		typeof value === 'object' &&
		value !== null &&
		'slug' in value &&
		'completed' in value &&
		isProgressSlug((value as Record<string, unknown>).slug) &&
		typeof (value as Record<string, unknown>).completed === 'boolean'
	)
}

/**
 * Check if a topic is completed for the given grade.
 *
 * When grade is a specific value, checks that single slug.
 * When grade is `"all"`, checks that every available grade is completed.
 *
 * @param progress - `{ [slug]: boolean }` map from the progress query
 * @param subject - Subject slug, e.g. `"matematika"`
 * @param topicSlug - Topic directory slug, e.g. `"01-pocetni-operace"`
 * @param grade - Grade string (`"6-rocnik"`) or `"all"` for all grades
 * @param availableGrades - Grade numbers available for the topic, e.g. `[6, 7, 8, 9]`
 * @returns `true` if the topic-grade (or all grades) is completed
 *
 * @example
 * isTopicCompleted(progress, 'matematika', '01', '6-rocnik', [6, 7, 8, 9])
 *
 * @example
 * isTopicCompleted(progress, 'matematika', '01', 'all', [6, 7, 8, 9])
 * // => true only if all 4 grades are completed
 */
export function isTopicCompleted(
	progress: Record<string, boolean>,
	subject: string,
	topicSlug: string,
	grade: string,
	availableGrades: number[],
): boolean {
	if (grade === 'all') {
		return availableGrades.every(
			(g) => progress[progressSlug(subject, topicSlug, `${g}-rocnik`)] === true,
		)
	}
	return progress[progressSlug(subject, topicSlug, grade)] === true
}

/**
 * Build a progress slug from subject, topic directory, and grade.
 *
 * @param subject - Subject slug, e.g. `"matematika"`
 * @param topicSlug - Topic directory slug, e.g. `"01-pocetni-operace"`
 * @param grade - Grade string, e.g. `"6-rocnik"`
 * @returns Progress slug, e.g. `"matematika/01-pocetni-operace/6-rocnik"`
 *
 * @example
 * progressSlug('matematika', '01-pocetni-operace', '6-rocnik')
 * // => 'matematika/01-pocetni-operace/6-rocnik'
 */
export function progressSlug(
	subject: string,
	topicSlug: string,
	grade: string,
): string {
	return `${subject}/${topicSlug}/${grade}`
}

type Db = ReturnType<typeof createDb>

/**
 * Fetch all progress entries for a user within a subject.
 *
 * Server-side only — called from the progress API route.
 *
 * @param db - Drizzle D1 database instance
 * @param userId - Authenticated user ID
 * @param subject - Subject slug, e.g. `"matematika"`
 * @param grade - Optional grade filter, e.g. `"7-rocnik"`
 * @returns `{ [slug]: boolean }` map of completion state
 *
 * @example
 * await getProgress(db, 'user-1', 'matematika')
 * // => { 'matematika/01/6-rocnik': true, 'matematika/02/6-rocnik': false }
 */
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

/**
 * Insert or update a single progress entry.
 *
 * Uses upsert on the `(user_id, slug)` unique index.
 * Server-side only — called from the progress API route.
 *
 * @param db - Drizzle D1 database instance
 * @param userId - Authenticated user ID
 * @param slug - Full progress slug, e.g. `"matematika/01/6-rocnik"`
 * @param completed - Whether the topic-grade is completed
 * @returns The upserted row
 */
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

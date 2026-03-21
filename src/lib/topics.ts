export interface Topic {
	number: number
	title: string
	description?: string
	slug: string
	grades: number[]
}

export type GlobEntry = {
	frontmatter: { number?: number; title: string; description?: string }
}

export type GlobRecord = Record<string, GlobEntry>

const GRADE_PATTERN = /^(\d+)-rocnik\.mdx$/

/**
 * Parse MDX glob into sorted topics.
 * Entries without `number` in frontmatter are skipped.
 *
 * @param glob - Record from `import.meta.glob(...)`, keyed by file path
 * @returns Topics sorted by number ascending
 *
 * @example
 * const topics = parseTopics(import.meta.glob('./*.mdx', { eager: true }))
 */
export function parseTopics(glob: GlobRecord): Topic[] {
	const groups = new Map<
		string,
		{ number?: number; title: string; description?: string; grades: number[] }
	>()

	for (const path of Object.keys(glob)) {
		const segments = path.split('/')
		const filename = segments.at(-1)
		const slug = segments.at(-2)

		if (!filename || !slug) continue

		let group = groups.get(slug)
		if (!group) {
			group = { title: '', grades: [] }
			groups.set(slug, group)
		}

		if (filename === 'index.mdx') {
			group.number = glob[path].frontmatter.number
			group.title = glob[path].frontmatter.title
			group.description = glob[path].frontmatter.description
		} else {
			const gradeMatch = filename.match(GRADE_PATTERN)
			if (gradeMatch) {
				group.grades.push(Number(gradeMatch[1]))
			}
		}
	}

	const topics: Topic[] = []

	for (const [slug, { number, title, description, grades }] of groups) {
		if (number == null) continue

		topics.push({
			number,
			title,
			slug,
			grades: grades.toSorted((a, b) => a - b),
			...(description && { description }),
		})
	}

	return topics.toSorted((a, b) => a.number - b.number)
}

/**
 * Zero-pad a topic number for display.
 * Width adapts to `maxNumber` (2 digits for ≤99, 3 for ≥100).
 *
 * @param n - Topic number
 * @param maxNumber - Largest number in the set, determines padding width
 * @returns Padded string
 *
 * @example
 * formatTopicNumber(5)       // => '05'
 * formatTopicNumber(5, 131)  // => '005'
 */
export function formatTopicNumber(n: number, maxNumber = 99): string {
	const width = String(maxNumber).length
	return String(n).padStart(width, '0')
}

/**
 * Format a topic's display label with padded number prefix.
 *
 * @param topic - Topic object
 * @param maxNumber - Passed to {@link formatTopicNumber} for padding width
 * @returns Label string
 *
 * @example
 * topicLabel({ number: 1, title: 'Početní operace', slug: '01-pocetni-operace', grades: [] })
 * // => '01. Početní operace'
 */
export function topicLabel(topic: Topic, maxNumber?: number): string {
	return `${formatTopicNumber(topic.number, maxNumber)}. ${topic.title}`
}

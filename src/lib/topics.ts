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

export function formatTopicNumber(n: number, maxNumber = 99): string {
	const width = String(maxNumber).length
	return String(n).padStart(width, '0')
}

export function topicLabel(topic: Topic, maxNumber?: number): string {
	return `${formatTopicNumber(topic.number, maxNumber)}. ${topic.title}`
}

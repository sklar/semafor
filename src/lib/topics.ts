export interface Topic {
	number: number
	title: string
	description?: string
	slug: string
	grades: number[]
}

export type GlobEntry = {
	frontmatter: { title: string; description?: string }
}

export type GlobRecord = Record<string, GlobEntry>

const GRADE_PATTERN = /^(\d+)-rocnik\.mdx$/
const NUMBER_PREFIX = /^(\d+)-/

export function parseTopics(glob: GlobRecord): Topic[] {
	const groups = new Map<
		string,
		{ title: string; description?: string; grades: number[] }
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

	for (const [slug, { title, description, grades }] of groups) {
		const numberMatch = slug.match(NUMBER_PREFIX)
		if (!numberMatch) continue

		topics.push({
			number: Number(numberMatch[1]),
			title: title.replace(/^\d{1,3}\.\s*/, ''),
			slug,
			grades: grades.toSorted((a, b) => a - b),
			...(description && { description }),
		})
	}

	return topics.toSorted((a, b) => a.number - b.number)
}

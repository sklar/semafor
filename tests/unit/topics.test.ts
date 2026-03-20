import { describe, expect, test } from 'vitest'
import { type GlobRecord, parseTopics } from '@/lib/topics'

describe('parseTopics', () => {
	test('single topic with all 4 grades', () => {
		const glob: GlobRecord = {
			'./01-pocetni-operace/index.mdx': {
				frontmatter: { title: '01. Početní operace' },
			},
			'./01-pocetni-operace/6-rocnik.mdx': {
				frontmatter: { title: '6. ročník' },
			},
			'./01-pocetni-operace/7-rocnik.mdx': {
				frontmatter: { title: '7. ročník' },
			},
			'./01-pocetni-operace/8-rocnik.mdx': {
				frontmatter: { title: '8. ročník' },
			},
			'./01-pocetni-operace/9-rocnik.mdx': {
				frontmatter: { title: '9. ročník' },
			},
		}

		expect(parseTopics(glob)).toEqual([
			{
				number: 1,
				title: 'Početní operace',
				slug: '01-pocetni-operace',
				grades: [6, 7, 8, 9],
			},
		])
	})

	test('topic with partial grades', () => {
		const glob: GlobRecord = {
			'./67-chemicka-terminologie/index.mdx': {
				frontmatter: { title: '67. Chemická terminologie' },
			},
			'./67-chemicka-terminologie/8-rocnik.mdx': {
				frontmatter: { title: '8. ročník' },
			},
			'./67-chemicka-terminologie/9-rocnik.mdx': {
				frontmatter: { title: '9. ročník' },
			},
		}

		expect(parseTopics(glob)[0].grades).toEqual([8, 9])
	})

	test('topic with no grade files', () => {
		const glob: GlobRecord = {
			'./07-kultivovany-projev/index.mdx': {
				frontmatter: { title: '07. Kultivovaný projev' },
			},
		}

		expect(parseTopics(glob)[0].grades).toEqual([])
	})

	test('multiple topics sorted by number', () => {
		const glob: GlobRecord = {
			'./03-delitelnost/index.mdx': {
				frontmatter: { title: '03. Dělitelnost' },
			},
			'./03-delitelnost/6-rocnik.mdx': {
				frontmatter: { title: '6. ročník' },
			},
			'./01-pocetni-operace/index.mdx': {
				frontmatter: { title: '01. Početní operace' },
			},
			'./01-pocetni-operace/6-rocnik.mdx': {
				frontmatter: { title: '6. ročník' },
			},
		}

		const result = parseTopics(glob)
		expect(result).toHaveLength(2)
		expect(result[0].number).toBe(1)
		expect(result[1].number).toBe(3)
	})

	test('three-digit topic number', () => {
		const glob: GlobRecord = {
			'./131-silne-a-slabe-stranky/index.mdx': {
				frontmatter: { title: '131. Silné a slabé stránky' },
			},
			'./131-silne-a-slabe-stranky/6-rocnik.mdx': {
				frontmatter: { title: '6. ročník' },
			},
		}

		expect(parseTopics(glob)[0].number).toBe(131)
	})

	test('grades sorted numerically', () => {
		const glob: GlobRecord = {
			'./01-topic/index.mdx': {
				frontmatter: { title: 'Topic' },
			},
			'./01-topic/9-rocnik.mdx': {
				frontmatter: { title: '9. ročník' },
			},
			'./01-topic/6-rocnik.mdx': {
				frontmatter: { title: '6. ročník' },
			},
		}

		expect(parseTopics(glob)[0].grades).toEqual([6, 9])
	})

	test('empty glob returns empty array', () => {
		expect(parseTopics({})).toEqual([])
	})

	test('extracts description from frontmatter', () => {
		const glob: GlobRecord = {
			'./01-topic/index.mdx': {
				frontmatter: {
					title: '01. Topic',
					description: 'Topic description text.',
				},
			},
			'./01-topic/6-rocnik.mdx': {
				frontmatter: { title: '6. ročník' },
			},
		}

		expect(parseTopics(glob)[0].description).toBe('Topic description text.')
	})

	test('omits description when not in frontmatter', () => {
		const glob: GlobRecord = {
			'./01-topic/index.mdx': {
				frontmatter: { title: '01. Topic' },
			},
		}

		expect(parseTopics(glob)[0].description).toBeUndefined()
	})

	test('handles absolute-style glob paths', () => {
		const glob: GlobRecord = {
			'/src/content/docs/matematika/01-pocetni-operace/index.mdx': {
				frontmatter: { title: '01. Početní operace' },
			},
			'/src/content/docs/matematika/01-pocetni-operace/6-rocnik.mdx': {
				frontmatter: { title: '6. ročník' },
			},
		}

		const result = parseTopics(glob)
		expect(result).toHaveLength(1)
		expect(result[0].slug).toBe('01-pocetni-operace')
		expect(result[0].grades).toEqual([6])
	})
})

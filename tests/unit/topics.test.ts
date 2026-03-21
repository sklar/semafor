import { describe, expect, test } from 'vitest'
import type { GlobRecord } from '@/lib/topics'
import { formatTopicNumber, parseTopics, topicLabel } from '@/lib/topics'

describe('parseTopics', () => {
	test('single topic with all 4 grades', () => {
		const glob: GlobRecord = {
			'./01-pocetni-operace/index.mdx': {
				frontmatter: { title: 'Početní operace', number: 1 },
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
				frontmatter: { title: 'Chemická terminologie', number: 67 },
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
				frontmatter: { title: 'Kultivovaný projev', number: 7 },
			},
		}

		expect(parseTopics(glob)[0].grades).toEqual([])
	})

	test('multiple topics sorted by number', () => {
		const glob: GlobRecord = {
			'./03-delitelnost/index.mdx': {
				frontmatter: { title: 'Dělitelnost', number: 3 },
			},
			'./03-delitelnost/6-rocnik.mdx': {
				frontmatter: { title: '6. ročník' },
			},
			'./01-pocetni-operace/index.mdx': {
				frontmatter: { title: 'Početní operace', number: 1 },
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
				frontmatter: { title: 'Silné a slabé stránky', number: 131 },
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
				frontmatter: { title: 'Topic', number: 1 },
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

	test('skips entries without number in frontmatter', () => {
		const glob: GlobRecord = {
			'./01-topic/index.mdx': {
				frontmatter: { title: 'Topic without number' },
			},
		}

		expect(parseTopics(glob)).toEqual([])
	})

	test('extracts description from frontmatter', () => {
		const glob: GlobRecord = {
			'./01-topic/index.mdx': {
				frontmatter: {
					title: 'Topic',
					number: 1,
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
				frontmatter: { title: 'Topic', number: 1 },
			},
		}

		expect(parseTopics(glob)[0].description).toBeUndefined()
	})

	test('handles absolute-style glob paths', () => {
		const glob: GlobRecord = {
			'/src/content/docs/matematika/01-pocetni-operace/index.mdx': {
				frontmatter: { title: 'Početní operace', number: 1 },
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

describe('formatTopicNumber', () => {
	test('pads single digit to 2 digits by default', () => {
		expect(formatTopicNumber(1)).toBe('01')
	})

	test('keeps two-digit number as-is by default', () => {
		expect(formatTopicNumber(42)).toBe('42')
	})

	test('pads to 3 digits when maxNumber >= 100', () => {
		expect(formatTopicNumber(1, 131)).toBe('001')
		expect(formatTopicNumber(67, 131)).toBe('067')
		expect(formatTopicNumber(131, 131)).toBe('131')
	})
})

describe('topicLabel', () => {
	test('formats number and title', () => {
		const topic = {
			number: 1,
			title: 'Početní operace',
			slug: '01-pocetni-operace',
			grades: [6, 7],
		}
		expect(topicLabel(topic)).toBe('01. Početní operace')
	})

	test('uses maxNumber for padding', () => {
		const topic = {
			number: 5,
			title: 'Algebraické výrazy',
			slug: '05-algebraicke-vyrazy',
			grades: [],
		}
		expect(topicLabel(topic, 131)).toBe('005. Algebraické výrazy')
	})
})

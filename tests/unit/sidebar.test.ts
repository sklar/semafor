import { describe, expect, test } from 'vitest'
import type { SidebarEntry } from '@/lib/sidebar'
import { findGroupBySlug, getSubAreaSlugs } from '@/lib/sidebar'

const SIDEBAR: SidebarEntry[] = [
	{
		label: 'Český jazyk',
		items: [
			{ label: 'Přehled', slug: 'cesky-jazyk' },
			{
				label: '01. Téma A',
				autogenerate: { directory: 'cesky-jazyk/01-tema-a' },
			},
			{
				label: '02. Téma B',
				autogenerate: { directory: 'cesky-jazyk/02-tema-b' },
			},
		],
	},
	{
		label: 'Matematika',
		items: [
			{ label: 'Přehled', slug: 'matematika' },
			{
				label: 'Algebra',
				items: [
					{ label: 'Přehled', slug: 'matematika/algebra' },
					{
						label: '01. Výrazy',
						autogenerate: { directory: 'matematika/algebra/01-vyrazy' },
					},
				],
			},
		],
	},
]

describe('findGroupBySlug', () => {
	test('finds parent group of a direct child slug', () => {
		const group = findGroupBySlug(SIDEBAR, 'cesky-jazyk')
		expect(group).toBeDefined()
		expect(group?.label).toBe('Český jazyk')
	})

	test('returns undefined for non-existent slug', () => {
		expect(findGroupBySlug(SIDEBAR, 'neexistuje')).toBeUndefined()
	})

	test('finds immediate parent of a deeply nested slug', () => {
		const group = findGroupBySlug(SIDEBAR, 'matematika/algebra')
		expect(group).toBeDefined()
		expect(group?.label).toBe('Algebra')
	})

	test('returns undefined for empty sidebar', () => {
		expect(findGroupBySlug([], 'cesky-jazyk')).toBeUndefined()
	})
})

describe('getSubAreaSlugs', () => {
	test('extracts directory slugs from autogenerate entries', () => {
		const slugs = getSubAreaSlugs('cesky-jazyk', SIDEBAR)
		expect(slugs).toEqual(['01-tema-a', '02-tema-b'])
	})

	test('returns empty array when group not found', () => {
		expect(getSubAreaSlugs('neexistuje', SIDEBAR)).toEqual([])
	})

	test('skips non-autogenerate items', () => {
		const slugs = getSubAreaSlugs('cesky-jazyk', SIDEBAR)
		// "Přehled" slug entry should be skipped, only autogenerate dirs returned
		expect(slugs).not.toContain('cesky-jazyk')
	})

	test('extracts slugs from nested groups', () => {
		const slugs = getSubAreaSlugs('matematika/algebra', SIDEBAR)
		expect(slugs).toEqual(['01-vyrazy'])
	})
})

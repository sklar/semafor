import { describe, expect, test } from 'vitest'
import { topicHref } from '@/lib/href'

describe('topicHref', () => {
	test('returns overview path when grade is "all"', () => {
		expect(topicHref('matematika', '01-pocetni-operace', 'all')).toBe(
			'/matematika/01-pocetni-operace/',
		)
	})

	test('returns grade-specific path for grade "6"', () => {
		expect(topicHref('matematika', '01-pocetni-operace', '6')).toBe(
			'/matematika/01-pocetni-operace/6-rocnik',
		)
	})

	test('returns grade-specific path for grade "9"', () => {
		expect(topicHref('matematika', '01-pocetni-operace', '9')).toBe(
			'/matematika/01-pocetni-operace/9-rocnik',
		)
	})

	test('works with nested subject paths', () => {
		expect(topicHref('ja-a-svet/chemie', '67-chemicka-terminologie', '8')).toBe(
			'/ja-a-svet/chemie/67-chemicka-terminologie/8-rocnik',
		)
	})
})

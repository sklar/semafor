import type { Grade } from '@/components/grade-filter/grade'

/**
 * Build URL path for a topic page, optionally scoped to a grade.
 *
 * @param subject - Subject slug, e.g. `"matematika"`
 * @param slug - Topic directory slug, e.g. `"01-pocetni-operace"`
 * @param grade - Grade filter; `"all"` for overview, `"6"`–`"9"` for grade page
 * @returns Absolute path
 *
 * @example
 * topicHref('matematika', '01-pocetni-operace', 'all')
 * // => '/matematika/01-pocetni-operace/'
 *
 * @example
 * topicHref('matematika', '01-pocetni-operace', '7')
 * // => '/matematika/01-pocetni-operace/7-rocnik'
 */
export function topicHref(subject: string, slug: string, grade: Grade): string {
	return grade === 'all'
		? `/${subject}/${slug}/`
		: `/${subject}/${slug}/${grade}-rocnik`
}

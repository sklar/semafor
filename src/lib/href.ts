import type { Grade } from '@/components/grade-filter/grade'

export function topicHref(subject: string, slug: string, grade: Grade): string {
	return grade === 'all'
		? `/${subject}/${slug}/`
		: `/${subject}/${slug}/${grade}-rocnik`
}

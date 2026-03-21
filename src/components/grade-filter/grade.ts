export type Grade = '6' | '7' | '8' | '9' | 'all'

export const GRADES: Grade[] = ['6', '7', '8', '9', 'all']

export const GRADE_STORAGE_KEY = 'semafor:grade'

export const DEFAULT_GRADE: Grade = 'all'

export function isGrade(value: string): value is Grade {
	return (GRADES as string[]).includes(value)
}

export const GRADE_LABELS: Record<Grade, string> = {
	'6': '6. ročník',
	'7': '7. ročník',
	'8': '8. ročník',
	'9': '9. ročník',
	all: 'Vše',
}

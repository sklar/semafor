export type View = 'cards' | 'table'

export const VIEWS: View[] = ['cards', 'table']

export const VIEW_STORAGE_KEY = 'semafor:view'

export const DEFAULT_VIEW: View = 'cards'

export function isView(value: string): value is View {
	return (VIEWS as string[]).includes(value)
}

export const VIEW_LABELS: Record<View, string> = {
	cards: 'Karty',
	table: 'Tabulka',
}

export type View = 'cards' | 'table'

export const VIEWS: View[] = ['cards', 'table']

export const VIEW_STORAGE_KEY = 'semafor:view'

export const DEFAULT_VIEW: View = 'cards'

export const VIEW_LABELS: Record<View, string> = {
	cards: 'Karty',
	table: 'Tabulka',
}

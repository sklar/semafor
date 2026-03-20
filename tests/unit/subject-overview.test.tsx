import { cleanup, fireEvent, render, screen } from '@solidjs/testing-library'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { GRADE_STORAGE_KEY } from '@/components/grade-filter/grade'
import SubjectOverview from '@/components/subject-overview/SubjectOverview'
import { VIEW_STORAGE_KEY } from '@/components/view-toggle/view'
import type { Topic } from '@/lib/topics'

const TOPICS: Topic[] = [
	{
		number: 1,
		title: 'Početní operace s celými a racionálními čísly',
		slug: '01-pocetni-operace',
		grades: [6, 7, 8, 9],
		description: 'Provádí početní operace s celými a racionálními čísly.',
	},
	{
		number: 2,
		title: 'Zaokrouhlování a odhady',
		slug: '02-zaokrouhlovani-a-odhady',
		grades: [6, 7],
	},
]

const SUBJECT = 'matematika'

function renderOverview() {
	render(() => <SubjectOverview topics={TOPICS} subject={SUBJECT} />)
}

describe('SubjectOverview', () => {
	afterEach(() => {
		cleanup()
		localStorage.clear()
	})

	describe('composition', () => {
		test('renders grade filter', () => {
			renderOverview()

			expect(screen.getByRole('group', { name: 'Ročník' })).toBeDefined()
		})

		test('renders view toggle', () => {
			renderOverview()

			expect(screen.getByRole('group', { name: 'Zobrazení' })).toBeDefined()
		})

		test('renders card view by default', () => {
			renderOverview()

			expect(screen.getByTestId('card-view')).toBeDefined()
		})
	})

	describe('grade filter affects views', () => {
		test('card links use overview URLs when grade is "all"', () => {
			renderOverview()

			const links = screen.getAllByRole('link')
			expect(links[0].getAttribute('href')).toBe(
				'/matematika/01-pocetni-operace/',
			)
			expect(links[1].getAttribute('href')).toBe(
				'/matematika/02-zaokrouhlovani-a-odhady/',
			)
		})

		test('card links update when grade changes', () => {
			renderOverview()

			fireEvent.click(screen.getByRole('radio', { name: '7. ročník' }))

			const links = screen.getAllByRole('link')
			expect(links[0].getAttribute('href')).toBe(
				'/matematika/01-pocetni-operace/7-rocnik',
			)
		})

		test('table view reflects grade filter', () => {
			renderOverview()

			fireEvent.click(screen.getByRole('radio', { name: 'Tabulka' }))
			fireEvent.click(screen.getByRole('radio', { name: '8. ročník' }))

			const table = screen.getByTestId('table-view')
			const mutedCells = table.querySelectorAll('[data-muted]')
			const unmutedGradeCells = table.querySelectorAll(
				'[data-grade="8"]:not([data-muted])',
			)

			expect(mutedCells.length).toBeGreaterThan(0)
			expect(unmutedGradeCells.length).toBeGreaterThan(0)
		})
	})

	describe('view toggle', () => {
		test('shows card view by default, no table', () => {
			renderOverview()

			expect(screen.getByTestId('card-view')).toBeDefined()
			expect(screen.queryByTestId('table-view')).toBeNull()
		})

		test('switches to table view', () => {
			renderOverview()

			fireEvent.click(screen.getByRole('radio', { name: 'Tabulka' }))

			expect(screen.getByTestId('table-view')).toBeDefined()
			expect(screen.queryByTestId('card-view')).toBeNull()
		})

		test('switches back to card view', () => {
			renderOverview()

			fireEvent.click(screen.getByRole('radio', { name: 'Tabulka' }))
			fireEvent.click(screen.getByRole('radio', { name: 'Karty' }))

			expect(screen.getByTestId('card-view')).toBeDefined()
			expect(screen.queryByTestId('table-view')).toBeNull()
		})
	})

	describe('localStorage — grade', () => {
		beforeEach(() => {
			vi.spyOn(Storage.prototype, 'getItem')
			vi.spyOn(Storage.prototype, 'setItem')
		})

		afterEach(() => {
			localStorage.clear()
			vi.restoreAllMocks()
		})

		test('reads initial grade from localStorage', () => {
			localStorage.setItem(GRADE_STORAGE_KEY, '7')

			renderOverview()

			const radio = screen.getByRole('radio', { name: '7. ročník' })
			expect(radio).toBeChecked()
		})

		test('persists grade change to localStorage', () => {
			renderOverview()

			fireEvent.click(screen.getByRole('radio', { name: '9. ročník' }))

			expect(localStorage.setItem).toHaveBeenCalledWith(GRADE_STORAGE_KEY, '9')
		})
	})

	describe('localStorage — view', () => {
		beforeEach(() => {
			vi.spyOn(Storage.prototype, 'getItem')
			vi.spyOn(Storage.prototype, 'setItem')
		})

		afterEach(() => {
			localStorage.clear()
			vi.restoreAllMocks()
		})

		test('reads initial view from localStorage', () => {
			localStorage.setItem(VIEW_STORAGE_KEY, 'table')

			renderOverview()

			expect(screen.getByTestId('table-view')).toBeDefined()
			expect(screen.queryByTestId('card-view')).toBeNull()
		})

		test('persists view change to localStorage', () => {
			renderOverview()

			fireEvent.click(screen.getByRole('radio', { name: 'Tabulka' }))

			expect(localStorage.setItem).toHaveBeenCalledWith(
				VIEW_STORAGE_KEY,
				'table',
			)
		})
	})
})

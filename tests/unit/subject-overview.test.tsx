import {
	cleanup,
	fireEvent,
	render,
	screen,
	waitFor,
} from '@solidjs/testing-library'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'
import { GRADE_STORAGE_KEY } from '@/components/grade-filter/grade'
import SubjectOverview from '@/components/subject-overview/SubjectOverview'
import { VIEW_STORAGE_KEY } from '@/components/view-toggle/view'
import type { Topic } from '@/lib/topics'

let mockSession: { user: { name: string } } | null = null
let mockProgressData: Record<string, boolean> | undefined
const mockMutateAsync = vi.fn().mockResolvedValue({})

// ProgressError from the original (non-mocked) module for instanceof checks.
class ProgressError extends Error {
	status: number
	constructor(status: number, message: string) {
		super(message)
		this.status = status
	}
}

vi.mock('@/lib/auth-client', () => ({
	authClient: {
		useSession: () => () => ({
			data: mockSession,
			isPending: false,
		}),
	},
}))

vi.mock('@/lib/progress-hooks', () => ({
	createProgressQuery: () => ({
		get data() {
			return mockProgressData
		},
		isLoading: false,
		isError: false,
	}),
	createProgressMutation: () => ({
		mutate: vi.fn(),
		mutateAsync: mockMutateAsync,
		isError: false,
		isPending: false,
	}),
}))

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
		mockSession = null
		mockProgressData = undefined
		mockMutateAsync.mockReset().mockResolvedValue({})
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

	describe('progress tracking', () => {
		test('shows checkmarks when authenticated with progress data', () => {
			mockSession = { user: { name: 'Test' } }
			mockProgressData = {
				'matematika/01-pocetni-operace/6-rocnik': true,
				'matematika/01-pocetni-operace/7-rocnik': true,
				'matematika/01-pocetni-operace/8-rocnik': true,
				'matematika/01-pocetni-operace/9-rocnik': true,
			}

			renderOverview()

			expect(screen.queryAllByRole('img', { name: /hotovo/i })).toHaveLength(1)
		})

		test('shows no checkmarks when unauthenticated', () => {
			mockSession = null
			mockProgressData = undefined

			renderOverview()

			expect(screen.queryAllByRole('img', { name: /hotovo/i })).toHaveLength(0)
		})

		test('table view shows checkboxes when authenticated', () => {
			mockSession = { user: { name: 'Test' } }
			mockProgressData = {}

			renderOverview()
			fireEvent.click(screen.getByRole('radio', { name: 'Tabulka' }))

			expect(screen.getAllByRole('checkbox')).toHaveLength(6)
		})

		test('clicking table checkbox calls mutation', () => {
			mockSession = { user: { name: 'Test' } }
			mockProgressData = {}

			renderOverview()
			fireEvent.click(screen.getByRole('radio', { name: 'Tabulka' }))

			const checkbox = screen.getByRole('checkbox', {
				name: '01. Početní operace s celými a racionálními čísly, 6. ročník',
			})
			fireEvent.click(checkbox)

			expect(mockMutateAsync).toHaveBeenCalledWith({
				slug: 'matematika/01-pocetni-operace/6-rocnik',
				completed: true,
			})
		})

		test('shows toast on mutation error', async () => {
			mockSession = { user: { name: 'Test' } }
			mockProgressData = {}
			mockMutateAsync.mockRejectedValue(new Error('Network error'))

			renderOverview()
			fireEvent.click(screen.getByRole('radio', { name: 'Tabulka' }))

			const checkbox = screen.getByRole('checkbox', {
				name: '01. Početní operace s celými a racionálními čísly, 6. ročník',
			})
			fireEvent.click(checkbox)

			await waitFor(() => {
				expect(screen.getByRole('alert')).toBeDefined()
			})
		})

		test('shows session-expired toast on 401 error', async () => {
			mockSession = { user: { name: 'Test' } }
			mockProgressData = {}
			mockMutateAsync.mockRejectedValue(new ProgressError(401, 'HTTP 401'))

			renderOverview()
			fireEvent.click(screen.getByRole('radio', { name: 'Tabulka' }))

			const checkbox = screen.getByRole('checkbox', {
				name: '01. Početní operace s celými a racionálními čísly, 6. ročník',
			})
			fireEvent.click(checkbox)

			await waitFor(() => {
				const alert = screen.getByRole('alert')
				expect(alert.textContent).toContain('Přihlášení vypršelo')
			})
		})
	})
})

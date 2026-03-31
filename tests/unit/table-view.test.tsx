import { cleanup, fireEvent, render, screen } from '@solidjs/testing-library'
import { createSignal } from 'solid-js'
import { afterEach, describe, expect, test, vi } from 'vitest'
import type { Grade } from '@/components/grade-filter/grade'
import TableView from '@/components/table-view/TableView'
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

function renderTableView(
	topics: Topic[],
	subject: string,
	initial: Grade,
	options?: {
		progress?: Record<string, boolean>
		onToggle?: (slug: string, completed: boolean) => void
	},
) {
	const [grade, setGrade] = createSignal<Grade>(initial)

	render(() => (
		<TableView
			topics={topics}
			subject={subject}
			grade={grade()}
			progress={options?.progress}
			onToggle={options?.onToggle}
		/>
	))

	return { setGrade }
}

describe('TableView', () => {
	afterEach(cleanup)

	test('renders a table element', () => {
		renderTableView(TOPICS, SUBJECT, 'all')

		expect(screen.getByRole('table')).toBeDefined()
	})

	test('renders correct column headers', () => {
		renderTableView(TOPICS, SUBJECT, 'all')

		const headers = screen.getAllByRole('columnheader')
		expect(headers).toHaveLength(6)
		expect(headers[0].textContent).toBe('#')
		expect(headers[1].textContent).toBe('Téma')
		expect(headers[2].textContent).toBe('6. ročník')
		expect(headers[3].textContent).toBe('7. ročník')
		expect(headers[4].textContent).toBe('8. ročník')
		expect(headers[5].textContent).toBe('9. ročník')
	})

	test('renders one row per topic plus header', () => {
		renderTableView(TOPICS, SUBJECT, 'all')

		const rows = screen.getAllByRole('row')
		expect(rows).toHaveLength(TOPICS.length + 1)
	})

	test('topic name links to overview page', () => {
		renderTableView(TOPICS, SUBJECT, 'all')

		const link1 = screen.getByText(TOPICS[0].title).closest('a')
		expect(link1?.getAttribute('href')).toBe('/matematika/01-pocetni-operace/')

		const link2 = screen.getByText(TOPICS[1].title).closest('a')
		expect(link2?.getAttribute('href')).toBe(
			'/matematika/02-zaokrouhlovani-a-odhady/',
		)
	})

	test('available grade cells contain links with correct hrefs', () => {
		renderTableView(TOPICS, SUBJECT, 'all')

		// Topic 1 has all grades — row 2 (index 1) should have 4 grade links
		const rows = screen.getAllByRole('row')
		const topic1Links = rows[1].querySelectorAll('td[data-grade] a')
		expect(topic1Links).toHaveLength(4)
		expect(topic1Links[0].getAttribute('href')).toBe(
			'/matematika/01-pocetni-operace/6-rocnik',
		)
		expect(topic1Links[1].getAttribute('href')).toBe(
			'/matematika/01-pocetni-operace/7-rocnik',
		)
		expect(topic1Links[2].getAttribute('href')).toBe(
			'/matematika/01-pocetni-operace/8-rocnik',
		)
		expect(topic1Links[3].getAttribute('href')).toBe(
			'/matematika/01-pocetni-operace/9-rocnik',
		)
	})

	test('unavailable grade cells show em dash', () => {
		renderTableView(TOPICS, SUBJECT, 'all')

		// Topic 2 has grades [6, 7] — grades 8 and 9 should show "—"
		const rows = screen.getAllByRole('row')
		const gradeCells = rows[2].querySelectorAll('td[data-grade]')
		expect(gradeCells[2].textContent).toBe('—')
		expect(gradeCells[3].textContent).toBe('—')
		// Grades 6 and 7 should have links, not dashes
		expect(gradeCells[0].querySelector('a')).not.toBeNull()
		expect(gradeCells[1].querySelector('a')).not.toBeNull()
	})

	test('all columns unmuted when grade is "all"', () => {
		renderTableView(TOPICS, SUBJECT, 'all')

		const table = screen.getByRole('table')
		const mutedCells = table.querySelectorAll('[data-muted]')
		expect(mutedCells).toHaveLength(0)
	})

	test('non-selected grade columns are muted', () => {
		renderTableView(TOPICS, SUBJECT, '7')

		const table = screen.getByRole('table')

		// Grade 7 should not be muted
		const grade7Cells = table.querySelectorAll('[data-grade="7"]')
		for (const cell of grade7Cells) {
			expect(cell.hasAttribute('data-muted')).toBe(false)
		}

		// Grades 6, 8, 9 should be muted
		for (const g of ['6', '8', '9']) {
			const cells = table.querySelectorAll(`[data-grade="${g}"]`)
			for (const cell of cells) {
				expect(cell.hasAttribute('data-muted')).toBe(true)
			}
		}
	})

	test('muting updates reactively when grade changes', () => {
		const { setGrade } = renderTableView(TOPICS, SUBJECT, 'all')

		const table = screen.getByRole('table')

		// Initially no muted cells
		expect(table.querySelectorAll('[data-muted]')).toHaveLength(0)

		setGrade('6')

		// Grade 7 should now be muted
		const grade7Cells = table.querySelectorAll('[data-grade="7"]')
		for (const cell of grade7Cells) {
			expect(cell.hasAttribute('data-muted')).toBe(true)
		}

		// Grade 6 should not be muted
		const grade6Cells = table.querySelectorAll('[data-grade="6"]')
		for (const cell of grade6Cells) {
			expect(cell.hasAttribute('data-muted')).toBe(false)
		}
	})

	// --- Progress checkboxes ---

	test('shows no checkboxes when progress is undefined', () => {
		renderTableView(TOPICS, SUBJECT, 'all')

		expect(screen.queryAllByRole('checkbox')).toHaveLength(0)
	})

	test('renders checkboxes in available grade cells when progress provided', () => {
		renderTableView(TOPICS, SUBJECT, 'all', { progress: {} })

		// Topic 1: 4 grades + Topic 2: 2 grades = 6 checkboxes
		expect(screen.getAllByRole('checkbox')).toHaveLength(6)
	})

	test('checkbox is checked when progress entry is true', () => {
		renderTableView(TOPICS, SUBJECT, 'all', {
			progress: { 'matematika/01-pocetni-operace/6-rocnik': true },
		})

		const checkbox = screen.getByRole('checkbox', {
			name: '01. Početní operace s celými a racionálními čísly, 6. ročník',
		})
		expect((checkbox as HTMLInputElement).checked).toBe(true)
	})

	test('checkbox is unchecked when progress entry is false or missing', () => {
		renderTableView(TOPICS, SUBJECT, 'all', {
			progress: { 'matematika/01-pocetni-operace/6-rocnik': false },
		})

		const checkbox = screen.getByRole('checkbox', {
			name: '01. Početní operace s celými a racionálními čísly, 6. ročník',
		})
		expect((checkbox as HTMLInputElement).checked).toBe(false)

		// Missing entry — also unchecked
		const missing = screen.getByRole('checkbox', {
			name: '01. Početní operace s celými a racionálními čísly, 7. ročník',
		})
		expect((missing as HTMLInputElement).checked).toBe(false)
	})

	test('each checkbox has descriptive aria-label', () => {
		renderTableView(TOPICS, SUBJECT, 'all', { progress: {} })

		expect(
			screen.getByRole('checkbox', {
				name: '01. Početní operace s celými a racionálními čísly, 6. ročník',
			}),
		).toBeDefined()
		expect(
			screen.getByRole('checkbox', {
				name: '02. Zaokrouhlování a odhady, 7. ročník',
			}),
		).toBeDefined()
	})

	test('unavailable grade cells show em dash even when progress provided', () => {
		renderTableView(TOPICS, SUBJECT, 'all', { progress: {} })

		// Topic 2 has grades [6,7] — grades 8,9 still show "—"
		const rows = screen.getAllByRole('row')
		const gradeCells = rows[2].querySelectorAll('td[data-grade]')
		expect(gradeCells[2].textContent).toBe('—')
		expect(gradeCells[3].textContent).toBe('—')
	})

	test('clicking unchecked checkbox calls onToggle with slug and true', () => {
		const onToggle = vi.fn()
		renderTableView(TOPICS, SUBJECT, 'all', { progress: {}, onToggle })

		const checkbox = screen.getByRole('checkbox', {
			name: '01. Početní operace s celými a racionálními čísly, 6. ročník',
		})
		fireEvent.click(checkbox)

		expect(onToggle).toHaveBeenCalledWith(
			'matematika/01-pocetni-operace/6-rocnik',
			true,
		)
	})

	test('clicking checked checkbox calls onToggle with slug and false', () => {
		const onToggle = vi.fn()
		renderTableView(TOPICS, SUBJECT, 'all', {
			progress: { 'matematika/01-pocetni-operace/6-rocnik': true },
			onToggle,
		})

		const checkbox = screen.getByRole('checkbox', {
			name: '01. Početní operace s celými a racionálními čísly, 6. ročník',
		})
		fireEvent.click(checkbox)

		expect(onToggle).toHaveBeenCalledWith(
			'matematika/01-pocetni-operace/6-rocnik',
			false,
		)
	})

	test('grade links still present alongside checkboxes', () => {
		renderTableView(TOPICS, SUBJECT, 'all', { progress: {} })

		const rows = screen.getAllByRole('row')
		const topic1Links = rows[1].querySelectorAll('td[data-grade] a')
		expect(topic1Links).toHaveLength(4)
		expect(topic1Links[0].getAttribute('href')).toBe(
			'/matematika/01-pocetni-operace/6-rocnik',
		)
	})

	test('checkbox cells get data-muted for non-selected grades', () => {
		renderTableView(TOPICS, SUBJECT, '7', { progress: {} })

		const table = screen.getByRole('table')
		const grade6Cells = table.querySelectorAll('[data-grade="6"]')
		for (const cell of grade6Cells) {
			expect(cell.hasAttribute('data-muted')).toBe(true)
		}
		const grade7Cells = table.querySelectorAll('[data-grade="7"]')
		for (const cell of grade7Cells) {
			expect(cell.hasAttribute('data-muted')).toBe(false)
		}
	})
})

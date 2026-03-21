import { cleanup, fireEvent, render, screen } from '@solidjs/testing-library'
import { createSignal } from 'solid-js'
import { afterEach, describe, expect, test, vi } from 'vitest'
import ViewToggle from '@/components/view-toggle/ViewToggle'
import type { View } from '@/components/view-toggle/view'
import { VIEW_LABELS, VIEWS } from '@/components/view-toggle/view'

function renderWithSignal(initial: View) {
	const onChange = vi.fn()
	const [view] = createSignal<View>(initial)

	render(() => <ViewToggle view={view()} onViewChange={onChange} />)

	return { onChange, view }
}

describe('ViewToggle', () => {
	afterEach(cleanup)

	test('renders a fieldset with 2 radios', () => {
		renderWithSignal('cards')

		expect(screen.getByRole('group')).toBeDefined()
		expect(screen.getAllByRole('radio')).toHaveLength(2)
	})

	test('checks "Karty" when view is "cards"', () => {
		renderWithSignal('cards')

		const radio = screen.getByRole('radio', { name: 'Karty' })
		expect(radio).toBeChecked()
	})

	test('checks "Tabulka" when view is "table"', () => {
		renderWithSignal('table')

		const radio = screen.getByRole('radio', { name: 'Tabulka' })
		expect(radio).toBeChecked()
	})

	test('renders correct label for each option', () => {
		renderWithSignal('cards')

		for (const v of VIEWS) {
			expect(screen.getByRole('radio', { name: VIEW_LABELS[v] })).toBeDefined()
		}
	})

	test('calls onViewChange with value on click', () => {
		const { onChange } = renderWithSignal('cards')

		fireEvent.click(screen.getByRole('radio', { name: 'Tabulka' }))

		expect(onChange).toHaveBeenCalledWith('table')
	})
})

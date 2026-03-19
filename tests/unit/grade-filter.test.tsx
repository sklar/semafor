import { cleanup, fireEvent, render, screen } from '@solidjs/testing-library'
import { createSignal } from 'solid-js'
import { afterEach, describe, expect, test, vi } from 'vitest'
import GradeFilter from '@/components/grade-filter/GradeFilter'
import type { Grade } from '@/components/grade-filter/grade'
import { GRADE_LABELS, GRADES } from '@/components/grade-filter/grade'

function renderWithSignal(initial: Grade) {
	const onChange = vi.fn()
	const [grade] = createSignal<Grade>(initial)

	render(() => <GradeFilter grade={grade} onGradeChange={onChange} />)

	return { onChange, grade }
}

describe('GradeFilter', () => {
	afterEach(cleanup)
	test('renders a fieldset with 5 radios', () => {
		renderWithSignal('all')

		expect(screen.getByRole('group')).toBeDefined()
		expect(screen.getAllByRole('radio')).toHaveLength(5)
	})

	test('checks "Vše" when grade is "all"', () => {
		renderWithSignal('all')

		const radio = screen.getByRole('radio', { name: 'Vše' })
		expect(radio).toBeChecked()
	})

	test('checks matching radio when grade is specific', () => {
		renderWithSignal('7')

		const radio = screen.getByRole('radio', { name: '7. ročník' })
		expect(radio).toBeChecked()
	})

	test('renders correct label for each option', () => {
		renderWithSignal('all')

		for (const g of GRADES) {
			expect(screen.getByRole('radio', { name: GRADE_LABELS[g] })).toBeDefined()
		}
	})

	test('calls onGradeChange with value on click', () => {
		const { onChange } = renderWithSignal('all')

		fireEvent.click(screen.getByRole('radio', { name: '8. ročník' }))

		expect(onChange).toHaveBeenCalledWith('8')
	})
})

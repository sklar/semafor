import { render, screen } from '@solidjs/testing-library'
import { expect, test } from 'vitest'
import Counter from '@/components/solid/Counter'

test('renders with initial count 0', () => {
	render(() => <Counter />)
	expect(screen.getByRole('button').textContent).toBe('Count: 0')
})

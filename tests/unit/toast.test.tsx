import {
	cleanup,
	fireEvent,
	render,
	screen,
	waitFor,
} from '@solidjs/testing-library'
import { afterEach, describe, expect, test, vi } from 'vitest'
import Toast from '@/components/toast/Toast'

describe('Toast', () => {
	afterEach(cleanup)

	test('renders nothing when message is undefined', () => {
		render(() => <Toast message={undefined} />)

		expect(screen.queryByRole('alert')).toBeNull()
	})

	test('renders message with role="alert" and aria-live="polite"', () => {
		render(() => <Toast message="Něco se pokazilo" />)

		const alert = screen.getByRole('alert')
		expect(alert.textContent).toContain('Něco se pokazilo')
		expect(alert.getAttribute('aria-live')).toBe('polite')
	})

	test('calls onDismiss after duration', async () => {
		const onDismiss = vi.fn()
		render(() => <Toast message="Chyba" onDismiss={onDismiss} duration={50} />)

		expect(onDismiss).not.toHaveBeenCalled()

		await waitFor(() => {
			expect(onDismiss).toHaveBeenCalledOnce()
		})
	})

	test('clicking close button calls onDismiss', () => {
		const onDismiss = vi.fn()
		render(() => <Toast message="Chyba" onDismiss={onDismiss} />)

		fireEvent.click(screen.getByRole('button', { name: /zavřít/i }))

		expect(onDismiss).toHaveBeenCalledOnce()
	})
})

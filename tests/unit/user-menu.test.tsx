import { cleanup, fireEvent, render, screen } from '@solidjs/testing-library'
import { afterEach, describe, expect, test, vi } from 'vitest'
import UserMenu from '@/components/user-menu/UserMenu'
import { authClient } from '@/lib/auth-client'

let mockSession: { user: { name: string; image?: string } } | null = null
let mockError: { status: number } | null = null

vi.mock('@/lib/auth-client', () => ({
	authClient: {
		useSession: () => () => ({
			data: mockSession,
			isPending: false,
			error: mockError,
		}),
		signIn: { social: vi.fn().mockResolvedValue({}) },
		signOut: vi.fn().mockResolvedValue({}),
	},
}))

describe('UserMenu', () => {
	afterEach(() => {
		cleanup()
		mockSession = null
		mockError = null
	})

	test('renders sign-in button when unauthenticated', () => {
		render(() => <UserMenu />)

		expect(screen.getByRole('button', { name: 'Přihlásit se' })).toBeDefined()
	})

	test('hides sign-in button when auth is unavailable', () => {
		mockError = { status: 503 }

		render(() => <UserMenu />)

		expect(screen.queryByRole('button', { name: 'Přihlásit se' })).toBeNull()
	})

	test('clicking sign-in triggers Google OAuth', () => {
		render(() => <UserMenu />)

		fireEvent.click(screen.getByRole('button', { name: 'Přihlásit se' }))

		expect(authClient.signIn.social).toHaveBeenCalledWith({
			provider: 'google',
		})
	})

	test('renders user name and sign-out when authenticated', () => {
		mockSession = { user: { name: 'Jan Novák' } }

		render(() => <UserMenu />)

		expect(screen.getByText('Jan Novák')).toBeDefined()
		expect(screen.getByRole('button', { name: 'Odhlásit' })).toBeDefined()
	})

	test('clicking sign-out triggers sign-out', () => {
		mockSession = { user: { name: 'Jan Novák' } }

		render(() => <UserMenu />)

		fireEvent.click(screen.getByRole('button', { name: 'Odhlásit' }))

		expect(authClient.signOut).toHaveBeenCalled()
	})
})

import { expect, test } from '@playwright/test'

async function mockAuthenticatedSession(
	page: import('@playwright/test').Page,
	progress: Record<string, boolean> = {},
) {
	await page.route('**/api/auth/get-session', (route) =>
		route.fulfill({
			contentType: 'application/json',
			body: JSON.stringify({
				session: { id: 's1', userId: 'u1' },
				user: { id: 'u1', name: 'Test User', email: 'test@example.com' },
			}),
		}),
	)
	await page.route('**/api/progress?**', (route) =>
		route.fulfill({
			contentType: 'application/json',
			body: JSON.stringify(progress),
		}),
	)
}

test('unauthenticated: no progress indicators', async ({ page }) => {
	await page.goto('/matematika/')
	await expect(page.getByTestId('card-view')).toBeVisible()

	// No checkmarks or checkboxes
	await expect(page.getByRole('img', { name: /hotovo/i })).toHaveCount(0)
	await expect(page.getByRole('checkbox')).toHaveCount(0)
})

test('authenticated: card view shows completion checkmarks', async ({
	page,
}) => {
	await mockAuthenticatedSession(page, {
		'matematika/01-pocetni-operace/6-rocnik': true,
		'matematika/01-pocetni-operace/7-rocnik': true,
		'matematika/01-pocetni-operace/8-rocnik': true,
		'matematika/01-pocetni-operace/9-rocnik': true,
	})

	await page.goto('/matematika/')
	await expect(page.getByTestId('card-view')).toBeVisible()
	await expect(page.getByRole('img', { name: /hotovo/i })).toHaveCount(1)
})

test('authenticated: table view shows checkboxes', async ({ page }) => {
	await mockAuthenticatedSession(page)

	await page.goto('/matematika/')
	await page
		.getByRole('group', { name: 'Zobrazení' })
		.getByText('Tabulka')
		.click()
	await expect(page.getByTestId('table-view')).toBeVisible()

	const checkboxes = page.getByRole('checkbox')
	await expect(checkboxes.first()).toBeVisible()
	expect(await checkboxes.count()).toBeGreaterThan(0)
})

test('toggle checkbox sends POST to progress API', async ({ page }) => {
	await mockAuthenticatedSession(page)

	let postBody: Record<string, unknown> | null = null
	await page.route('**/api/progress', (route) => {
		if (route.request().method() === 'POST') {
			postBody = route.request().postDataJSON()
			return route.fulfill({
				contentType: 'application/json',
				body: JSON.stringify({ ...postBody, id: '1', userId: 'u1' }),
			})
		}
		return route.continue()
	})

	await page.goto('/matematika/')
	await page
		.getByRole('group', { name: 'Zobrazení' })
		.getByText('Tabulka')
		.click()
	await expect(page.getByTestId('table-view')).toBeVisible()

	const checkbox = page.getByRole('checkbox').first()
	await checkbox.click()

	await expect.poll(() => postBody).toBeTruthy()
	expect(postBody).toHaveProperty('slug')
	expect(postBody).toHaveProperty('completed', true)
})

test('API error shows toast notification', async ({ page }) => {
	await mockAuthenticatedSession(page)

	await page.route('**/api/progress', (route) => {
		if (route.request().method() === 'POST') {
			return route.fulfill({ status: 500, body: 'Internal Server Error' })
		}
		return route.continue()
	})

	await page.goto('/matematika/')
	await page
		.getByRole('group', { name: 'Zobrazení' })
		.getByText('Tabulka')
		.click()
	await expect(page.getByTestId('table-view')).toBeVisible()

	const checkbox = page.getByRole('checkbox').first()
	await checkbox.click()

	await expect(page.getByRole('alert')).toBeVisible()
})

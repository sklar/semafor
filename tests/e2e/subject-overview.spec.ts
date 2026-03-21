import { expect, test } from '@playwright/test'

const SUBJECT_PAGES = [
	'/cesky-jazyk/',
	'/matematika/',
	'/pohyb-umeni-kultura/',
	'/hry-relaxace-aktivity/',
	'/ja-a-svet/chemie/',
	'/ja-a-svet/clovek-a-svet-prace/',
	'/ja-a-svet/dejepis/',
	'/ja-a-svet/fyzika/',
	'/ja-a-svet/informacni-a-komunikacni-technologie/',
	'/ja-a-svet/prirodopis/',
	'/ja-a-svet/vychova-k-obcanstvi/',
	'/ja-a-svet/vychova-ke-zdravi/',
	'/ja-a-svet/zemepis/',
]

for (const path of SUBJECT_PAGES) {
	test(`hydrates on ${path}`, async ({ page }) => {
		await page.goto(path)
		await expect(page.getByTestId('card-view')).toBeVisible()
		await expect(page.getByRole('radio').first()).toBeVisible()
	})
}

test('grade selection updates card links', async ({ page }) => {
	await page.goto('/matematika/')
	const cardView = page.getByTestId('card-view')
	const firstLink = cardView.getByRole('link').first()

	// Default "Vše" — links point to overview
	await expect(firstLink).toHaveAttribute('href', /\/matematika\/[^/]+\/$/)

	const gradeFilter = page.getByRole('group', { name: 'Ročník' })

	// Select grade 7
	await gradeFilter.getByText('7. ročník').click()
	await expect(firstLink).toHaveAttribute('href', /\/7-rocnik$/)

	// Back to "Vše"
	await gradeFilter.getByText('Vše').click()
	await expect(firstLink).toHaveAttribute('href', /\/matematika\/[^/]+\/$/)
})

test('card click navigates to topic page', async ({ page }) => {
	await page.goto('/matematika/')
	const cardView = page.getByTestId('card-view')
	const firstLink = cardView.getByRole('link').first()
	const href = await firstLink.getAttribute('href')
	expect(href).toBeTruthy()

	await firstLink.click()
	await expect(page).toHaveURL(new RegExp(href as string))
})

test('view selection persists across reload', async ({ page }) => {
	await page.goto('/matematika/')
	await expect(page.getByTestId('card-view')).toBeVisible()

	// Switch to table view
	const viewToggle = page.getByRole('group', { name: 'Zobrazení' })
	await viewToggle.getByText('Tabulka').click()
	await expect(page.getByTestId('table-view')).toBeVisible()

	// Reload — table view should persist
	await page.reload()
	await expect(page.getByTestId('table-view')).toBeVisible()
})

test('grade selection persists across reload', async ({ page }) => {
	await page.goto('/matematika/')
	const gradeFilter = page.getByRole('group', { name: 'Ročník' })

	// Select grade 8
	await gradeFilter.getByText('8. ročník').click()
	const radio = page.getByRole('radio', { name: '8. ročník' })
	await expect(radio).toBeChecked()

	// Reload — grade 8 should persist
	await page.reload()
	await expect(page.getByRole('radio', { name: '8. ročník' })).toBeChecked()
})

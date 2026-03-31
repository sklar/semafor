import { cleanup, render, screen } from '@solidjs/testing-library'
import { createSignal } from 'solid-js'
import { afterEach, describe, expect, test } from 'vitest'
import CardView from '@/components/card-view/CardView'
import type { Grade } from '@/components/grade-filter/grade'
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

function renderCardView(
	topics: Topic[],
	subject: string,
	initial: Grade,
	progress?: Record<string, boolean>,
) {
	const [grade, setGrade] = createSignal<Grade>(initial)

	render(() => (
		<CardView
			topics={topics}
			subject={subject}
			grade={grade()}
			progress={progress}
		/>
	))

	return { setGrade }
}

describe('CardView', () => {
	afterEach(cleanup)

	test('renders a link for each topic', () => {
		renderCardView(TOPICS, SUBJECT, 'all')

		expect(screen.getAllByRole('link')).toHaveLength(2)
	})

	test('each link contains topic title', () => {
		renderCardView(TOPICS, SUBJECT, 'all')

		for (const topic of TOPICS) {
			expect(
				screen.getAllByText(topic.title, { exact: false }).length,
			).toBeGreaterThan(0)
		}
	})

	test('renders description when present', () => {
		renderCardView(TOPICS, SUBJECT, 'all')

		expect(
			screen.getByText(
				'Provádí početní operace s celými a racionálními čísly.',
			),
		).toBeDefined()
	})

	test('omits description when absent', () => {
		renderCardView(TOPICS, SUBJECT, 'all')

		const links = screen.getAllByRole('link')
		// Second topic has no description — link should only contain title text
		expect(links[1].textContent).toBe('02. Zaokrouhlování a odhady')
	})

	test('links point to overview URLs when grade is "all"', () => {
		renderCardView(TOPICS, SUBJECT, 'all')

		const links = screen.getAllByRole('link')
		expect(links[0].getAttribute('href')).toBe(
			'/matematika/01-pocetni-operace/',
		)
		expect(links[1].getAttribute('href')).toBe(
			'/matematika/02-zaokrouhlovani-a-odhady/',
		)
	})

	test('links point to grade-specific URLs when grade is set', () => {
		renderCardView(TOPICS, SUBJECT, '7')

		const links = screen.getAllByRole('link')
		expect(links[0].getAttribute('href')).toBe(
			'/matematika/01-pocetni-operace/7-rocnik',
		)
		expect(links[1].getAttribute('href')).toBe(
			'/matematika/02-zaokrouhlovani-a-odhady/7-rocnik',
		)
	})

	test('links update reactively when grade changes', () => {
		const { setGrade } = renderCardView(TOPICS, SUBJECT, 'all')

		setGrade('8')

		const links = screen.getAllByRole('link')
		expect(links[0].getAttribute('href')).toBe(
			'/matematika/01-pocetni-operace/8-rocnik',
		)
	})

	test('renders cards in topic order', () => {
		renderCardView(TOPICS, SUBJECT, 'all')

		const links = screen.getAllByRole('link')
		expect(links[0].textContent).toContain('01.')
		expect(links[1].textContent).toContain('02.')
	})

	test('shows no completion indicators when progress is undefined', () => {
		renderCardView(TOPICS, SUBJECT, 'all')

		expect(screen.queryAllByRole('img', { name: /hotovo/i })).toHaveLength(0)
	})

	test('shows completion indicator for completed topic', () => {
		renderCardView(TOPICS, SUBJECT, '6', {
			'matematika/01-pocetni-operace/6-rocnik': true,
		})

		expect(screen.queryAllByRole('img', { name: /hotovo/i })).toHaveLength(1)
	})

	test('hides completion indicator for incomplete topic', () => {
		renderCardView(TOPICS, SUBJECT, '6', {
			'matematika/01-pocetni-operace/6-rocnik': false,
		})

		expect(screen.queryAllByRole('img', { name: /hotovo/i })).toHaveLength(0)
	})

	test('shows completion indicator for "all" only when every grade is completed', () => {
		renderCardView(TOPICS, SUBJECT, 'all', {
			'matematika/01-pocetni-operace/6-rocnik': true,
			'matematika/01-pocetni-operace/7-rocnik': true,
			'matematika/01-pocetni-operace/8-rocnik': true,
			'matematika/01-pocetni-operace/9-rocnik': true,
		})

		expect(screen.queryAllByRole('img', { name: /hotovo/i })).toHaveLength(1)
	})

	test('hides completion indicator for "all" when any grade is incomplete', () => {
		renderCardView(TOPICS, SUBJECT, 'all', {
			'matematika/01-pocetni-operace/6-rocnik': true,
			'matematika/01-pocetni-operace/7-rocnik': false,
			'matematika/01-pocetni-operace/8-rocnik': true,
			'matematika/01-pocetni-operace/9-rocnik': true,
		})

		expect(screen.queryAllByRole('img', { name: /hotovo/i })).toHaveLength(0)
	})

	test('shows checkmarks only for completed topics in mixed set', () => {
		renderCardView(TOPICS, SUBJECT, '6', {
			'matematika/01-pocetni-operace/6-rocnik': true,
			'matematika/02-zaokrouhlovani-a-odhady/6-rocnik': false,
		})

		expect(screen.queryAllByRole('img', { name: /hotovo/i })).toHaveLength(1)
	})

	test('muted cards show no completion indicator', () => {
		// Topic 02 has grades [6,7] — grade 8 makes it muted
		renderCardView(TOPICS, SUBJECT, '8', {
			'matematika/02-zaokrouhlovani-a-odhady/8-rocnik': true,
		})

		expect(screen.queryAllByRole('img', { name: /hotovo/i })).toHaveLength(0)
	})

	test('completion indicator updates when grade changes', () => {
		const { setGrade } = renderCardView(TOPICS, SUBJECT, '6', {
			'matematika/01-pocetni-operace/6-rocnik': true,
			'matematika/01-pocetni-operace/7-rocnik': false,
		})

		expect(screen.queryAllByRole('img', { name: /hotovo/i })).toHaveLength(1)

		setGrade('7')

		expect(screen.queryAllByRole('img', { name: /hotovo/i })).toHaveLength(0)
	})
})

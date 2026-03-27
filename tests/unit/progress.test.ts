import { describe, expect, test, vi } from 'vitest'
import { GET, POST } from '@/pages/api/progress'

function mockCtx({
	auth,
	db,
	request,
	url,
}: {
	auth?: unknown
	db?: unknown
	request?: Request
	url?: URL
} = {}) {
	const defaultUrl = 'http://localhost/api/progress?subject=matematika'
	return {
		locals: { auth, db },
		request: request ?? new Request(defaultUrl),
		url: url ?? new URL(defaultUrl),
	} as Parameters<typeof GET>[0]
}

describe('Progress API', () => {
	test('GET returns 401 when unauthenticated', async () => {
		const response = await GET(mockCtx())

		expect(response.status).toBe(401)
	})

	test('GET returns 400 for invalid subject format', async () => {
		const mockAuth = {
			api: {
				getSession: () => Promise.resolve({ user: { id: 'user-1' } }),
			},
		}

		const response = await GET(
			mockCtx({
				auth: mockAuth,
				db: {},
				url: new URL('http://localhost/api/progress?subject=../../x'),
			}),
		)

		expect(response.status).toBe(400)
	})

	test('GET returns 400 for invalid grade format', async () => {
		const mockAuth = {
			api: {
				getSession: () => Promise.resolve({ user: { id: 'user-1' } }),
			},
		}

		const response = await GET(
			mockCtx({
				auth: mockAuth,
				db: {},
				url: new URL(
					'http://localhost/api/progress?subject=matematika&grade=../../x',
				),
			}),
		)

		expect(response.status).toBe(400)
	})

	test('GET returns 500 on DB error', async () => {
		const mockAuth = {
			api: {
				getSession: () => Promise.resolve({ user: { id: 'user-1' } }),
			},
		}
		const mockDb = {
			select: () => ({
				from: () => ({
					where: () => Promise.reject(new Error('DB error')),
				}),
			}),
		}

		const response = await GET(
			mockCtx({
				auth: mockAuth,
				db: mockDb,
			}),
		)

		expect(response.status).toBe(500)
	})

	test('GET returns progress map for subject', async () => {
		const mockDb = {
			select: () => ({
				from: () => ({
					where: () =>
						Promise.resolve([
							{ slug: 'matematika/01/6-rocnik', completed: true },
							{ slug: 'matematika/02/6-rocnik', completed: false },
						]),
				}),
			}),
		}
		const mockAuth = {
			api: {
				getSession: () => Promise.resolve({ user: { id: 'user-1' } }),
			},
		}

		const response = await GET(
			mockCtx({
				auth: mockAuth,
				db: mockDb,
			}),
		)
		const data = await response.json()

		expect(response.status).toBe(200)
		expect(data).toEqual({
			'matematika/01/6-rocnik': true,
			'matematika/02/6-rocnik': false,
		})
	})

	test('GET filters by grade when provided', async () => {
		const whereFn = vi.fn(() =>
			Promise.resolve([{ slug: 'matematika/01/7-rocnik', completed: true }]),
		)
		const mockDb = {
			select: () => ({ from: () => ({ where: whereFn }) }),
		}
		const mockAuth = {
			api: {
				getSession: () => Promise.resolve({ user: { id: 'user-1' } }),
			},
		}

		const response = await GET(
			mockCtx({
				auth: mockAuth,
				db: mockDb,
				url: new URL(
					'http://localhost/api/progress?subject=matematika&grade=7-rocnik',
				),
			}),
		)
		const data = await response.json()

		expect(response.status).toBe(200)
		expect(data).toEqual({ 'matematika/01/7-rocnik': true })
	})

	test('POST returns 401 when unauthenticated', async () => {
		const response = await POST(
			mockCtx({
				request: new Request('http://localhost/api/progress', {
					method: 'POST',
					body: JSON.stringify({
						slug: 'matematika/01/6-rocnik',
						completed: true,
					}),
				}),
			}),
		)

		expect(response.status).toBe(401)
	})

	test('POST returns 400 for malformed JSON body', async () => {
		const mockAuth = {
			api: {
				getSession: () => Promise.resolve({ user: { id: 'user-1' } }),
			},
		}

		const response = await POST(
			mockCtx({
				auth: mockAuth,
				db: {},
				request: new Request('http://localhost/api/progress', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: 'not-json',
				}),
			}),
		)

		expect(response.status).toBe(400)
	})

	test('POST returns 400 for invalid body', async () => {
		const mockAuth = {
			api: {
				getSession: () => Promise.resolve({ user: { id: 'user-1' } }),
			},
		}

		const response = await POST(
			mockCtx({
				auth: mockAuth,
				db: {},
				request: new Request('http://localhost/api/progress', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						slug: '../../etc/passwd',
						completed: true,
					}),
				}),
			}),
		)

		expect(response.status).toBe(400)
	})

	test('POST returns 500 on DB error', async () => {
		const mockAuth = {
			api: {
				getSession: () => Promise.resolve({ user: { id: 'user-1' } }),
			},
		}
		const mockDb = {
			insert: () => ({
				values: () => ({
					onConflictDoUpdate: () => ({
						returning: () => Promise.reject(new Error('DB error')),
					}),
				}),
			}),
		}

		const response = await POST(
			mockCtx({
				auth: mockAuth,
				db: mockDb,
				request: new Request('http://localhost/api/progress', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						slug: 'matematika/01-pocetni-operace/6-rocnik',
						completed: true,
					}),
				}),
			}),
		)

		expect(response.status).toBe(500)
	})

	test('POST upserts progress entry', async () => {
		const insertedRow = {
			id: 'abc',
			userId: 'user-1',
			slug: 'matematika/01/6-rocnik',
			completed: true,
			updatedAt: new Date(),
		}
		const mockDb = {
			insert: () => ({
				values: () => ({
					onConflictDoUpdate: () => ({
						returning: () => Promise.resolve([insertedRow]),
					}),
				}),
			}),
		}
		const mockAuth = {
			api: {
				getSession: () => Promise.resolve({ user: { id: 'user-1' } }),
			},
		}

		const response = await POST(
			mockCtx({
				auth: mockAuth,
				db: mockDb,
				request: new Request('http://localhost/api/progress', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						slug: 'matematika/01/6-rocnik',
						completed: true,
					}),
				}),
			}),
		)
		const data = await response.json()

		expect(response.status).toBe(200)
		expect(data.slug).toBe('matematika/01/6-rocnik')
		expect(data.completed).toBe(true)
	})
})

describe('progressSlug', () => {
	test('constructs slug from subject, topic, and grade', async () => {
		const { progressSlug } = await import('@/lib/progress')

		expect(progressSlug('matematika', '01-pocetni-operace', '6-rocnik')).toBe(
			'matematika/01-pocetni-operace/6-rocnik',
		)
	})
})

describe('isTopicCompleted', () => {
	test('returns true when specific grade is completed', async () => {
		const { isTopicCompleted } = await import('@/lib/progress')

		const progress = { 'matematika/01/6-rocnik': true }

		expect(
			isTopicCompleted(progress, 'matematika', '01', '6-rocnik', [6, 7, 8, 9]),
		).toBe(true)
	})

	test('returns true for "all" when every grade is completed', async () => {
		const { isTopicCompleted } = await import('@/lib/progress')

		const progress = {
			'matematika/01/6-rocnik': true,
			'matematika/01/7-rocnik': true,
			'matematika/01/8-rocnik': true,
			'matematika/01/9-rocnik': true,
		}

		expect(
			isTopicCompleted(progress, 'matematika', '01', 'all', [6, 7, 8, 9]),
		).toBe(true)
	})

	test('returns false for "all" when any grade is incomplete', async () => {
		const { isTopicCompleted } = await import('@/lib/progress')

		const progress = {
			'matematika/01/6-rocnik': true,
			'matematika/01/7-rocnik': false,
			'matematika/01/8-rocnik': true,
			'matematika/01/9-rocnik': true,
		}

		expect(
			isTopicCompleted(progress, 'matematika', '01', 'all', [6, 7, 8, 9]),
		).toBe(false)
	})
})

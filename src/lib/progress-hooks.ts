import type { CreateQueryResult } from '@tanstack/solid-query'
import {
	createMutation,
	createQuery,
	useQueryClient,
} from '@tanstack/solid-query'
import type { Accessor } from 'solid-js'

type ProgressMap = Record<string, boolean>

export class ProgressError extends Error {
	status: number
	constructor(status: number, message: string) {
		super(message)
		this.status = status
	}
}

export async function checkResponse(response: Response): Promise<unknown> {
	if (!response.ok) {
		throw new ProgressError(response.status, `HTTP ${response.status}`)
	}
	try {
		return await response.json()
	} catch {
		throw new ProgressError(response.status, 'Invalid JSON response')
	}
}

/**
 * TanStack Query wrapper for fetching progress data.
 *
 * Fetches `GET /api/progress?subject={subject}` and returns a
 * `{ [slug]: boolean }` map. Only enabled when the user is authenticated.
 *
 * @param subject - Subject slug, e.g. `"matematika"`
 * @param session - Reactive session accessor from `authClient.useSession()`
 * @returns TanStack `CreateQueryResult` with progress map
 */
export function createProgressQuery(
	subject: string,
	session: Accessor<{ data: unknown } | undefined>,
): CreateQueryResult<ProgressMap> {
	return createQuery(() => ({
		queryKey: ['progress', subject],
		queryFn: () =>
			fetch(`/api/progress?${new URLSearchParams({ subject })}`).then(
				checkResponse,
			) as Promise<ProgressMap>,
		enabled: !!session()?.data,
	}))
}

/**
 * TanStack Mutation wrapper for toggling progress.
 *
 * POSTs to `/api/progress` with `{ slug, completed }`.
 * Applies optimistic update to the query cache immediately,
 * reverts on error, and refetches on settle.
 *
 * @param subject - Subject slug for cache key scoping
 * @returns TanStack `CreateMutationResult`
 */
export function createProgressMutation(subject: string) {
	const queryClient = useQueryClient()

	return createMutation(() => ({
		mutationFn: (data: { slug: string; completed: boolean }) =>
			fetch('/api/progress', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(data),
			}).then(checkResponse),
		onMutate: async (data) => {
			await queryClient.cancelQueries({ queryKey: ['progress', subject] })

			const previous = queryClient.getQueryData<ProgressMap>([
				'progress',
				subject,
			])

			queryClient.setQueryData<ProgressMap>(['progress', subject], (old) => ({
				...(old ?? {}),
				[data.slug]: data.completed,
			}))

			return { previous }
		},
		onError: (_err, _data, context) => {
			if (context?.previous) {
				queryClient.setQueryData(['progress', subject], context.previous)
			}
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ['progress', subject] })
		},
	}))
}

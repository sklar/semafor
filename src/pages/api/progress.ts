import type { APIRoute } from 'astro'
import { getProgress, toggleProgress } from '@/lib/progress'

export const GET: APIRoute = async (ctx) => {
	if (!ctx.locals.auth) {
		return new Response(null, { status: 401 })
	}

	const session = await ctx.locals.auth.api.getSession({
		headers: ctx.request.headers,
	})
	if (!session) {
		return new Response(null, { status: 401 })
	}

	const subject = ctx.url.searchParams.get('subject')
	if (!subject) {
		return new Response('Missing subject parameter', { status: 400 })
	}

	const grade = ctx.url.searchParams.get('grade') ?? undefined
	const progress = await getProgress(
		ctx.locals.db,
		session.user.id,
		subject,
		grade,
	)

	return Response.json(progress)
}

export const POST: APIRoute = async (ctx) => {
	if (!ctx.locals.auth) {
		return new Response(null, { status: 401 })
	}

	const session = await ctx.locals.auth.api.getSession({
		headers: ctx.request.headers,
	})
	if (!session) {
		return new Response(null, { status: 401 })
	}

	const body = await ctx.request.json()
	const row = await toggleProgress(
		ctx.locals.db,
		session.user.id,
		body.slug,
		body.completed,
	)

	return Response.json(row)
}

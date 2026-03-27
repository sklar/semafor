import type { APIRoute } from 'astro'
import {
	getProgress,
	isGradeParam,
	isProgressBody,
	isSubjectParam,
	toggleProgress,
} from '@/lib/progress'

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
	if (!isSubjectParam(subject)) {
		return new Response('Invalid subject', { status: 400 })
	}

	const grade = ctx.url.searchParams.get('grade') ?? undefined
	if (grade !== undefined && !isGradeParam(grade)) {
		return new Response('Invalid grade', { status: 400 })
	}

	try {
		const progress = await getProgress(
			ctx.locals.db,
			session.user.id,
			subject,
			grade,
		)
		return Response.json(progress)
	} catch (err) {
		console.error('[progress]', err)
		return new Response('Internal error', { status: 500 })
	}
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

	let body: unknown
	try {
		body = await ctx.request.json()
	} catch {
		return new Response('Invalid JSON', { status: 400 })
	}

	if (!isProgressBody(body)) {
		return new Response('Invalid body', { status: 400 })
	}

	try {
		const row = await toggleProgress(
			ctx.locals.db,
			session.user.id,
			body.slug,
			body.completed,
		)
		return Response.json(row)
	} catch (err) {
		console.error('[progress]', err)
		return new Response('Internal error', { status: 500 })
	}
}

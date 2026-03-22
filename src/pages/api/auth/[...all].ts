import type { APIRoute } from 'astro'

export const ALL: APIRoute = async (ctx) => {
	if (!ctx.locals.auth) {
		return new Response('Auth not available', { status: 503 })
	}
	return ctx.locals.auth.handler(ctx.request)
}

import { defineMiddleware } from 'astro:middleware'
import { createDb } from '@/db'
import { createAuth } from '@/lib/auth'

async function getD1() {
	try {
		const mod = await (Function(
			'return import("cloudflare:workers")',
		)() as Promise<{ env: { DB?: unknown } }>)
		return mod.env.DB
	} catch {
		// Not in workerd (Node.js prerender / local dev without wrangler).
	}
}

export const onRequest = defineMiddleware(async (ctx, next) => {
	const db = await getD1()
	if (db) {
		ctx.locals.db = createDb(db)
		ctx.locals.auth = createAuth(ctx.locals.db)
	}
	return next()
})

import { defineMiddleware } from 'astro:middleware'
import { createDb } from '@/db'
import { createAuth } from '@/lib/auth'

export const onRequest = defineMiddleware(async (ctx, next) => {
	try {
		const { env } = await import('cloudflare:workers')
		if (env.DB) {
			ctx.locals.db = createDb(env.DB)
			ctx.locals.auth = createAuth(ctx.locals.db)
		}
	} catch {
		// cloudflare:workers import fails during Node.js prerendering — expected.
	}
	return next()
})

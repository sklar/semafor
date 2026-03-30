import { defineMiddleware } from 'astro:middleware'
import { createDb } from '@/db'
import { createAuth } from '@/lib/auth'

let platformEnv: Record<string, unknown> | undefined

/**
 * Obtain the D1 database binding.
 *
 * Astro's Cloudflare adapter runs middleware in two different environments
 * during dev: workerd (SSR via Miniflare) and Node.js (prerender + API routes).
 * `cloudflare:workers` only provides real bindings in workerd. In Node.js it
 * either throws or returns a stub with empty `env` (see prerender-stub in
 * starlight-cloudflare-compat plugin). When the binding is missing we fall
 * back to wrangler's `getPlatformProxy()` which gives us a local SQLite-backed
 * D1 that works in Node.js.
 *
 * The `import.meta.env.DEV` guard ensures Rollup tree-shakes the wrangler
 * import out of the production bundle (wrangler is a devDependency).
 *
 * In production everything runs in workerd, so `cloudflare:workers` works
 * directly — no fallback needed.
 *
 * @see https://github.com/withastro/astro/issues/13523
 */
async function getD1() {
	if (import.meta.env.DEV) {
		try {
			const { env } = await import('cloudflare:workers')
			if ((env as { DB?: unknown }).DB) return (env as { DB?: unknown }).DB
		} catch {
			// Not in workerd and no stub — plain Node.js environment.
		}
		if (!platformEnv) {
			const { getPlatformProxy } = await import('wrangler')
			const proxy = await getPlatformProxy()
			platformEnv = proxy.env as Record<string, unknown>
		}
		return platformEnv.DB
	}
	const { env } = await import('cloudflare:workers')
	return (env as { DB?: unknown }).DB
}

export const onRequest = defineMiddleware(async (ctx, next) => {
	const d1 = await getD1()
	if (d1) {
		ctx.locals.db = createDb(d1)
		ctx.locals.auth = createAuth(ctx.locals.db)
	}
	return next()
})

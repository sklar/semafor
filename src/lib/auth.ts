import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from 'astro:env/server'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import type { createDb } from '@/db'

/**
 * Create a Better Auth instance with Drizzle adapter and Google OAuth.
 *
 * Called per-request from middleware — D1 binding is only available
 * at runtime via the Cloudflare Workers environment.
 *
 * @param db - Drizzle D1 database instance from `createDb()`
 * @returns Better Auth instance with `.handler()` and `.api` methods
 */
export function createAuth(db: ReturnType<typeof createDb>) {
	return betterAuth({
		database: drizzleAdapter(db, { provider: 'sqlite' }),
		socialProviders: {
			google: {
				clientId: GOOGLE_CLIENT_ID ?? '',
				clientSecret: GOOGLE_CLIENT_SECRET ?? '',
			},
		},
	})
}

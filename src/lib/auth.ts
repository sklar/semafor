import { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from 'astro:env/server'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import type { createDb } from '@/db'

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

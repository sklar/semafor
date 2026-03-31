import type { AnyD1Database } from 'drizzle-orm/d1'
import { drizzle } from 'drizzle-orm/d1'
import * as authSchema from './auth-schema'
import * as schema from './schema'

export function createDb(d1: AnyD1Database) {
	return drizzle(d1, { schema: { ...schema, ...authSchema } })
}

/// <reference path="../node_modules/@astrojs/starlight/virtual.d.ts" />
/// <reference path="../node_modules/@astrojs/starlight/virtual-internal.d.ts" />

declare module 'cloudflare:workers' {
	const env: {
		DB: import('drizzle-orm/d1').AnyD1Database
	}
	export { env }
}

declare namespace App {
	interface Locals {
		db: ReturnType<typeof import('./db').createDb>
		auth: ReturnType<typeof import('./lib/auth').createAuth>
	}
}

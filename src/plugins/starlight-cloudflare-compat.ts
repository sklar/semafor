/**
 * Workarounds for Starlight + Cloudflare adapter dev mode.
 *
 * 1. Starlight virtual modules (`virtual:starlight/*`) aren't excluded from
 *    the SSR/prerender optimizer — add them manually.
 *    @see https://github.com/withastro/starlight/issues/2875
 *
 * 2. `cloudflare:workers` is only available in the workerd runtime. The
 *    prerender environment (Node.js) can't resolve it, so we stub it with
 *    an empty `env` — the middleware safely skips D1/auth setup when `env.DB`
 *    is undefined.
 *
 * Remove once fixed upstream in Starlight or the Cloudflare adapter.
 */

const STUB_ID = '\0cloudflare-workers-stub'

export function starlightCloudflareCompat() {
	return [
		{
			name: 'starlight-cloudflare-compat:optimize-deps',
			configEnvironment(
				name: string,
				options: { optimizeDeps?: { exclude?: string[] } },
			) {
				if (['ssr', 'prerender'].includes(name)) {
					options.optimizeDeps ??= {}
					options.optimizeDeps.exclude ??= []
					options.optimizeDeps.exclude.push(
						'virtual:starlight/*',
						'@astrojs/starlight',
						'@astrojs/starlight/locals',
					)
				}
			},
		},
		{
			name: 'starlight-cloudflare-compat:prerender-stub',
			enforce: 'pre' as const,
			applyToEnvironment(env: { name: string }) {
				return env.name === 'prerender'
			},
			resolveId(id: string) {
				if (id === 'cloudflare:workers') return STUB_ID
			},
			load(id: string) {
				if (id === STUB_ID) return 'export const env = {};'
			},
		},
	]
}

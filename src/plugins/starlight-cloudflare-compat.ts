/**
 * Workaround for Starlight + Cloudflare adapter dev mode incompatibility.
 *
 * The Cloudflare adapter runs SSR inside workerd and pre-bundles dependencies
 * via Vite's `configEnvironment` hook. It excludes `virtual:@astrojs/*` from
 * the optimizer, but Starlight registers its virtual modules under a different
 * namespace (`virtual:starlight/*`). When the optimizer tries to bundle
 * `@astrojs/starlight/locals`, it fails because it can't resolve the
 * `virtual:starlight/*` imports that only exist at runtime.
 *
 * This plugin adds the missing exclusions to the SSR and prerender
 * environments. Build is unaffected — only dev mode triggers the issue.
 *
 * Remove once fixed upstream in Starlight or the Cloudflare adapter.
 *
 * @see https://github.com/withastro/starlight/issues/2875
 */
export function starlightCloudflareCompat() {
	return {
		name: 'starlight-cloudflare-compat',
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
	}
}

import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { playwright } from '@vitest/browser-playwright'
import solidPlugin from 'vite-plugin-solid'
import { defineConfig } from 'vitest/config'

const root = dirname(fileURLToPath(import.meta.url))

export default defineConfig({
	plugins: [solidPlugin()],
	resolve: {
		alias: { '@': resolve(root, 'src') },
	},
	test: {
		include: ['tests/**/*.test.{ts,tsx}'],
		browser: {
			enabled: true,
			provider: playwright(),
			// Show browser: VITEST_HEADED=1 pnpm test
			headless: !process.env.VITEST_HEADED,
			instances: [{ browser: 'chromium' }],
		},
	},
})

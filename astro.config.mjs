// @ts-check
import solidJs from '@astrojs/solid-js'
import starlight from '@astrojs/starlight'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, envField } from 'astro/config'
import { sidebar } from './src/sidebar.config'

const site = process.env.SITE_URL

/** @type {import('@astrojs/starlight/types').StarlightUserConfig['head']} */
const analyticsHead =
	import.meta.env.PROD && process.env.UMAMI_WEBSITE_ID
		? [
				{
					tag: 'script',
					attrs: {
						src: 'https://cloud.umami.is/script.js',
						'data-website-id': process.env.UMAMI_WEBSITE_ID,
						defer: true,
					},
				},
			]
		: []

// https://astro.build/config
export default defineConfig({
	site,
	env: {
		schema: {
			UMAMI_WEBSITE_ID: envField.string({
				context: 'client',
				access: 'public',
				optional: true,
			}),
		},
	},
	// @tailwindcss/vite ships Vite 7 types, Astro 5 bundles Vite 6
	vite: { plugins: [/** @type {any} */ (tailwindcss())] },
	integrations: [
		solidJs({ include: ['**/solid/*'] }),
		starlight({
			title: 'Semafor',
			titleDelimiter: ' – ',
			logo: {
				src: './src/assets/logo.svg',
				replacesTitle: true,
			},

			// i18n
			defaultLocale: 'root',
			locales: {
				root: {
					label: 'Čeština',
					lang: 'cs',
				},
			},

			// other settings
			credits: true,
			lastUpdated: true,
			social: [
				{
					icon: 'github',
					label: 'GitHub',
					href: 'https://github.com/sklar/semafor',
				},
			],

			head: [
				{
					tag: 'meta',
					attrs: { property: 'og:image', content: `${site}/og.webp` },
				},
				{ tag: 'meta', attrs: { property: 'og:image:width', content: '1200' } },
				{ tag: 'meta', attrs: { property: 'og:image:height', content: '630' } },
				{
					tag: 'meta',
					attrs: { name: 'twitter:card', content: 'summary_large_image' },
				},
				{
					tag: 'meta',
					attrs: { name: 'twitter:image', content: `${site}/og.webp` },
				},
				...analyticsHead,
			],

			// overrrides for default components and styles
			components: {
				Footer: './src/components/Footer.astro',
				Hero: './src/components/Hero.astro',
				PageTitle: './src/components/PageTitle.astro',
				Sidebar: './src/components/Sidebar.astro',
				SiteTitle: './src/components/SiteTitle.astro',
			},
			customCss: ['./src/styles/global.css'],

			sidebar,
		}),
	],
})

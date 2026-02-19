// @ts-check
import starlight from '@astrojs/starlight'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
	vite: { plugins: [tailwindcss()] },
	integrations: [
		starlight({
			title: 'Semafor',
			components: {
				PageTitle: './src/components/PageTitle.astro',
			},
			customCss: ['./src/styles/global.css'],
			defaultLocale: 'root',
			locales: {
				root: {
					label: 'Čeština',
					lang: 'cs',
				},
			},
			social: [
				{
					icon: 'github',
					label: 'GitHub',
					href: 'https://github.com/withastro/starlight',
				},
			],
			sidebar: [
				{
					label: 'Český jazyk',
					items: [
						{
							label: '01. Subjektivní a objektivní sdělení',
							collapsed: true,
							autogenerate: {
								directory:
									'cesky-jazyk/01-rozlisuje-subjektivni-a-hodnotici-sdeleni',
							},
						},
						{
							label: '02. Principy respektující komunikace',
							slug: 'cesky-jazyk/02-principy-respektujici-komunikace',
						},
						{
							label: '03. Kultivovaný a přiměřený projev',
							slug: 'cesky-jazyk/03-kultivovany-a-primereny-projev',
						},
					],
				},
			],
		}),
	],
})

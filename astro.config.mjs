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

			// overrrides for default components and styles
			components: {
				Footer: './src/components/Footer.astro',
				PageTitle: './src/components/PageTitle.astro',
				SiteTitle: './src/components/SiteTitle.astro',
			},
			customCss: ['./src/styles/global.css'],

			// sidebar
			sidebar: [
				{
					label: 'Český jazyk',
					collapsed: true,
					items: [
						{
							label: 'Přehled',
							slug: 'cesky-jazyk',
						},
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
							collapsed: true,
							autogenerate: {
								directory: 'cesky-jazyk/02-principy-respektujici-komunikace',
							},
						},
						{
							label: '03. Kultivovaný a přiměřený projev',
							collapsed: true,
							autogenerate: {
								directory: 'cesky-jazyk/03-kultivovany-a-primereny-projev',
							},
						},
						{
							label: '04. Vyjádření názoru a diskuze',
							collapsed: true,
							autogenerate: {
								directory: 'cesky-jazyk/04-vyjadreni-nazoru-a-diskuze',
							},
						},
						{
							label: '05. Porozumění textu a hlavní myšlenky',
							collapsed: true,
							autogenerate: {
								directory: 'cesky-jazyk/05-porozumeni-textu-a-hlavni-myslenky',
							},
						},
						{
							label: '06. Tvořivý koherentní text',
							collapsed: true,
							autogenerate: {
								directory: 'cesky-jazyk/06-tvorivy-koherentni-text',
							},
						},
						{
							label: '07. Kultivovaný projev (→ viz 03)',
							slug: 'cesky-jazyk/07-kultivovany-projev-jazykova-vychova',
						},
						{
							label: '08. Práce s příručkami',
							collapsed: true,
							autogenerate: {
								directory: 'cesky-jazyk/08-prace-s-pravidly-a-priruckami',
							},
						},
						{
							label: '09. Slovní druhy a spisovné tvary',
							collapsed: true,
							autogenerate: {
								directory: 'cesky-jazyk/09-slovni-druhy-a-spisovne-tvary',
							},
						},
						{
							label: '10. Pravopis',
							collapsed: true,
							autogenerate: {
								directory: 'cesky-jazyk/10-pravopis',
							},
						},
						{
							label: '11. Spisovný jazyk a nářečí',
							collapsed: true,
							autogenerate: {
								directory:
									'cesky-jazyk/11-spisovny-jazyk-nareci-obecna-cestina',
							},
						},
						{
							label: '12. Reprodukce a interpretace textu',
							collapsed: true,
							autogenerate: {
								directory: 'cesky-jazyk/12-reprodukce-a-interpretace-textu',
							},
						},
						{
							label: '13. Dojmy z četby a umění',
							collapsed: true,
							autogenerate: {
								directory: 'cesky-jazyk/13-dojmy-z-cetby-a-umeni',
							},
						},
						{
							label: '14. Tvořivý písemný projev',
							collapsed: true,
							autogenerate: {
								directory: 'cesky-jazyk/14-tvorivy-pisemny-projev',
							},
						},
						{
							label: '15. Přehled literatury',
							collapsed: true,
							autogenerate: {
								directory: 'cesky-jazyk/15-prehled-ceske-a-svetove-literatury',
							},
						},
						{
							label: '16. Porovnání různých ztvárnění',
							collapsed: true,
							autogenerate: {
								directory: 'cesky-jazyk/16-porovnani-ruznych-ztvarneni',
							},
						},
						{
							label: '17. Vyhledávání informací',
							collapsed: true,
							autogenerate: {
								directory: 'cesky-jazyk/17-vyhledavani-informaci',
							},
						},
					],
				},
				{
					label: 'Matematika',
					items: [
						{
							label: 'Přehled',
							slug: 'matematika',
						},
						{
							label: '01. Početní operace',
							collapsed: true,
							autogenerate: {
								directory: 'matematika/01-pocetni-operace',
							},
						},
					],
				},
				{
					label: 'Já a svět',
					collapsed: true,
					items: [
						{
							label: 'Přehled',
							slug: 'ja-a-svet',
						},
						{
							label: '01. Věrohodnost informací',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/01-verohodnost-informaci',
							},
						},
					],
				},
				{
					label: 'Pohyb, umění, kultura',
					collapsed: true,
					items: [
						{
							label: 'Přehled',
							slug: 'pohyb-umeni-kultura',
						},
						{
							label: '01. Komplexní dílo',
							collapsed: true,
							autogenerate: {
								directory: 'pohyb-umeni-kultura/01-komplexni-dilo',
							},
						},
					],
				},
				{
					label: 'Hry, relaxace, aktivity',
					collapsed: true,
					items: [
						{
							label: 'Přehled',
							slug: 'hry-relaxace-aktivity',
						},
						{
							label: '01. Empatie sám sobě',
							collapsed: true,
							autogenerate: {
								directory: 'hry-relaxace-aktivity/01-empatie-sam-sobe',
							},
						},
					],
				},
			],
		}),
	],
})

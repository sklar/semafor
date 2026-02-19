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
					slug: 'matematika',
					collapsed: true,
				},
				{
					label: 'Já a svět',
					slug: 'ja-a-svet',
					collapsed: true,
				},
				{
					label: 'Pohyb, umění, kultura',
					slug: 'pohyb-umeni-kultura',
					collapsed: true,
				},
				{
					label: 'Hry, relaxace, aktivity',
					slug: 'hry-relaxace-aktivity',
					collapsed: true,
				},
			],
		}),
	],
})

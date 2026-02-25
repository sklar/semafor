// @ts-check
import starlight from '@astrojs/starlight'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, envField } from 'astro/config'

/** @type {import('@astrojs/starlight/types').StarlightUserConfig['head']} */
const head =
	import.meta.env.PROD && import.meta.env.UMAMI_WEBSITE_ID
		? [
				{
					tag: 'script',
					attrs: {
						src: 'https://cloud.umami.is/script.js',
						'data-website-id': import.meta.env.UMAMI_WEBSITE_ID,
						defer: true,
					},
				},
			]
		: []

// https://astro.build/config
export default defineConfig({
	env: {
		schema: {
			UMAMI_WEBSITE_ID: envField.string({
				context: 'client',
				access: 'public',
				optional: true,
			}),
		},
	},
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

			// analytics (production only, requires UMAMI_WEBSITE_ID env var)
			head,

			// overrrides for default components and styles
			components: {
				Footer: './src/components/Footer.astro',
				PageTitle: './src/components/PageTitle.astro',
				Sidebar: './src/components/Sidebar.astro',
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
					collapsed: true,
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
						{
							label: '02. Zaokrouhlování a odhady',
							collapsed: true,
							autogenerate: {
								directory: 'matematika/02-zaokrouhlovani-a-odhady',
							},
						},
						{
							label: '03. Dělitelnost',
							collapsed: true,
							autogenerate: {
								directory: 'matematika/03-delitelnost',
							},
						},
						{
							label: '04. Celek a část',
							collapsed: true,
							autogenerate: {
								directory: 'matematika/04-celek-cast',
							},
						},
						{
							label: '05. Algebraické výrazy',
							collapsed: true,
							autogenerate: {
								directory: 'matematika/05-algebraicke-vyrazy',
							},
						},
						{
							label: '06. Vlastnosti rovinných útvarů',
							collapsed: true,
							autogenerate: {
								directory: 'matematika/06-vlastnosti-rovinnych-utvaru',
							},
						},
						{
							label: '07. Třídění rovinných útvarů',
							collapsed: true,
							autogenerate: {
								directory: 'matematika/07-trideni-rovinnych-utvaru',
							},
						},
						{
							label: '08. Velikost úhlu',
							collapsed: true,
							autogenerate: {
								directory: 'matematika/08-velikost-uhlu',
							},
						},
						{
							label: '09. Obsah a obvod',
							collapsed: true,
							autogenerate: {
								directory: 'matematika/09-obsah-a-obvod',
							},
						},
						{
							label: '10. Množiny bodů',
							collapsed: true,
							autogenerate: {
								directory: 'matematika/10-mnoziny-bodu-a-konstrukce',
							},
						},
						{
							label: '11. Náčrt a konstrukce',
							collapsed: true,
							autogenerate: {
								directory: 'matematika/11-nacrt-a-konstrukce',
							},
						},
						{
							label: '12. Shodnost a podobnost',
							collapsed: true,
							autogenerate: {
								directory: 'matematika/12-shodnost-a-podobnost',
							},
						},
						{
							label: '13. Středová a osová souměrnost',
							collapsed: true,
							autogenerate: {
								directory: 'matematika/13-stredova-a-osova-soumernost',
							},
						},
						{
							label: '14. Prostorové útvary',
							collapsed: true,
							autogenerate: {
								directory: 'matematika/14-prostorove-utvary',
							},
						},
						{
							label: '15. Objem a povrch',
							collapsed: true,
							autogenerate: {
								directory: 'matematika/15-objem-a-povrch',
							},
						},
						{
							label: '16. Sítě těles',
							collapsed: true,
							autogenerate: {
								directory: 'matematika/16-site-teles',
							},
						},
						{
							label: '17. Zobrazení těles',
							collapsed: true,
							autogenerate: {
								directory: 'matematika/17-zobrazeni-teles',
							},
						},
						{
							label: '18. Aplikační geometrické úlohy',
							collapsed: true,
							autogenerate: {
								directory: 'matematika/18-aplikacni-geometricke-ulohy',
							},
						},
						{
							label: '19. Poměr a měřítko',
							collapsed: true,
							autogenerate: {
								directory: 'matematika/19-pomer-a-meritko',
							},
						},
						{
							label: '20. Procenta',
							collapsed: true,
							autogenerate: {
								directory: 'matematika/20-procenta',
							},
						},
						{
							label: '21. Rovnice a soustavy',
							collapsed: true,
							autogenerate: {
								directory: 'matematika/21-rovnice-a-soustavy',
							},
						},
						{
							label: '22. Řešení problémů',
							collapsed: true,
							autogenerate: {
								directory: 'matematika/22-reseni-problemu',
							},
						},
						{
							label: '23. Vyhledávání dat',
							collapsed: true,
							autogenerate: {
								directory: 'matematika/23-vyhledavani-dat',
							},
						},
						{
							label: '24. Porovnávání dat',
							collapsed: true,
							autogenerate: {
								directory: 'matematika/24-porovnavani-dat',
							},
						},
						{
							label: '25. Přímá a nepřímá úměrnost',
							collapsed: true,
							autogenerate: {
								directory: 'matematika/25-prima-a-nepima-umernost',
							},
						},
						{
							label: '26. Funkční vztahy',
							collapsed: true,
							autogenerate: {
								directory: 'matematika/26-funkcni-vztahy',
							},
						},
						{
							label: '27. Matematizace situací',
							collapsed: true,
							autogenerate: {
								directory: 'matematika/27-matematizace-situaci',
							},
						},
						{
							label: '28. Logická úvaha',
							collapsed: true,
							autogenerate: {
								directory: 'matematika/28-logicka-uvaha',
							},
						},
						{
							label: '29. Prostorová představivost',
							collapsed: true,
							autogenerate: {
								directory: 'matematika/29-prostorova-predstavivost',
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
						// ICT
						{
							label: '01. Věrohodnost informací',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/01-verohodnost-informaci',
							},
						},
						{
							label: '02. Textové a grafické editory',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/02-textove-a-graficke-editory',
							},
						},
						{
							label: '03. Typografická pravidla',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/03-typograficka-pravidla',
							},
						},
						{
							label: '04. Duševní vlastnictví',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/04-dusevni-vlastnictvi',
							},
						},
						{
							label: '05. Vyhodnocování informací',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/05-vyhodnocovani-informaci',
							},
						},
						{
							label: '06. Prezentace informací',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/06-prezentace-informaci',
							},
						},
						// Výchova k občanství
						{
							label: '07. Vztahy a společnost',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/07-vztahy-a-spolecnost',
							},
						},
						{
							label: '08. Demokratické přístupy',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/08-demokraticke-pristupy',
							},
						},
						{
							label: '09. Kritické myšlení a média',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/09-kriticke-mysleni-a-media',
							},
						},
						{
							label: '10. Konflikty a mediace',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/10-konflikty-a-mediace',
							},
						},
						{
							label: '11. Sebeřízení a kooperace',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/11-seberizeni-a-kooperace',
							},
						},
						{
							label: '12. Školní samospráva',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/12-skolni-samosprava',
							},
						},
						{
							label: '13. Vnitřní motivace',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/13-vnitrni-motivace',
							},
						},
						{
							label: '14. Potřeby a sebevyjádření',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/14-potreby-a-sebevyjadreni',
							},
						},
						{
							label: '15. Talenty a sebeúcta',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/15-talenty-a-sebeucta',
							},
						},
						{
							label: '16. Hospodaření',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/16-hospodareni',
							},
						},
						{
							label: '17. Formy vlastnictví',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/17-formy-vlastnictvi',
							},
						},
						{
							label: '18. Finanční gramotnost',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/18-financni-gramotnost',
							},
						},
						{
							label: '19. Trh a hospodaření státu',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/19-trh-a-hospodareni-statu',
							},
						},
						{
							label: '20. Aktivní občan',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/20-aktivni-obcan',
							},
						},
						{
							label: '21. Rozdělení moci',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/21-rozdeleni-moci',
							},
						},
						{
							label: '22. Ochrana práv a svobod',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/22-ochrana-prav-a-svobod',
							},
						},
						{
							label: '23. Pravidla a zodpovědnost',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/23-pravidla-a-zodpovednost',
							},
						},
						{
							label: '24. Právní stát',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/24-pravni-stat',
							},
						},
						{
							label: '25. Odpovědnost za jednání',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/25-odpovednost-za-jednani',
							},
						},
						// Mezinárodní vztahy
						{
							label: '26. Mezinárodní vztahy',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/26-mezinarodni-vztahy',
							},
						},
						{
							label: '27. Globální a lokální příležitosti',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/27-globalni-a-lokalni-prilezitosti',
							},
						},
						{
							label: '28. Globální problémy jako příležitosti',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/28-globalni-problemy-jako-prilezitosti',
							},
						},
						{
							label: '29. Propojenost světa',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/29-propojenost-sveta',
							},
						},
						// Výchova ke zdraví
						{
							label: '30. Pozitivní zaměření',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/30-pozitivni-zamereni',
							},
						},
						{
							label: '31. Důvěra tělu',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/31-duvera-telu',
							},
						},
						{
							label: '32. Emoční a sociální inteligence',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/32-emocni-a-socialni-inteligence',
							},
						},
						{
							label: '33. Základní životní potřeby',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/33-zakladni-zivotni-potreby',
							},
						},
						{
							label: '34. Odpovědnost za zdraví',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/34-odpovednost-za-zdravi',
							},
						},
						{
							label: '35. Práce s energií',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/35-prace-s-energii',
							},
						},
						{
							label: '36. Sexualita a vztahy',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/36-sexualita-a-vztahy',
							},
						},
						{
							label: '37. Rizika látek a internetu',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/37-rizika-latek-a-internetu',
							},
						},
						{
							label: '38. Doprava a první pomoc',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/38-doprava-a-prvni-pomoc',
							},
						},
						// Dějepis
						{
							label: '39. Poselství dějin',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/39-poselstvi-dejin',
							},
						},
						{
							label: '40. Časová osa',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/40-casova-osa',
							},
						},
						{
							label: '41. Historické příběhy v souvislostech',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/41-historicke-pribehy-v-souvislostech',
							},
						},
						{
							label: '42. Počátky lidské společnosti',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/42-pocatky-lidske-spolecnosti',
							},
						},
						{
							label: '43. Pravěk v souvislostech',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/43-pravek-v-souvislostech',
							},
						},
						{
							label: '44. Nejstarší civilizace',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/44-nejstarsi-civilizace',
							},
						},
						{
							label: '45. Starověk v souvislostech',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/45-starovek-v-souvislostech',
							},
						},
						{
							label: '46. Středověk — poselství',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/46-stredovek-poselstvi',
							},
						},
						{
							label: '47. Středověk — časová osa',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/47-stredovek-casova-osa',
							},
						},
						{
							label: '48. Středověk v souvislostech',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/48-stredovek-v-souvislostech',
							},
						},
						{
							label: '49. Nová doba — poselství',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/49-nova-doba-poselstvi',
							},
						},
						{
							label: '50. Nová doba — časová osa',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/50-nova-doba-casova-osa',
							},
						},
						{
							label: '51. Nová doba v souvislostech',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/51-nova-doba-v-souvislostech',
							},
						},
						{
							label: '52. Modernizace — poselství',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/52-modernizace-poselstvi',
							},
						},
						{
							label: '53. Modernizace — časová osa',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/53-modernizace-casova-osa',
							},
						},
						{
							label: '54. Modernizace v souvislostech',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/54-modernizace-v-souvislostech',
							},
						},
						{
							label: '55. Moderní doba — poselství',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/55-moderni-doba-poselstvi',
							},
						},
						{
							label: '56. Moderní doba — časová osa',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/56-moderni-doba-casova-osa',
							},
						},
						{
							label: '57. Moderní doba v souvislostech',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/57-moderni-doba-v-souvislostech',
							},
						},
						{
							label: '58. Rozdělený svět — poselství',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/58-rozdeleny-svet-poselstvi',
							},
						},
						{
							label: '59. Rozdělený svět — časová osa',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/59-rozdeleny-svet-casova-osa',
							},
						},
						{
							label: '60. Rozdělený svět v souvislostech',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/60-rozdeleny-svet-v-souvislostech',
							},
						},
						// Fyzika
						{
							label: '61. Měřidla a veličiny',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/61-meridla-a-veliciny',
							},
						},
						{
							label: '62. Molekulové složení látek',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/62-molekulove-slozeni-latek',
							},
						},
						{
							label: '63. Síly',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/63-sily',
							},
						},
						{
							label: '64. Energie',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/64-energie',
							},
						},
						{
							label: '65. Zvuk',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/65-zvuk',
							},
						},
						{
							label: '66. Elektrický obvod',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/66-elektricky-obvod',
							},
						},
						{
							label: '67. Materiály v elektrotechnice',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/67-materialy-v-elektrotechnice',
							},
						},
						{
							label: '68. Světlo',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/68-svetlo',
							},
						},
						// Chemie
						{
							label: '67. Chemická terminologie',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/67-chemicka-terminologie',
							},
						},
						{
							label: '68. Zacházení s látkami',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/68-zachazeni-s-latkami',
							},
						},
						{
							label: '69. Chemické rovnice',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/69-chemicke-rovnice',
							},
						},
						{
							label: '70. Kyseliny, zásady, pH',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/70-kyseliny-zasady-ph',
							},
						},
						{
							label: '71. Látky v běžném životě',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/71-latky-v-beznem-zivote',
							},
						},
						{
							label: '72. Materiálové toky',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/72-materialove-toky',
							},
						},
						{
							label: '73. Chemie pro společnost',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/73-chemie-pro-spolecnost',
							},
						},
						// Přírodopis
						{
							label: '74. Podstata života',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/74-podstata-zivota',
							},
						},
						{
							label: '75. Viry a bakterie',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/75-viry-a-bakterie',
							},
						},
						{
							label: '76. Houby v ekosystému',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/76-houby-v-ekosystemu',
							},
						},
						{
							label: '77. Jedovaté a jedlé houby',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/77-jedovate-a-jedle-houby',
							},
						},
						{
							label: '78. Houby a potrava',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/78-houby-a-potrava',
							},
						},
						{
							label: '79. Skupiny rostlin',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/79-skupiny-rostlin',
							},
						},
						{
							label: '80. Pěstování rostlin',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/80-pestovani-rostlin',
							},
						},
						{
							label: '81. Rostliny a strava',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/81-rostliny-a-strava',
							},
						},
						{
							label: '82. Jedlé rostliny v přírodě',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/82-jedle-rostliny-v-prirode',
							},
						},
						{
							label: '83. Rostliny a prostředí',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/83-rostliny-a-prostredi',
							},
						},
						{
							label: '84. Skupiny živočichů',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/84-skupiny-zivocichu',
							},
						},
						{
							label: '85. Pozorování zvěře',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/85-pozorovani-zvere',
							},
						},
						{
							label: '86. Chov živočicha',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/86-chov-zivocicha',
							},
						},
						{
							label: '87. Druhy živočichů',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/87-druhy-zivocichu',
							},
						},
						{
							label: '88. Význam živočichů',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/88-vyznam-zivocichu',
							},
						},
						{
							label: '89. Živočichové a prostředí',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/89-zivocichove-a-prostredi',
							},
						},
						{
							label: '90. Lidské tělo',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/90-lidske-telo',
							},
						},
						{
							label: '91. Život člověka',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/91-zivot-cloveka',
							},
						},
						{
							label: '92. Původ a vývoj člověka',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/92-puvod-a-vyvoj-cloveka',
							},
						},
						{
							label: '93. Zdravý způsob života',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/93-zdravy-zpusob-zivota',
							},
						},
						{
							label: '94. Běžné nemoci',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/94-bezne-nemoci',
							},
						},
						{
							label: '95. První pomoc',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/95-prvni-pomoc-prirodopis',
							},
						},
						{
							label: '96. Vznik Země',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/96-vznik-zeme',
							},
						},
						{
							label: '97. Změny podnebí',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/97-zmeny-podnebi',
							},
						},
						{
							label: '98. Geologie a krajina',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/98-geologie-a-krajina',
							},
						},
						{
							label: '99. Těžba surovin',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/99-tezba-surovin',
							},
						},
						{
							label: '100. Podnebí a počasí',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/100-podnebi-a-pocasi',
							},
						},
						{
							label: '101. Ekosystémy',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/101-ekosystemy',
							},
						},
						{
							label: '102. Vliv člověka na ekosystém',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/102-vliv-cloveka-na-ekosystem',
							},
						},
						{
							label: '103. Pohyb v přírodě',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/103-pohyb-v-prirode',
							},
						},
						// Zeměpis
						{
							label: '104. Zeměpisné informace',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/104-zemepisne-informace',
							},
						},
						{
							label: '105. Zeměpisná data',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/105-zemepisna-data',
							},
						},
						{
							label: '106. Země ve vesmíru',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/106-zeme-ve-vesmiru',
							},
						},
						{
							label: '107. Mapa světa',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/107-mapa-sveta',
							},
						},
						{
							label: '108. Přírodní podmínky a sídla',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/108-prirodni-podminky-a-sidla',
							},
						},
						{
							label: '109. Světové problémy',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/109-svetove-problemy',
							},
						},
						{
							label: '110. Typy krajin',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/110-typy-krajin',
							},
						},
						{
							label: '111. Člověk a životní prostředí',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/111-clovek-a-zivotni-prostredi',
							},
						},
						{
							label: '112. Česká republika',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/112-ceska-republika',
							},
						},
						{
							label: '113. Terénní výuka',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/113-terenni-vyuka',
							},
						},
						// Člověk a svět práce
						{
							label: '114. Technické materiály',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/114-technicke-materialy',
							},
						},
						{
							label: '115. Technické úkoly',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/115-technicke-ukoly',
							},
						},
						{
							label: '116. Plánování práce',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/116-planovani-prace',
							},
						},
						{
							label: '117. Náčrt výrobku',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/117-nacrt-vyrobku',
							},
						},
						{
							label: '118. Konstrukce a modely',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/118-konstrukce-a-modely',
							},
						},
						{
							label: '119. Montáž a údržba',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/119-montaz-a-udrzba',
							},
						},
						{
							label: '120. Pěstování rostlin',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/120-pestovani-rostlin-prace',
							},
						},
						{
							label: '121. Chov zvířat',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/121-chov-zvirat-prace',
							},
						},
						{
							label: '122. Platební styk',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/122-platebni-styk',
							},
						},
						{
							label: '123. Domácnost',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/123-domacnost',
							},
						},
						{
							label: '124. Kuchyně',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/124-kuchyne',
							},
						},
						{
							label: '125. Experimenty',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/125-experimenty',
							},
						},
						{
							label: '126. Zdroje pro experimenty',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/126-zdroje-pro-experimenty',
							},
						},
						{
							label: '127. Digitální technologie',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/127-digitalni-technologie',
							},
						},
						{
							label: '128. Bezpečnost při práci',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/128-bezpecnost-pri-praci',
							},
						},
						{
							label: '129. Obory a talenty',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/129-obory-a-talenty',
							},
						},
						{
							label: '130. Volba vzdělávání',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/130-volba-vzdelavani',
							},
						},
						{
							label: '131. Silné a slabé stránky',
							collapsed: true,
							autogenerate: {
								directory: 'ja-a-svet/131-silne-a-slabe-stranky',
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
						{
							label: '02. Dějiny umění — hudba',
							collapsed: true,
							autogenerate: {
								directory: 'pohyb-umeni-kultura/02-dejiny-umeni-hudba',
							},
						},
						{
							label: '03. Přesahy žánrů — hudba',
							collapsed: true,
							autogenerate: {
								directory: 'pohyb-umeni-kultura/03-presahy-zanru-hudba',
							},
						},
						{
							label: '04. Umění a identita',
							collapsed: true,
							autogenerate: {
								directory: 'pohyb-umeni-kultura/04-umeni-a-identita',
							},
						},
						{
							label: '05. Sdílení estetických hodnot',
							collapsed: true,
							autogenerate: {
								directory: 'pohyb-umeni-kultura/05-sdileni-estetickych-hodnot',
							},
						},
						{
							label: '06. Komplexní dílo — výtvarné',
							collapsed: true,
							autogenerate: {
								directory: 'pohyb-umeni-kultura/06-komplexni-dilo-vytvarne',
							},
						},
						{
							label: '07. Dějiny umění — výtvarné',
							collapsed: true,
							autogenerate: {
								directory: 'pohyb-umeni-kultura/07-dejiny-umeni-vytvarne',
							},
						},
						{
							label: '08. Přesahy žánrů — výtvarné',
							collapsed: true,
							autogenerate: {
								directory: 'pohyb-umeni-kultura/08-presahy-zanru-vytvarne',
							},
						},
						{
							label: '09. Estetické a mimoestetické funkce',
							collapsed: true,
							autogenerate: {
								directory:
									'pohyb-umeni-kultura/09-esteticke-a-mimoesteticke-funkce',
							},
						},
						{
							label: '10. Místo umění ve společnosti',
							collapsed: true,
							autogenerate: {
								directory: 'pohyb-umeni-kultura/10-misto-umeni-ve-spolecnosti',
							},
						},
						{
							label: '11. Umění a fenomény',
							collapsed: true,
							autogenerate: {
								directory: 'pohyb-umeni-kultura/11-umeni-a-fenomeny',
							},
						},
						{
							label: '12. Sebeřízení a potřeby',
							collapsed: true,
							autogenerate: {
								directory: 'pohyb-umeni-kultura/12-seberizeni-a-potreby',
							},
						},
						{
							label: '13. Rizika psychoaktivních látek',
							collapsed: true,
							autogenerate: {
								directory:
									'pohyb-umeni-kultura/13-rizika-psychoaktivnich-latek',
							},
						},
						{
							label: '14. Pohyb jako sebevyjádření',
							collapsed: true,
							autogenerate: {
								directory: 'pohyb-umeni-kultura/14-pohyb-jako-sebevyjadreni',
							},
						},
						{
							label: '15. Olympijské myšlenky',
							collapsed: true,
							autogenerate: {
								directory: 'pohyb-umeni-kultura/15-olympijske-myslenky',
							},
						},
						{
							label: '16. Organizace turnajů a akcí',
							collapsed: true,
							autogenerate: {
								directory: 'pohyb-umeni-kultura/16-organizace-turnaju-a-akci',
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
						{
							label: '02. Autonomie',
							collapsed: true,
							autogenerate: {
								directory: 'hry-relaxace-aktivity/02-autonomie',
							},
						},
						{
							label: '03. Autentické sebevyjádření',
							collapsed: true,
							autogenerate: {
								directory: 'hry-relaxace-aktivity/03-autenticke-sebevyjadreni',
							},
						},
						{
							label: '04. Odolávání manipulaci',
							collapsed: true,
							autogenerate: {
								directory: 'hry-relaxace-aktivity/04-odolavani-manipulaci',
							},
						},
						{
							label: '05. Vlastní projekty',
							collapsed: true,
							autogenerate: {
								directory: 'hry-relaxace-aktivity/05-vlastni-projekty',
							},
						},
						{
							label: '06. Spolupráce',
							collapsed: true,
							autogenerate: {
								directory: 'hry-relaxace-aktivity/06-spoluprace',
							},
						},
						{
							label: '07. Fenomény prostřednictvím hry',
							collapsed: true,
							autogenerate: {
								directory:
									'hry-relaxace-aktivity/07-fenomeny-prostrednictvim-hry',
							},
						},
						{
							label: '08. Radost skrze hru',
							collapsed: true,
							autogenerate: {
								directory: 'hry-relaxace-aktivity/08-radost-skrze-hru',
							},
						},
						{
							label: '09. Smysl pro humor',
							collapsed: true,
							autogenerate: {
								directory: 'hry-relaxace-aktivity/09-smysl-pro-humor',
							},
						},
					],
				},
			],
		}),
	],
})

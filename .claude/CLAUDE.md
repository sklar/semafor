# Knowledge Base pro domácí vzdělávání

## O projektu

Webová knowledge base pro rodiče-vzdělavatele, kteří domácí formou vzdělávají děti na úrovni 2. stupně ZŠ (6.–9. ročník). Slouží jako průvodce a překladač mezi formálním jazykem RVP/ŠVP a každodenní realitou domácího vzdělávání.

### Problém

Rodiče mají k dispozici Tabulku pokroku — spreadsheet s výstupy podle ŠVP a semaforem (zvládnuto / rozvíjí / začíná / nepozorováno). Tabulka je určena primárně pro inspektory z MŠMT. Pro rodiče je nesrozumitelná — neříká jim, co konkrétně dítě učit, jak poznat pokrok, ani jaké aktivity zvolit.

### Řešení

Statický web (Astro Starlight), kde každý výstup ŠVP má vlastní stránku s:

- srozumitelným vysvětlením, co výstup znamená
- popisem semaforových úrovní pro konkrétní výstup
- checklistem znalostí a dovedností
- příklady z reálného světa
- návrhy aktivit a projektů
- roadmapou (doporučení, kdy se tématu věnovat s ohledem na kognitivní vývoj)
- odkazy na volně dostupné zdroje (české i anglické)
- prerekvizitami a souvislostmi s dalšími výstupy

## Obsahové konvence

### Terminologie

- **dítě** (nikdy „žák" nebo „student")
- **rodič** nebo **vzdělavatel** (nikdy „učitel")
- sekci s tipy pojmenovat **Poznámky** (ne „Poznámky pro učitele")
- tón: přátelský, praktický, povzbuzující — rodič mluví k rodiči

### Struktura stránek

Každý výstup ŠVP = adresář s **přehledovou stránkou** (`index.mdx`) + **ročníkovými podstránkami** (`6-rocnik.mdx` … `9-rocnik.mdx`).

#### Přehledová stránka (`index.mdx`)

1. **Výstup podle ŠVP** — originální znění v `<Banner>` komponentě
2. **Co to znamená?** — srozumitelný překlad do lidské řeči
3. **Kdy se tomu věnovat?** — roadmapa po ročnících, `<Aside type="tip">` pro prerekvizity
4. **Poznámky** — `<Aside>` komponenty (caution pro „Typická past", danger pro „Důležité")
5. **Souvislosti** — `<Badge>` pro kódy předmětů + křížové odkazy. Kanonické zkratky:
   - `ČJ` (Český jazyk)
   - `MAT` (Matematika)
   - `JAS` (Já a svět)
   - `PUK` (Pohyb, umění, kultura)
   - `HRA` (Hry, relaxace, aktivity)
6. **Semafor** — `<Skill>` + `<SkillItem>` (levels: none/novice/adept/master)

#### Ročníková podstránka (`6-rocnik.mdx` … `9-rocnik.mdx`)

1. **Základní pojmy** — `<dl>` definition list, hloubka podle ročníku
2. **Co by mělo dítě znát** — checklist znalostí a dovedností
3. **Příklady z reálného světa** — 5 příkladů přiměřených věku
4. **Aktivity a projekty** — 3–4 aktivity s časovým odhadem
5. **Odkazy a zdroje** — české i anglické, volně dostupné

### Semafor — obecná logika

- **Nepozorováno** — téma jsme neotevřeli nebo dítě nemělo příležitost ukázat dovednost
- **Začíná** — první kontakt s tématem, základní povědomí, potřebuje hodně podpory
- **Rozvíjí** — chápe princip, pracuje s podporou, v jednodušších situacích zvládá samostatně
- **Zvládnuto** — samostatně, plynule, dokáže aplikovat v různých kontextech

## Zdrojová data

Soubor [`resources/tabulka-pokroku.xlsx`](resources/tabulka-pokroku.xlsx) obsahuje kompletní seznam výstupů podle ŠVP pro všechny předměty. Záložky:
- **Český jazyk** — 30 výstupů (Komunikační a slohová výchova, Jazyková výchova, Literární výchova, Integrovaná část v JaS)
- **Matematika 2** — 29 výstupů (Aritmetika a algebra, Geometrie, Integrovaná část v JaS)
- **JaS (Já a svět)** — nejširší předmět
- **Anglický jazyk** — 11 výstupů
- **Španělský jazyk** — 12 výstupů (pouze 8.+9. ročník)
- **PUK (Pohyb, umění, kultura)** — hudební výchova, výtvarná výchova, tělesná výchova
- **HRA (Hry, relaxace, aktivity)** — 9 výstupů

Záložka **semafor** popisuje stupně: zelená=zvládnuto, žlutá=rozvíjí, oranžová=začíná, červená=nepozorováno.

Záložku **Matematika** (ne Matematika 2) ignorovat — je to jen zhuštěný souhrn.

## Vlastní komponenty

- `src/components/Banner.astro` — zobrazuje originální znění výstupu ŠVP
- `src/components/Skill.astro` + `SkillItem.astro` — semaforový indikátor úrovně (levels: `none`/`novice`/`adept`/`master`)
- `src/components/SiteTitle.astro` — logo + název webu v hlavičce

## MDX — známé problémy

- `<->` a podobné vzory s `<` v textu rozbijí JSX parser → používat Unicode šipky (`↔`, `→`, `←`)
- České uvozovky (`„"`) nesmí být uvnitř JSX atributů (např. `text="…"`)

## Navigace

Sidebar config v `astro.config.mjs` — hybridní: manuální skupiny s `autogenerate` pro jednotlivé adresáře.

## JaS — struktura

131 témat v 10 sub-oblastech: ICT (01–06), Výchova k občanství (07–25), Mezinárodní vztahy (26–29), Výchova ke zdraví (30–38), Dějepis (39–60), Fyzika (61–68), Chemie (67ch–73ch), Přírodopis (74–103), Zeměpis (104–113), Člověk a svět práce (114–131).

- Chemie: pouze `8-rocnik.mdx` + `9-rocnik.mdx` (žádný 6./7. ročník)
- Fyzika/Chemie: překryv číslování 67–68 (různé slugy, různé adresáře)

## Aktuální stav

Všech 5 předmětů kompletní (index.mdx + ročníkové podstránky):

| Předmět | Témat | Stránky |
|---------|-------|---------|
| ČJ | 17 | ~85 |
| MAT | 29 | ~145 |
| JaS | 131 | ~655 |
| PUK | 16 | ~80 |
| HRA | 9 | ~45 |

Build: ~1011 stránek, 0 chyb.

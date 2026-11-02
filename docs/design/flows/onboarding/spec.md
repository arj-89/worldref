# Flow spec: 1. Onboarding (home)

Covers the root page `/`, the home `/{lang}/`, the agents page `/{lang}/agents/`, the single bilingual 404, and the shared chrome every page uses (header, menu sheet, language and theme switches, footer, copy actions). Platform-neutral. Approved at Stop 1 together with the wireframe; nothing here is built before approval.

**Status:** Stop 1 approved with changes (`DELEGATED-DECISIONS.md` entry 21); changes applied 02/11/2026
**Approval mode:** Delegated
**Model:** Opus 5.5 (claude-opus-5-5), by the owner's ruling in `DELEGATED-DECISIONS.md` entry 10
**Wording:** `docs/design/flows/onboarding/WORDING.md`
**Wireframe:** `docs/design/flows/onboarding/wireframe.html`

## 1. Goal

A first-time visitor understands what worldref is from one screen, proves it on the real data by typing one query, and reaches a copied install command in at most 2 taps.

## 2. User and context

- **Who:** three kinds of developers (Arabic-only, English-only, bilingual) building a country picker, a phone field, a nationality field or a database seed; and AI agents or the people wiring them.
- **Situation:** mid-task. Most arrive from a search engine with a question ("country list in Arabic", "validate Saudi mobile number regex"), from the GitHub README link, or from the repo's Website field (the root). They are deciding in seconds whether this solves their field.
- **What they know:** what a country picker and E.164 are. They do not know that worldref has native Arabic search, three builds, or that it installs without a registry account.
- **State of mind:** sceptical of country-data packages (every market option fails at least one of Arabic names, nationality by gender, mobile rules). Proof beats claims, so the hero visual is the working search, not a picture.

## 3. Entry points

| Entry | From | Condition |
| --- | --- | --- |
| `/` (root) | Repo Website field, old links, bare domain | With JavaScript: forwards with `location.replace` to the stored switch choice, else `/ar/` when `navigator.languages[0]` starts with `ar`, else `/en/`. Without JavaScript (crawlers included): the bilingual page with two links |
| `/ar/`, `/en/` | Search engines (`hreflang` pairs, `x-default` to root), README links, the language switch on any page | Always the home in that language |
| `/{lang}/agents/` | Home "For AI agents" row, menu, footer, `llms.txt` readers | |
| `404.html` | Any missing path under `/worldref/` | GitHub Pages serves one file for every miss |
| `/{lang}/#policy`, `/{lang}/#faq` | Menu, footer, external links | Anchors on the home; scroll padding keeps the heading clear of the top edge |

## 4. Steps

| # | Screen | Job (one line) | Primary action | Secondary | Taps so far |
| --- | --- | --- | --- | --- | --- |
| 0 | Root `/` (no JavaScript only) | Pick a language | "ادخل بالعربية" or "Continue in English" | none | 1 (0 with JavaScript) |
| 1 | Home, hero | Say what worldref is in one sentence | Install | Build a file | 0 |
| 2 | Home, live search (inside the hero section) | Prove it on the real data | Type a query or tap an example chip | Tap a result: opens the country page (flow 4) | 1 interaction |
| 3 | Install page (flow 2) | Copy the line for the visitor's stack | Copy command on that stack's row | Expand a row for the first call | Install (1), Copy (2) |
| 4 | Home, lower sections | Numbers, ways in, Arabic proof, policy, questions | Each row opens its page | One-country URL copies in 1 tap | reached by scrolling |
| 5 | Agents page | Give an agent everything in one place | Copy command (MCP) | Open each file | 1 tap from the home row, then 1 to copy |
| 6 | 404 | Recover from a dead link | Go to the home page | Search from the 404 | 1 |
| M | Menu sheet (from the header on every page) | Reach every page and both switches | A navigation row | Language and theme switches; Escape or Close | 1 to open |

Home section order (one message each, no two adjacent sections in the same layout family): hero with search (stacked), numbers (2-column grid), "Take only what you need" (row list), "Arabic done natively" (label and value rows), data policy (bulleted text), questions and answers (disclosure list), footer.

The header is not sticky in this flow: it scrolls away, so no bar ever covers content; the footer repeats the navigation and both switches on every page.

## 5. Tap budget

| Path | Happy path | Budget |
| --- | --- | --- |
| Understand what this is | 0 taps (h1 and one sentence on the first screen at 390 px) | 0 |
| Search the real data | 1 interaction (type, or tap one example chip) | 1 |
| Landing to a copied install command | 2 taps to the first copied command for each of the 11 rows with a command: Install, then Copy command (or Copy URL) on the stack's row. Any language leads to Build a file. Kotlin and PHP take one more copy (entry 20) | 2 |
| Landing to a country page | 1 interaction plus 1 tap on the result | not set |
| Copy one country's API URL | 1 tap (Copy URL in "One country by URL") | not set |
| Root to home | 0 with JavaScript, 1 without | not set |

All within budget. The 2-tap install path depends on flow 2 showing every stack's command with its own copy button (no stack picker step); that is how flow 2 is specified. Kotlin and PHP put their two lines in two different destinations, so they take a second copy for the second destination (entry 20: the budget counts one copy per destination).

## 6. States

| Screen | First-run | Empty | Loading | Partial | Error | Offline | Success |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Root | No-JavaScript view: two blocks, each with its own `lang` and `dir`, one sentence and one link | n/a: no data | n/a: static | n/a | n/a: Pages serves this or the 404 | n/a: the browser's own page comes first | n/a: with JavaScript the visitor is forwarded before paint |
| Home search | Empty query: the picker shows `sortCountries(countries, lang, region)` with the visitor's region pinned and tagged "منطقتك / Your region", 4 more rows, then "Show all 242 countries" | No match («الرياض» / Riyadh, since capitals are not searched): one sentence naming the query, one action "Clear search" | Search file not in after 300 ms: 5 skeleton rows shaped like result rows (flag box, name bar); input stays usable and queued text runs when the file lands | Over 8 matches (`+1` gives 30): exact count, first 8 rows, "Show all 30 matches" | Search file failed: cause and fix in one block, "Try again"; the rest of the page is static and unaffected | After the file loaded: an offline line under the chips, search keeps working on the loaded list | A match (`الامارات` finds الإمارات): count, rows, source line "the same `search()` you install"; "URL copied" on the one-country URL |
| Agents | The page as reached | n/a: static list | n/a: static | n/a: static | Clipboard blocked: the command is selected and the message says how to copy by hand | Offline line: copying works, opening files needs a connection | "Command copied" for 2 s |
| 404 | The visitor's language from the path (`/ar/` or `/en/`), else the stored choice, else `navigator.languages`; the other language at the foot. Without JavaScript both blocks render | Search from the 404 with no match: same block as the home | Same skeleton as the home | n/a here: the 8-row cap is designed on the home | Search file failed: same block; the home link still works | Same offline line as the home | A result found from the 404 |
| Menu sheet | Opens over the page as a dialog, focus moves to Close, Escape closes, focus returns to the Menu button | n/a | n/a | n/a | n/a | n/a | n/a |

Every row is captured in both languages and both themes, at default and largest text size.

## 7. Copy

| Screen | Keys |
| --- | --- |
| Chrome (all pages) | `chrome.*`, `switch.*`, `footer.*`, `action.*`, `state.offline.line` |
| Root | `root.line`, `root.enter` |
| Home hero and search | `home.title`, `home.hero.*`, `search.*` |
| Home numbers | `home.facts.*` |
| Home ways in | `home.ways.*`, `action.copy-url`, `action.copied-url` |
| Home Arabic proof | `home.native.*` (output values are library output, shown in the code face) |
| Home policy | `policy.palestine`, `policy.disputed`, `policy.requests`, `policy.full` (entry 14: `README.ar.md#سياسة-البيانات` on Arabic pages, `README.md#data-policy` on English pages) |
| Home questions | `faq.title`, `faq.q1` to `faq.q6`, `faq.a1` to `faq.a6` |
| Agents | `agents.*`, `action.copy-command`, `action.copied-command`, `action.copy.error` |
| 404 | `notfound.*`, `search.*` |

Data values (country names, dial codes, counts, versions) are never copy: they come from `data/meta.json`, `api/v1/index.json` and the search file at build time.

## 8. Motion

| Trigger | Element | Property | From | To | Duration | Easing | Reduce Motion |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Query changes | Result list (the home's one authored moment) | opacity | 0.6 | 1 | 120 ms | ease-out | no change, instant swap |
| Copy succeeds | Copy button label and icon | cross-fade to the "copied" label | 0 | 1 | 150 ms, holds 2 s, returns | ease-out | instant swap, same 2 s hold |
| Menu opens | Menu sheet | opacity and translate on the block axis, 8 px | 0, 8 px | 1, 0 | 180 ms | ease-out | opacity only |
| Page to page | Whole page | View Transitions default cross-fade | | | 200 ms | ease | none |

No scroll-triggered entrances on the home: the page is a reference, and the search is the moment.

## 9. Data entry

One input: the search field. Model question: names, aliases, ISO codes and dial codes are one query type, because `search()` already ranks all of them; no mode switch. The field has a visible label and a hint, no placeholder. It runs on each keystroke because it is a search, not a form: nothing is validated and nothing is submitted. `enterkeyhint="search"`; Enter does nothing beyond closing the keyboard.

## 10. Edge cases

| Case | Behaviour |
| --- | --- |
| Visitor region unknown (`navigator.languages` has no region, e.g. plain `ar`) | No pinned row; the list starts alphabetically; the one-country URL uses `sa` |
| Region is a code not in the data | Treated as unknown; nothing pinned |
| Query with no Arabic letter (`+966`, `KSA`) on an Arabic page | The input switches to `dir="ltr"` so `+966` never shows as `966+`; Arabic queries stay right to left |
| Query in Arabic-Indic or Persian digits (typed by the visitor; the site never prints these digits, entry 15) | Same result as the Western-digit query: `00971` gives الإمارات (the helper converts digits). The query is echoed as typed |
| Query with tashkeel, tatweel or hamza variants | Same result as the bare form |
| Query for a capital or city (الرياض) | Empty state; the sentence says what can be searched |
| Query for a name or code that is not a row (excluded places, the absent state) | The generic empty state, never a special message. The site's own content never prints the name; the empty state echoes the visitor's query as typed |
| `+1`, `+7`, `+44` (shared codes) | Partial state with the exact count; primary rows first, as the helper ranks them |
| Longest names: `Democratic Republic of the Congo`, «الإقليم البريطاني في المحيط الهندي» | Wrap inside the row; the dial code keeps its own column |
| `+970` or `+972` | Palestine |
| JavaScript off | Root shows both links; home renders all static sections; the search area shows the countries index link instead of the input |
| 404 path is an uppercase country URL (`/en/countries/SA/`) | The 404 script forwards with `location.replace` to the lowercase URL when that code exists |
| 404 path has no language prefix | Stored choice, then `navigator.languages`, then Arabic |
| Long Arabic h1 at the largest text size | Wraps to 3 lines; the Install action stays above the fold at default size |
| Clipboard API missing or blocked | Error line under the block, text pre-selected |

## 11. Acceptance list

The reviewer's checklist at Stop 2. Each item is checkable from the evidence board alone.

- [ ] At 390 px, in both languages, the h1, the one sentence and the Install action are visible without scrolling at default text size.
- [ ] 2 taps to the first copied command for each of the 11 rows with a command. Any language leads to Build a file. Kotlin and PHP take one more copy (entry 20). Recording per language for at least JavaScript, Python and the MCP row.
- [ ] Typing `الامارات` returns الإمارات first; the chip `00971` returns الإمارات; `+1` returns 30 matches with 8 shown and "Show all 30 matches"; `الرياض` returns the empty state. The automated digit-vector run against the page (the Arabic-Indic and Persian digit vectors and every search vector in `tests/vectors.json`) gives the same results as `dist/helpers.js`.
- [ ] The empty-query list pins the visitor's region with the "Your region" tag (captured with `ar-SA` and `en-EG` browser languages) and shows no pin when the browser language has no region.
- [ ] Every state in section 6 is rendered in both languages, both themes, default and largest text.
- [ ] Numbers on the page equal `data/meta.json` (242, 5,012, 9, 3) and the kind split (195, 47); the version line shows 1.0.0, CLDR 49.0.0 and libphonenumber v9.0.42, and no date.
- [ ] Root without JavaScript shows both blocks with correct `lang` and `dir`; with JavaScript it forwards by the rule in section 3; `hreflang` ar, en and `x-default` are present.
- [ ] The 404 renders in the path's language with the other language at the foot; without JavaScript both blocks render; it contains no English in the Arabic block and no Arabic in the English block.
- [ ] The language switch keeps the path (`/ar/agents/` to `/en/agents/`); the theme switch has System, Light, Dark with System selected by default; both are segmented switches, in the footer of every page and in the menu sheet.
- [ ] Menu sheet: focus moves in on open, Escape closes, focus returns to the Menu button.
- [ ] Absence scan (entry 14): every file in `site/_out` (HTML, JSON-LD, sitemap, paths, alt text, the search file, the copied data) is scanned for both names in both languages (with and without hamza, case-insensitive), `IL` and `ISR` as standalone tokens (open for the approver: whether the ISO 3166-2 codes `US-IL` Illinois and `RO-IL` Ialomița, present in the data, count as standalone; the designer's check treats a hyphen-joined code as not standalone) (`ILS` passes), `376` as an ISO numeric value, and any `il` path segment or `il.json` / `il.svg` file. Exempt: `llms.txt`, `llms-full.txt` and `AGENTS.md` at the output root, each only while byte-identical to its repo copy. The scan passes.
- [ ] D1 build check (entry 12): the site build runs every search vector in `tests/vectors.json` against the derived search file and against `data/worldref.json` and fails on any difference; the search file keeps the field shape `search()` and `sortCountries()` read, is written to the site output only (never to `data/`), loads after first paint and is fetched same-origin.
- [ ] Western numerals everywhere (no Arabic-Indic or Persian digit in any authored content: chips, rows, sample states, evidence); no em dashes; every Latin identifier isolated (`+966` never flips in Arabic).
- [ ] `FAQPage` JSON-LD on `/ar/` and `/en/` matches the visible questions; `Dataset` JSON-LD on the home.
- [ ] Footer on every page: navigation, repo, issues, licences, citation, the Font Awesome attribution, both switches.
- [ ] Every copy action shows "copied" within 100 ms and returns after 2 s; a blocked clipboard shows the error line with the text selected.
- [ ] No request leaves `arj-89.github.io` on any page (network log).

## 12. Wireframe

`docs/design/flows/onboarding/wireframe.html`: clickable greyscale at 390 px. Screens: Root, Home, Agents, 404, plus the menu sheet from the header. The corner panel (dashed, marked "not part of the design") switches screen, state, language (flips `dir`), theme and visitor region, and counts taps. Copy comes from this flow's `WORDING.md`; country rows come from the real data; search runs the shipped `dist/helpers.js` unchanged. Install, Build and country taps open the other flows' wireframes with language, theme and the tap count carried over.

## 13. Decisions ruled at Stop 1

- **D1. Search file: approved (entry 12).** The site build derives a search file from `data/worldref.json` (iso2, iso3, both names, both alias lists, both sort keys, calling codes with `primary`, continent, kind; 88,719 bytes, 17,886 gzipped), written to the site output only, never to `data/`, loaded after first paint, fetched same-origin. Rows keep the field shape `search()` and `sortCountries()` read, so the shipped helpers run on it unchanged. The build check is in section 11. `api/v1/index.json` stays as published.
- **D3. The policy line and the absence scan: approved with conditions (entry 14).** Site pages omit README policy bullet 1 and show the Palestine, disputed-places and requests bullets, then "Full policy on GitHub" (`README.ar.md#سياسة-البيانات` on Arabic pages, `README.md#data-policy` on English pages). The scan scope, patterns and exemption are in section 11. `policy.requests` and FAQ 4 to 6: approved, entry 14.
- **D4. Arabic-Indic example inputs: rejected (entry 15).** The site renders no Arabic-Indic or Persian digit in any authored content. The example chip is `00971`; the "Arabic done natively" digits row states the behaviour in words with Western-digit output (`home.native.digits.body`, `home.native.digits.result`); the proof is the automated digit-vector run in section 11. No `example_inputs` key in `design-lint.json`. Text a visitor types is shown as typed.

D2 is ruled in flow 3, D5 and D6 in flow 4, D7 in flow 2.

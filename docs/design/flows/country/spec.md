# Flow spec: 4. Country page (and the countries index)

Covers `/{lang}/countries/{iso2}/` (242 rows, 484 pages) and the index `/{lang}/countries/`. Platform-neutral. Approved at Stop 1 together with the wireframe; nothing here is built before approval.

**Status:** draft, 02/11/2026
**Approval mode:** Delegated
**Model:** Opus 5.5 (claude-opus-5-5), by the owner's ruling in `DELEGATED-DECISIONS.md` entry 10
**Wording:** `docs/design/flows/country/WORDING.md` (plus the shared keys in `docs/design/flows/onboarding/WORDING.md`)
**Wireframe:** `docs/design/flows/country/wireframe.html` (every row reachable: open any country from the index, or add `?iso2=xx`)

## 1. Goal

The visitor gets every fact about one country with its source, proves the phone rule on a real number, and takes the country's JSON, without leaving the page.

## 2. User and context

- **Who:** mostly a developer arriving from a search engine with a narrow question ("Saudi mobile number regex", "Palestine dial code", "Egypt weekend days", "nationality of Bahrain in Arabic feminine"); also people browsing from the index or the home search.
- **Situation:** they need one value, exact, and to trust it. Many will copy the value or the JSON URL and leave.
- **What they know:** the country. They may not know the field names, that `null` means unknown, or that the phone rule can be tried here.
- **State of mind:** checking, not exploring. Answer first, sources one tap away (Apple fact sheet reference: label column, facts column, one hairline per row, footnote numbers resolving to a sources list).

## 3. Entry points

| Entry | From | Condition |
| --- | --- | --- |
| `/{lang}/countries/{iso2}/` | Search engines (the main entry; title, `h1` and `Country` JSON-LD carry the name), home search results, the index, phone-tester links to another row | `iso2` lowercase, as in `api/v1/` (entry 7) |
| `/{lang}/countries/{iso2}/#phone` | Links that promise "try a Saudi number" | Scrolls to the phone section |
| `/{lang}/countries/` | Menu, footer, the home's "Show all 242 countries", the country breadcrumb | |
| Uppercase or unknown code | Typed or old links | Uppercase forwards to lowercase from the 404 (flow 1); unknown codes get the 404 |

## 4. Steps

| # | Screen | Job (one line) | Primary action | Secondary | Taps so far |
| --- | --- | --- | --- | --- | --- |
| 1 | Country, header | Name the row: flag, name in the page language, the other language under it, kind, continent, memberships | none | Breadcrumb to the index | 0 |
| 2 | Country, JSON block | Hand over the row as a file | Copy URL (`api/v1/{iso2}.json`) | Open the JSON | 1 |
| 3 | Country, facts | Every module as label and value rows, one section per module, in module order: names and codes, nationality, phone, currency, geography, language and calendar, postal address, emergency and power, sports, subdivisions | none (reading) | Footnote numbers jump to Sources | 0 |
| 4 | Country, phone section | Prove the rule | Check (after typing a number) | Expand the mobile pattern | 1 interaction |
| 5 | Country, sources and editorial decisions | Say where each value came from and which values are decisions | Source links | Emergency links per country | 0 (scroll) |
| 6 | Index | Find a row | Tap a country row | Filter with the same search control as the home | 1 |

Fact rows: the label in the page language with the field name under it in the code face (`capital_ar`), and the value with the other language's value in brackets. Enum values show a label with the raw value beside it (`آسيا asia`). `null` and empty lists read "No source states this"; an emergency service that is `null` reads "No separate number; call 911" when `general` exists (README rule). A footnote number appears on the first row of each run of rows that share a source, so a section with one source carries one number. Countries with several numbering plans or currencies (Palestine: +970 and +972; JOD and the shekel) get one block per plan or currency under a small heading with the code. Subdivisions list code and name; over 20 rows, the first 20 show with "Show all n subdivisions". The address template is rendered as its lines (`[Name] [Organisation] [Street address] [City] [Postal code]`) with the raw `address_format` under it. The riyal sign shows as U+20C1 with its code point beside it, so the screenshot matrix catches a font without the glyph.

Phone tester: a labelled `tel` field (LTR, `inputmode="tel"`, hint under the label, no placeholder) and a Check button; Enter submits. It runs the shipped `parsePhone(input, country, countries)` and `formatNational()`. The country's own plans are in the page, so numbers without a country code, or with this country's code, are checked offline and instantly. A number starting with `+` or `00` and another code needs the other countries' plans: the page fetches `phone.json` (124,737 bytes) once, same origin. The result: one summary line (valid mobile; valid but not mobile; valid where mobile and landline look the same; belongs to another country, with a link to it; too short or long with the valid lengths; right length but no matching pattern; no known code), then the international form to store, the national form, mobile yes or no, and the exact call that produced it.

Index: the search control from flow 1 filtering in place; with no query, the visitor's region pinned on top with "Your region", then 5 continent groups in the page language's alphabetical order, each with its exact count (Africa 58, Americas 55, Asia 50, Europe 52, Oceania 27), rows in `sort_ar` or `sort_en` order. A closing line links to the data policy for anyone who cannot find a place.

## 5. Tap budget

| Path | Happy path | Budget |
| --- | --- | --- |
| Landing to the facts | 0 taps (the first screen at 390 px shows the name, the JSON block and the first facts) | 0 |
| Copy the JSON URL | 1 tap | 1 |
| Check a number | 1 interaction (type, then Check or Enter) | 1 |
| Index to a country | 1 tap (scroll or filter, then the row) | not set |
| See a value's source | 1 tap on its footnote number | not set |

All within budget.

## 6. States

| Screen | First-run | Empty | Loading | Partial | Error | Offline | Success |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Country | Landing on السعودية from a search engine: header, JSON block, facts, empty phone field | A row with empty data: Anguilla (territory, no nationality, no subdivisions: one sentence and "Browse all countries"); and the phone field submitted empty: the error under the field, focus back in it | A number with another country's code (`+971501234567`): skeleton in the result area while `phone.json` loads past 300 ms | A row with nulls and multiples: Palestine, two plans, two currencies, "No source states this" on missing values, editorial decisions with their reasons | `phone.json` failed: cause, fix (try again, or type the number without the code), Try again | Offline line: this country's numbers still check, others need a connection; the static facts are all there | `٠٥٠١٢٣٤٥٦٧` gives "A valid mobile number in السعودية", `+966501234567`, `50 123 4567`; "URL copied" on the JSON block |
| Index | 242 rows grouped with counts, region pinned | No match (`الرياض` / Riyadh): one sentence, Clear search | The search file is still loading when the visitor types: skeleton rows; the static list stays until then | n/a: the index always lists every row, no cap | Search file failed: filtering is off and says so, the full static list remains, Try again | Filtering works on the loaded file; offline line | A filter that matches (`الامارات`) with its count |

Every row captured in both languages, both themes, default and largest text. The country page is also captured for the longest rows: GB (221 subdivisions), US (51 subdivisions, mobile not distinguishable), Palestine (two plans), Anguilla (empty).

## 7. Copy

| Screen | Keys |
| --- | --- |
| Frame | `country.title`, `country.json.*`, `country.null`, `country.yes`, `country.no`, `country.fn`, `action.copy-url`, `action.copied-url` |
| Sections and labels | `country.sec.*`, `country.f.*` |
| Values | `country.v.*`, `addr.*`, `kind.*`, `continent.*`, `group.*`, `day.*`, `driving.*`, `measurement.*`, `cal.*` |
| Phone tester | `country.try.*`, `action.retry`, `state.offline.line` |
| Subdivisions | `country.subs.*` |
| Sources and decisions | `country.src.*`, `country.ovr.why`, `source.*`, `date.both` |
| Index | `index.*`, `search.*` |

## 8. Motion

| Trigger | Element | Property | From | To | Duration | Easing | Reduce Motion |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Check returns (the page's one authored moment) | Result block | opacity and 4 px block-axis translate | 0, 4 px | 1, 0 | 160 ms | ease-out | opacity only |
| Footnote tap | Page scroll to the source, then the source item's background | highlight fades | full | none | 1,200 ms | ease-out | no highlight fade, instant jump |
| Copy URL | Button label | cross-fade to "URL copied" | | | 150 ms, holds 2 s | ease-out | instant swap |

## 9. Data entry

One field, the phone number. Model question: national and international numbers are one type, because `parsePhone` resolves both; no separate "country code" picker on this page (the page is the country). Validation runs on submit (Check or Enter), never per keystroke; the empty error sits under the field and focus returns to it. Arabic-Indic and Persian digits, spaces, dashes and brackets are accepted as typed.

## 10. Edge cases

| Case | Behaviour |
| --- | --- |
| Row with no phone plan (Pitcairn, `PN`) | Phone section shows "No source states this"; no tester |
| Mobile not distinguishable (US, CA) | Summary says both look the same here; "Mobile" shows the helper's raw answer |
| Shared code `+1` numbers typed on a `+1` row | The helper's ranking picks the row by leading digits; a number of another `+1` row links there |
| Number of the absent state's former code on Palestine's page (`+972`) | Valid for Palestine, per policy; no other name is ever printed |
| Very long regex (`+972` mobile pattern is over 200 characters) | Inside a closed disclosure; wraps at any character when open |
| 221 subdivisions (GB) | First 20 rows, then "Show all 221 subdivisions"; the builder link for the full file |
| No subdivisions (44 rows, e.g. Anguilla) | Empty sentence plus "Browse all countries" |
| No nationality (territories other than TW, HK, MO) | All four nationality rows read "No source states this" |
| Emergency: service `null`, `general` set | "No separate number; call {general}" |
| Emergency: all `null` (no confirmed numbers, e.g. `AO`) | Each row reads "No source states this" |
| Source versions that are words or dates (`snapshot`, `verified 2026-11-01`, `archived 2026-04-16`, `8th edition`) | Rendered through WORDING and the date formatter per D5: `تحقّقنا منه في 01/11/2026 الموافق 21 جمادى الأولى 1448 هـ` |
| Override reasons (67 notes, English only in `sources.json`) | Shown under "Editorial decisions in this row" in English with `lang="en"` until D6 is ruled |
| Name in the page language is short (`US`, `UK` are the CLDR short English names) | Shown as stored; the official name row carries the long form |
| Visitor region not in the data | No pinned row in the index |

## 11. Acceptance list

- [ ] For SA, PS, AI, US and GB in both languages, every value on the page equals `api/v1/{iso2}.json` (automated diff of rendered values against the file), and every `null` reads "No source states this".
- [ ] At 390 px the first screen shows the name, the JSON block and at least the first fact row, at default text size.
- [ ] Copy URL copies `https://arj-89.github.io/worldref/api/v1/{iso2}.json` in 1 tap; Open the JSON opens the same URL.
- [ ] Phone tester: `٠٥٠١٢٣٤٥٦٧` on SA is a valid mobile with `+966501234567` and `50 123 4567`; `05123` gives the length message with `9، 10`; `+971501234567` on SA links to الإمارات; empty submit shows the field error and refocuses; results equal `parsePhone` output from `dist/helpers.js` for the vectors in `tests/vectors.json`.
- [ ] Numbers with this country's code or none check with the network off; another code fetches `phone.json` once, same origin.
- [ ] Every value row has a source reachable by a footnote number; numbers count in order of appearance; the Sources list shows name, version (D5), licence and link; emergency rows list the official hostnames.
- [ ] Palestine shows both plans and both currencies, `+970` and `+972` each with their own rows, and the policy-consistent names (`شيكل`, "Shekel").
- [ ] The riyal sign renders as a glyph (not a box) in the chosen font in both themes, with `U+20C1` beside it.
- [ ] Index: 5 groups with counts 58, 55, 50, 52, 27 in the page language's order; region pin captured with `ar-SA`; filter results equal `search()` output.
- [ ] Every state in section 6 rendered in both languages, both themes, default and largest text; no sideways scroll at 390 px for any of the 242 rows (automated scan of all 484 pages).
- [ ] `Country` JSON-LD, title and `h1` carry the name in the page language; `hreflang` pairs link `/ar/countries/{iso2}/` and `/en/countries/{iso2}/`.
- [ ] No page, path, sitemap entry or alt text contains the absent state's name or codes in any language (scan of the generated pages).

## 12. Wireframe

`docs/design/flows/country/wireframe.html`: two screens (Country, Index), every state in the corner panel, visitor region switch for the pin. It embeds the full `data/worldref.json`, `data/subdivisions.json` and `data/sources.json`, so every one of the 242 rows renders from real data (open any row from the index). The phone tester runs the shipped `parsePhone` and `formatNational` unchanged. Gregorian and Hijri dates in Sources come from `Intl` with `islamic-umalqura` and Latin digits, the same approach the site's one formatter will use.

## 13. Decisions needed at Stop 1

- **D5. Version words and source names on Arabic pages.** Entry 8 says strings from `sources.json` and `meta.json` are shown verbatim. Four of them are English words (`snapshot`, `verified 2026-11-01`, `archived 2026-04-16`, `8th edition`), and source names are English sentences, which would put English text in the Arabic build (brief item 15). Proposed: version numbers stay verbatim (`49.0.0`, `v9.0.42`, `2026f`); the four word forms render through `country.src.*` keys with their dates through the site's Gregorian plus Hijri formatter; source names get Arabic forms (`source.*` keys) with the English `name` kept on English pages. The wireframe shows this proposal.
- **D6. Override reasons in Arabic.** The 67 editorial decisions (54 rows) carry English `why` notes only, written in `scripts/editorial.mjs`. Proposed: add a native Arabic reason beside each English one in `scripts/editorial.mjs` so `sources.json` carries both, and show the page language's reason. That is a data-pipeline change outside design scope. Until it lands, Arabic pages show the English reason marked `lang="en"`, which fails the "no English in the Arabic build" check at Stop 2; the alternative is to show only the field name and a link to `sources.json` on Arabic pages.

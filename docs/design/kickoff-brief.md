# Kickoff brief (K1): worldref website

**Project:** worldref, the public bilingual country reference dataset. **Surface:** website only (static export to GitHub Pages at `https://arj-89.github.io/worldref`). **Approval mode:** Delegated (owner ruling, 01/11/2026). **Designer model:** Fable 5.1. **Date:** 01/11/2026.

One batched set, asked once. Every answer below is filled from the request, the Handoff spec (`worldref - Handoff.md` v2.2), the repo records, or the owner's standing rules, and marked with its source. Items that were **OPEN** carry the designer's proposed answer and, below it, the approver's ruling.

**K1 ruled on 02/11/2026** by the approver (Delegated mode, model Fable 5.1). All 9 OPEN items are closed; the rulings are entries 1 to 9 in `DELEGATED-DECISIONS.md`. Nothing is paused for the owner. Design work may proceed to K2.

---

## The product

**1. What is this product for, in one sentence, and who is it for?**

worldref is a free, public reference dataset of every country and territory in Arabic, English, or both (names, nationalities in masculine and feminine, dial codes and mobile validation, capitals, currencies, languages, time zones, address formats, emergency numbers, subdivisions), with code for 8 languages and an MCP server. The website exists so three kinds of developers (Arabic-only, English-only, bilingual) and AI agents can find it, understand it in one sentence, try it on the real data, and install it or download the file they need, within seconds and without an account.

*Source: request; Handoff section 1 and section 9.*

**2. Which surfaces, in order?**

Website only. No iOS, Android or dashboard. The static export is produced in GitHub Actions (`.github/workflows/pages.yml`) and served under the `/worldref/` path on GitHub Pages, alongside the already-live static API (`/api/v1/`), `/schema/`, `/flags/`, `llms.txt`, `llms-full.txt`, `AGENTS.md`, `openapi.json` and `robots.txt`, whose paths must not move.

*Source: request; `site/build.mjs`; Handoff build log.*

**3. Does it have user accounts?**

No. No profile, no settings screen, no cookies, no analytics, no third-party trackers. The product-default minimums that still apply: a language switch and a theme switch (System, Light, Dark; System the default) as segmented switches on every page, and a simple footer on every page (navigation that matters, GitHub repo, issues, licences, data policy, citation). No privacy or terms pages beyond the licence and policy text, since nothing is collected.

*Source: request ("no user accounts"); skill product defaults; "no analytics" is approver assumed from Handoff 3.2 (zero manual work, nothing to maintain) and the public-repo privacy constraint.*

**4. What is uniquely true here that a generic site could not claim?**

- The only permissive-licence dataset that combines Arabic and English names, Arabic nationality in both genders, dial codes and exact mobile validation rules (Handoff section 2: every market leader fails at least one).
- Arabic is native, not transliterated or machine-translated: short common names (السعودية), sort keys that give correct Arabic order, search that ignores «ال», tashkeel, tatweel and hamza forms and accepts Arabic-Indic and Persian digits. The site's search demo runs the shipped helper (`dist/helpers.js`), so what a visitor types is exactly what their app will do.
- Three builds of every file (bilingual, Arabic-only, English-only) and 9 modules joined on `iso2`: a visitor can take only what they need.
- Every column names its source; `null` means unknown and is never filled. The site can say "242 countries, 5012 subdivisions, 9 modules, 8 languages" as real numbers from `data/meta.json`, never rounded.
- Policy stated plainly: Israel absent under any name or code; Palestine with Jerusalem as capital and +970 and +972; disputed places follow Saudi official positions.
- Installs from GitHub alone: no registry account, no API key, no rate limit beyond GitHub Pages.

*Source: Handoff sections 1, 2, 3.1, 7, 8; `data/meta.json`; `llms.txt`.*

---

## Feel and identity

**5. Three to five feel words.**

**Ruled (approver, 02/11/2026, entry 3): exact, calm, native in both languages, fast, trustworthy.** A reference work, not a launch page. The numbers are real, the demo is real, and nothing on the page sells.

*Source: approver ruled, assumed from Handoff section 1 ("built once, correct the first time"), section 3.1 (null never guessed), section 14 (Arabic natively, no marketing padding) and the README tone. No owner record names feel words directly.*

**6. Arabic register.**

Simple and clear (the default), in the modern Saudi professional register already used in `README.ar.md`: direct imperatives («ثبّت»، «نزّل»، «ابحث»), no تم or قم بـ calques, technical identifiers (`iso2`, JSON, `+966`) kept in Latin and isolated with `<bdi>`, Western numerals throughout. One register across the whole site, including the 404 and error states.

*Source: prior record (`README.ar.md`, Handoff 3.3 display rule, section 14); skill copy reference.*

**7. English register.**

Plain, specific developer documentation, as in `README.md`: sentence case, active voice, no exclamation marks, no "Elevate" or "Seamless". Install commands and field names verbatim from the README so the site and the repo never disagree.

*Source: prior record (`README.md`); skill copy reference.*

**8. Is there an existing identity?**

No. The repo carries no logo, colours or type. Two hard rules stand: the studio's own identity (red, favicon, brand, name) never appears, because this is a public repo and the request forbids studio brand, project names and personal data; and the K4 directions stop proposes the identity. The only existing visual assets are the 242 country flags in `flags/*.svg` (flag-icons 7.6.0, MIT), which the site uses instead of emoji flags (Windows renders no emoji flags). The favicon, Open Graph card and style image are generated at K5 from the chosen direction.

*Source: request; skill (identity per project; Bixet identity on the Bixet site only); `flags/`.*

**9. Type: Thmanyah or an alternative?**

Thmanyah is the default, but two of the owner's own rules collide here: the skill's assets reference says font files are never committed to a public repo and never served from a shared host, and the Thmanyah licence record forbids any public endpoint. The site is built by GitHub Actions from this public repo, so the `.woff2` files would have to be committed (public) or fetched from the private `arj-89/thmanyah-fonts` during the build, which needs a personal access token stored as an Actions secret. Secrets are a hard stop, and the Handoff rules out manual steps for the owner.

Proposed answer: **an Arabic-capable pairing from the Google Fonts pool, self-hosted as `.woff2` under the OFL (public-repo safe, no external request, no secret).** Lead candidate: IBM Plex Sans Arabic for body and UI (Arabic and Latin in one family, 7 weights), with each K4 direction free to propose a different pool pairing for display. Thmanyah stays out of this repo.

**Ruled (approver, 02/11/2026, entry 1): the proposed answer stands; not paused.** The owner's global rule covers embedding Thmanyah inside Bixet's own builds without waiting for Thmanyah's written permission. It does not cover committing the files to a public repository: files in `arj-89/worldref` are downloadable as standalone files from github.com and are served at once from `cdn.jsdelivr.net/gh/arj-89/worldref@…`, a documented install path of this very repo, which is the public font endpoint the licence record forbids and the skill rules out in plain words. The skill rule is more specific and more recent than the global rule, so it wins. The secret path is dropped by the owner's zero-manual rule before it reaches the hard stop, so there is nothing to ask. Added condition: the chosen family must render U+20C1 (the riyal sign appears in the currency module) or declare a fallback face for it, checked in the screenshot matrix. Thmanyah remains the default in every other project; `DESIGN.md` records this as a per-project exception. The owner can overturn this entry.

*Source: approver ruled. Skill `references/assets.md` section 4 (Type; Font setup); `~/.claude/CLAUDE.md` Thmanyah rule; `reference_thmanyah_font_kit.md` and `~/Projects/thmanyah-fonts/LICENSE-NOTE.md`; Handoff 3.2, 8, 14; `feedback_arj_hard_rules.md` rule 4.*

**9b. Icons.**

The skill's standard is Font Awesome Pro Plus through the hosted kit script for plain HTML or static sites. The hosted kit runs only on authorised domains, and `arj-89.github.io` is not one; adding it is a one-minute hand step by the owner in the Font Awesome dashboard, and the kit is an external script request on every page. Vendoring Pro icon data into a public repo is a licence problem (recorded in the base-resources notes).

Proposed answer: **Font Awesome Free, a self-hosted inline SVG subset (about 12 icons: search, copy, check, download, external link, language, sun, moon, display, warning, chevron, GitHub brand), classic solid as the one style pack, attribution in the footer licences line.** No external request, no owner action, public-repo safe. The alternative, if the owner prefers the Pro styles, is the hosted kit `f982182577` with `arj-89.github.io` added to its domain list.

**Ruled (approver, 02/11/2026, entry 2): Font Awesome Free, classic solid, bundled in the build.** Either the `@fortawesome/free-*` packages with tree shaking or the inline SVG subset; the builder picks the mechanism. `fa-brands` for the GitHub logo. CC BY 4.0 attribution in the footer licences line. Both Pro paths fail the owner's rules: the npm kit needs a token (a secret) and the hosted kit needs a hand step plus an external request on every page. Pro is not reopened unless the owner adds the domain himself.

*Source: approver ruled. Skill `references/assets.md` section 1; `reference_bixet_base_resources.md` (token in every build; vendored Pro data in a public repo); Handoff 3.2, 14.*

---

## References

**10. Apps or sites admired, and why.**

None sent with the request. K2 therefore runs as a designer shortlist (6 to 10 candidates, one line each on what they teach), from developer data and docs sites with a live demo on the first screen, bilingual developer portals with real RTL, and dataset pages with strong fact tables. Candidate pool for K2 (to be verified live, not yet references): the Unicode CLDR charts, Astro docs, Tailwind docs, Stripe docs, Moyasar docs (Arabic and English), Hudhud developer docs, MDN. The approver picks. Competitor country-data sites (the libphonenumber demo, restcountries, flagcdn) are not in the pool: item 11 blocks them as look references (content coverage only).

**Ruled (approver, 02/11/2026, entry 11, model Opus 5.5):** 7 of the 9 shortlisted references are picked; the list and the K4 direction each one seeds sit at the top of `docs/design/references.md`.

*Source: request (no references sent); skill K2 (nothing sent: search and shortlist).*

**11. Apps or sites to block as references, and why.**

**Ruled (approver, 02/11/2026, entry 9): the list below is approved** and is written into `DESIGN.md` under Blocked at K5. The maps clause is derived from the data policy rather than from an owner statement about design, so it is marked assumed.

- Any studio site or the owner's other project UIs (glitt-store, glittos, qamar): out of scope per Handoff section 14, and referencing them risks leaking project names into a public repo.
- The competing packages' pages listed in Handoff section 2 as design references: studied for content coverage only, never for look.
- Any world-map hero or map imagery: a map must draw borders, and no stock map tile draws Palestine, Western Sahara or the 1948 line the way the data policy requires. Flags carry the geography.
- Generic developer-landing templates with the tells in the websites reference section 4 (gradient text, "AI gradient", version labels in the hero, marquee walls).

*Source: approver assumed from Handoff sections 3.1, 6.2, 14 and the skill websites reference.*

**12. Designer shortlist or the owner's references?**

Designer searches and shortlists; the approver picks (Delegated mode).

*Source: request; skill K2 in Delegated mode.*

---

## Scope and mode

**13. Approval mode.**

Delegated (owner ruling, 01/11/2026). Hard stops stay the owner's: money, making a repo public, deleting data, irreversible migrations, secrets. Item 9 above brushed one (a secret); the approver took the path that needs no secret, so nothing was routed to the owner (entry 1).

*Source: request; `DESIGN.md`; `DELEGATED-DECISIONS.md`.*

**14. The core flows for K3.**

**Ruled (approver, 02/11/2026, entry 4): the four flows and budgets below are approved as tabled; budgets are assumed.** One constraint added for K3: GitHub Pages serves a single `404.html` for every missing path, so the bilingual 404 is one page that picks its language client-side and keeps both languages reachable without JavaScript. Flow 1 is mandatory. For a data and docs site, onboarding means a first-time visitor understanding what this is and reaching an install or a download within seconds.

| # | Flow | Job (one line) | Entry | Primary action | Tap budget |
| --- | --- | --- | --- | --- | --- |
| 1 | Onboarding (home) | Understand what worldref is, prove it on the real data, reach install | `/ar/`, `/en/`, root language pick, search engines, README link | Type in the live search; then "Install" | 0 taps to understand (one sentence, one screen); 1 interaction to search; at most 2 taps from landing to a copied install command |
| 2 | Install per platform | Copy the right install line for one of 11 stacks, then know the first call to make | Home primary action, nav, deep link `#stack` | Copy command | 2 taps (pick stack, copy); 3 with "use only what you need" module choice |
| 3 | Custom-file builder | Choose build (Arabic, English, both), modules, subdivisions, format (JSON, CSV), see the size, download; all client-side from the shipped `data/` files | Home secondary action, nav | Download | At most 5 taps for a non-default file; 1 tap for the full bilingual JSON; when the selection equals a shipped file the CDN URL is offered too |
| 4 | Country page (242 × 2 languages) | Give every fact about one country with its source, prove the phone rule on that country, and offer the JSON | Search engines (the main entry), the home search result, the countries index | Copy or open `api/v1/{iso2}.json`; try a number in the phone field | 0 taps to the facts; 1 tap to the JSON; 1 interaction to validate a number |

Supporting surfaces designed inside these flows, not as separate flows: the countries index (`/{lang}/countries/`), the "for AI agents" page (llms.txt, llms-full.txt, OpenAPI, schemas, MCP command, AGENTS.md), the FAQ (AEO questions from the README, with `FAQPage` JSON-LD), the data policy section, the 404 in both languages, the footer, and the language and theme switches. The flow-1 search demo uses `search()` and `sortCountries()` from the shipped build with the user's region pinned first; the flow-4 phone field uses `parsePhone()` and `formatNational()`; nothing is reimplemented in the site.

States each flow must design (from the skill table): first-run, empty (no search match: one sentence, one action), loading (skeletons for lazy module fetches over 300 ms), partial (a builder selection whose modules are still downloading), error (a fetch that fails: cause, fix, retry), offline (the demo keeps working on already-loaded data and says so), success (copied, downloaded).

*Source: request (core surfaces list); Handoff sections 3.3, 7, 8, 9; `src/helpers.ts`; skill states table. Budgets are approver assumed.*

**15. Anything that must stay untouched, and anything that would feel wrong even if polished.**

Untouched:

- The data, schemas, flags, `llms.txt`, `llms-full.txt`, `AGENTS.md`, `openapi.json`, `robots.txt` and their URLs on Pages. The site is added next to them in `site/build.mjs` output; nothing moves.
- Install commands, field names and policy wording: verbatim from `README.md` and `README.ar.md`.
- Search, sort and phone behaviour: the shipped helpers, pinned by `tests/vectors.json`. The site never ships its own version.
- The root `package.json`: the site's dependencies live in `site/` so `npm i github:arj-89/worldref` installs nothing extra.

Wrong even if polished:

- Any studio brand, project name or personal data in the site or its source (public repo; Handoff gate 8 scans from outside).
- A map, globe or border imagery of any kind (see item 11).
- Marketing tone, fake or rounded numbers, testimonials, logo walls, a "star us" banner, a newsletter form, cookie or consent banners, analytics.
- A server, an API key, a database, a sign-in, or anything that cannot be a static file.
- Eastern Arabic digits, em dashes, English strings in the Arabic build (including the 404), emoji flags as the only flag rendering.
- Anything that lets the string "Israel", «إسرائيل», `IL` or `ISR` appear in a page, path, sitemap or alt text (the absence test must scan `site/_out`).

*Source: request; Handoff sections 3.1, 6.1, 12, 14; skill universal rules and websites reference.*

**16. Binding constraints.**

| Constraint | Value | Source |
| --- | --- | --- |
| Delivery | Static export only, built in GitHub Actions, served under `/worldref/` on GitHub Pages; no server, no secrets | request; `pages.yml` |
| Stack | **Ruled (entry 5):** Next.js 16.x patched (at least 16.4.1) with Tailwind, `output: "export"`, `basePath: "/worldref"`, `trailingSlash: true`, `images.unoptimized: true`, as a standalone package in `site/` that the root `package.json` does not list (no workspaces entry, so `npm i github:arj-89/worldref` installs nothing extra); `site/build.mjs` runs the export then copies the API, schemas, flags and text files over it at their current paths; `loading.tsx` and `error.tsx` per route folder; country pages through `generateStaticParams`. The hand-template alternative is rejected: it would sit outside the lint pack and the skill's route rules. | approver ruled; skill websites reference section 1; Handoff 3.2, 14 |
| Routes | `/ar/` and `/en/` split with the language switch linking to the same path in the other language; `hreflang` pairs on every page; canonical URLs; `sitemap.xml`; Open Graph 1200 × 630; `robots.txt` allowing AI crawlers | request; Handoff section 9 |
| Root `/` | **Ruled (entry 6, assumed):** a small indexable page in both languages (one sentence each, two language links, `lang` and `dir` per block), `hreflang` ar, en and `x-default` to root, canonical to itself. A script forwards with `location.replace` to `/ar/` when the first entry of `navigator.languages` starts with `ar`, else `/en/`, or to the language the visitor last chose with the switch (local storage, no cookie). Both links stay visible without JavaScript. Replaces today's refresh to GitHub. | approver ruled (assumed; no owner record on root); Handoff 9; `site/build.mjs` |
| Country URL | **Ruled (entry 7):** `/{lang}/countries/{iso2}/` with lowercase iso2 like the API. Not `/{lang}/{iso2}/` (two-letter codes collide with page slugs: `ai` is Anguilla and an agents page is planned) and not a name slug (names can change with a CLDR refresh; codes do not, and AXO promises stable URLs). The title, `h1` and `Country` JSON-LD carry the name. | approver ruled; Handoff 9 (AXO), 6.1 |
| Structured data | `Dataset` on the home page, `Country` on each country page, `FAQPage` on the FAQ; `CITATION.cff` linked | Handoff section 9 |
| Languages | Arabic and English written natively, neither a translation of the other; Western numerals; Arabic punctuation; mixed-direction runs isolated | request; skill copy reference |
| Themes | System, Light, Dark; System default; both designed together; one theme per page, no inverted sections | request; skill |
| Dates on the site | **Ruled (entry 8):** show versions, not dates, wherever a version exists (`data/meta.json`). Any rendered date (release date, "verified on") is Gregorian plus Hijri Umm al-Qura with Western numerals, in both languages, through one site-local formatter (`islamic-umalqura`, `numberingSystem: "latn"`) allowlisted in `design-lint.json`; no Bixet-named package may enter this public repo and no kit exists. Strings from `sources.json` and `meta.json` ("snapshot", "verified 2026-11-01") are data, shown verbatim. `meta.json.generated` is "-" and is not shown until the generator fills it (Noticed). Hijri on English pages is assumed; the rule does not distinguish languages. | approver ruled; owner hard rule 2 addendum (D-55); skill copy reference section 4; Handoff 14 |
| Performance | The search demo loads `api/v1/index.json` (24 KB) and fetches one country on demand; the builder fetches only the chosen module files (each under 125 KB; subdivisions 500 KB) and shows the size before download; fonts self-hosted with `font-display: swap`; no external requests on any page | approver assumed; file sizes measured |
| Accessibility and SEO gate | Handoff gate 7: passes accessibility and SEO checks in Arabic and English at phone width; plus the skill floor (AA contrast measured, 44 px targets, focus ring, Escape closes overlays, Reduce Motion) | Handoff section 12; skill |
| Publicity gate | Handoff gate 8: no project names, scanned from outside the repo before publishing | Handoff section 12 |
| Launch date | None set. The site ships when Stop 2 passes. Until then Pages keeps serving the API and the root redirect. | Handoff build log |
| Imagery | Magnific generates the style image, the Open Graph card and any signature visual at K5 from the locked style image; the home hero visual is the live search demo itself (a working control, never a fake preview). Arabic text is never generated inside an image. | skill assets reference; owner's standing rule on Magnific |
| Cost | None expected: GitHub Pages and Actions on a public repo are free; Magnific credit is unlimited. Any paid step is a hard stop. | skill hard stops |

---

## Proposed information architecture (for K3, not yet approved)

| Route (per language) | Job | Flow |
| --- | --- | --- |
| `/{lang}/` | One sentence, live search, the numbers, the three ways in (install, build a file, one country by URL), the policy in one line, FAQ, footer | 1 |
| `/{lang}/install/` | 11 stacks, one copyable line each, then "use only what you need" | 2 |
| `/{lang}/build/` | The custom-file builder | 3 |
| `/{lang}/countries/` | All 242, grouped, searchable with the same demo control, pinned user region first | 4 (index) |
| `/{lang}/countries/{iso2}/` | One country, every module, sources, phone field, subdivisions, JSON link, `Country` JSON-LD | 4 |
| `/{lang}/agents/` | llms.txt, llms-full.txt, OpenAPI, schemas, MCP command, AGENTS.md, the rules for answering from the data | 1 (secondary exit) |
| `/{lang}/404` | Designed, in that language, with the search control | all |

---

## Recorded answers

| # | Answer | Source |
| --- | --- | --- |
| 1 | Free public bilingual country reference dataset plus code and MCP; the site helps developers (ar, en, both) and AI agents find, understand, try, install | request; Handoff 1, 9 |
| 2 | Website only; static export on GitHub Pages under `/worldref/`; existing API and text file paths untouched | request; `site/build.mjs` |
| 3 | No accounts, no analytics, no cookies; language and theme segmented switches and a footer on every page | request; skill defaults; "no analytics" approver assumed |
| 4 | Only permissive-licence Arabic plus English plus nationality plus phone rules; native Arabic search; 3 builds, 9 modules; sourced, null never guessed; policy plain; installs without accounts | Handoff 1, 2, 3.1, 7, 8 |
| 5 | exact, calm, native in both languages, fast, trustworthy | approver ruled, 02/11/2026, entry 3 (assumed) |
| 6 | Simple and clear modern Saudi professional Arabic, as in `README.ar.md`; identifiers isolated | prior record |
| 7 | Plain developer documentation English, as in `README.md` | prior record |
| 8 | No identity exists; K4 proposes; no studio brand; flags from `flags/*.svg` | request; skill |
| 9 | Type: OFL, Arabic-capable family from the Google Fonts pool, self-hosted `.woff2`, default IBM Plex Sans Arabic unless a K4 direction proposes another pool pairing; must render U+20C1 or declare a fallback; Thmanyah out of this public repo (jsDelivr would serve it); no Actions secret; per-project exception in `DESIGN.md` | approver ruled, 02/11/2026, entry 1 (owner can overturn) |
| 9b | Icons: Font Awesome Free, classic solid, bundled (free npm packages or inline SVG subset), `fa-brands` for GitHub, attribution in the footer; no hosted kit, no token | approver ruled, 02/11/2026, entry 2 |
| 10 | No references sent; designer shortlists at K2 from the pool above (blocked sites removed); approver picked 7 of 9 with three direction seeds (Astro Arabic docs, Apple Arabic specs, Lucide) | request; skill K2; approver ruled, 02/11/2026, entry 11 |
| 11 | Blocked: studio and other-project UIs, competitor sites as look references, maps and border imagery, generic template tells | approver ruled, 02/11/2026, entry 9; Handoff 3.1, 6.2, 14 (maps clause assumed) |
| 12 | Designer shortlist | request; skill |
| 13 | Delegated; hard stops to the owner | request; `DESIGN.md` |
| 14 | Flows: 1 onboarding (home), 2 install per platform, 3 custom-file builder, 4 country page; budgets as tabled; the 404 is one page for both languages (GitHub Pages serves a single `404.html`) | approver ruled, 02/11/2026, entry 4; Handoff build log, 7, 8, 9; budgets assumed |
| 15 | Untouched: data, paths, README wording, helpers, root package. Wrong: brand, maps, marketing, server, Eastern digits, em dashes, any Israel string | request; Handoff 3.1, 6.1, 12, 14 |
| 16 | Static export, `/ar/` and `/en/`, hreflang, sitemap, JSON-LD, both themes, no external requests, gates 7 and 8, no launch date. Ruled sub-items: stack Next.js export in `site/` (entry 5); root is a bilingual indexable page with a language forward (entry 6, assumed); country URL `/{lang}/countries/{iso2}/` (entry 7); versions over dates, Gregorian plus Hijri via a local allowlisted formatter (entry 8) | request; Handoff 9, 12; skill; approver ruled 02/11/2026 |

## OPEN items, ruled (approver, 02/11/2026, model Fable 5.1)

| # | Item | Ruling | Entry | Status |
| --- | --- | --- | --- | --- |
| O1 | Type: Thmanyah in a public repo | Proposal stands: OFL, Arabic-capable family from the Google Fonts pool, self-hosted `.woff2`, default IBM Plex Sans Arabic unless a K4 direction proposes another pool pairing; must render U+20C1 or declare a fallback. Thmanyah out of this repo: the global embed rule does not cover committing files to a public repo, which jsDelivr serves as a public font endpoint. The secret path is dropped by the zero-manual rule, so no hard stop was reached | 1 | ruled; owner can overturn |
| O2 | Icons | Font Awesome Free, classic solid, bundled (free npm packages or inline SVG subset), `fa-brands` for GitHub, attribution in the footer; no hosted kit, no token | 2 | ruled |
| O3 | Feel words | exact, calm, native in both languages, fast, trustworthy | 3 | ruled (assumed) |
| O4 | Core flows and budgets | The 4 flows in item 14 as tabled; the 404 is one page for both languages | 4 | ruled (budgets assumed) |
| O5 | Stack | Next.js 16.x patched static export in `site/` as a standalone package outside the root `package.json`, `basePath` `/worldref`, `trailingSlash`, merged by `site/build.mjs` | 5 | ruled |
| O6 | Root `/` behaviour | Bilingual indexable page with a `navigator.languages` forward (stored switch choice first), both links without JavaScript, `x-default` to root | 6 | ruled (assumed) |
| O7 | Country URL | `/{lang}/countries/{iso2}/`, lowercase | 7 | ruled |
| O8 | Dates on the site | Versions over dates; any date Gregorian plus Hijri with Western numerals in both languages via one site-local allowlisted formatter; data strings verbatim | 8 | ruled (Hijri on English pages assumed) |
| O9 | Blocked references list | As in item 11 | 9 | ruled (maps clause assumed) |

Nothing is paused. The owner reads these at the kickoff summary and may overturn any entry; an overturned entry stays in `DELEGATED-DECISIONS.md`, marked, and the owner's ruling is appended as a new entry.

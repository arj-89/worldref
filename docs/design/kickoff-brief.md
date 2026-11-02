# Kickoff brief (K1): worldref website

**Project:** worldref, the public bilingual country reference dataset. **Surface:** website only (static export to GitHub Pages at `https://arj-89.github.io/worldref`). **Approval mode:** Delegated (owner ruling, 01/11/2026). **Designer model:** Fable 5.1. **Date:** 01/11/2026.

One batched set, asked once. Every answer below is filled from the request, the Handoff spec (`worldref - Handoff.md` v2.2), the repo records, or the owner's standing rules, and marked with its source. Items marked **OPEN** carry a proposed answer for the approver to rule on; items marked **owner** are hard-stop class or override a skill default and need the owner.

No design work starts while an OPEN item is open.

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

**OPEN (approver may confirm).** Proposed: **exact, calm, native in both languages, fast, trustworthy.** A reference work, not a launch page. The numbers are real, the demo is real, and nothing on the page sells.

*Source: approver assumed, from Handoff section 1 ("built once, correct the first time"), section 14 (Arabic natively, no marketing padding) and the README tone.*

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

**OPEN (owner).** Thmanyah is the default, but two of the owner's own rules collide here: the skill's assets reference says font files are never committed to a public repo and never served from a shared host, and the Thmanyah licence record forbids any public endpoint. The site is built by GitHub Actions from this public repo, so the `.woff2` files would have to be committed (public) or fetched from the private `arj-89/thmanyah-fonts` during the build, which needs a personal access token stored as an Actions secret. Secrets are a hard stop, and the Handoff rules out manual steps for the owner.

Proposed answer: **an Arabic-capable pairing from the Google Fonts pool, self-hosted as `.woff2` under the OFL (public-repo safe, no external request, no secret).** Lead candidate: IBM Plex Sans Arabic for body and UI (Arabic and Latin in one family, 7 weights), with each K4 direction free to propose a different pool pairing for display. Thmanyah stays out of this repo.

*Source: `~/.claude/CLAUDE.md` (Thmanyah may be embedded, owner's responsibility) versus skill `references/assets.md` section 4 (never in a public repo) and the font kit licence record; request (public repo, static export). Needs the owner because it overrides a default and the alternative path is a hard stop.*

**9b. Icons.**

**OPEN (approver, with one owner-side alternative).** The skill's standard is Font Awesome Pro Plus through the hosted kit script for plain HTML or static sites. The hosted kit runs only on authorised domains, and `arj-89.github.io` is not one; adding it is a one-minute hand step by the owner in the Font Awesome dashboard, and the kit is an external script request on every page. Vendoring Pro icon data into a public repo is a licence problem (recorded in the base-resources notes).

Proposed answer: **Font Awesome Free, a self-hosted inline SVG subset (about 12 icons: search, copy, check, download, external link, language, sun, moon, display, warning, chevron, GitHub brand), classic solid as the one style pack, attribution in the footer licences line.** No external request, no owner action, public-repo safe. The alternative, if the owner prefers the Pro styles, is the hosted kit `f982182577` with `arj-89.github.io` added to its domain list.

*Source: skill `references/assets.md` section 1; archived base-resources notes (domain authorisation, vendoring rule); Handoff 3.2 (zero manual steps).*

---

## References

**10. Apps or sites admired, and why.**

None sent with the request. K2 therefore runs as a designer shortlist (6 to 10 candidates, one line each on what they teach), from developer data and docs sites with a live demo on the first screen, bilingual developer portals with real RTL, and dataset pages with strong fact tables. Candidate pool for K2 (to be verified live, not yet references): libphonenumber's demo, restcountries, flagcdn, the Unicode CLDR charts, Astro docs, Tailwind docs, Stripe docs, Moyasar docs (Arabic and English), Hudhud developer docs, MDN. The approver picks.

*Source: request (no references sent); skill K2 (nothing sent: search and shortlist).*

**11. Apps or sites to block as references, and why.**

Proposed blocked list, to be written into `DESIGN.md` at K5:

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

Delegated (owner ruling, 01/11/2026). Hard stops stay the owner's: money, making a repo public, deleting data, irreversible migrations, secrets. Item 9 above touches one (a secret) and is routed to the owner.

*Source: request; `DESIGN.md`; `DELEGATED-DECISIONS.md`.*

**14. The core flows for K3.**

Proposed (approver confirms). Four flows; flow 1 is mandatory. For a data and docs site, onboarding means a first-time visitor understanding what this is and reaching an install or a download within seconds.

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
| Stack | **OPEN (approver).** Proposed: Next.js (16.x patched) with Tailwind, `output: "export"`, `basePath: "/worldref"`, living in `site/` as its own workspace with its own `package.json`; `site/build.mjs` runs the export then copies the API, schemas, flags and text files over it as today. Alternative: extend `site/build.mjs` with hand templates (no framework). | skill websites reference section 1; Handoff 3.2 |
| Routes | `/ar/` and `/en/` split with the language switch linking to the same path in the other language; `hreflang` pairs on every page; canonical URLs; `sitemap.xml`; Open Graph 1200 × 630; `robots.txt` allowing AI crawlers | request; Handoff section 9 |
| Root `/` | **OPEN (approver).** Proposed: a tiny static page that picks `/ar/` when `navigator.languages` starts with `ar`, else `/en/`, with both links visible without JavaScript; `hreflang="x-default"` points to the root. Today the root redirects to the repo. | approver assumed; `site/build.mjs` |
| Country URL | **OPEN (approver).** Proposed: `/{lang}/countries/{iso2}/` with lowercase iso2 like the API. Not `/{lang}/{iso2}/`: two-letter country codes collide with short page slugs (AI is Anguilla, and an AI-agents page is planned). | approver assumed; Handoff 6.1 (stable URLs per country) |
| Structured data | `Dataset` on the home page, `Country` on each country page, `FAQPage` on the FAQ; `CITATION.cff` linked | Handoff section 9 |
| Languages | Arabic and English written natively, neither a translation of the other; Western numerals; Arabic punctuation; mixed-direction runs isolated | request; skill copy reference |
| Themes | System, Light, Dark; System default; both designed together; one theme per page, no inverted sections | request; skill |
| Dates on the site | **OPEN (approver).** Proposed: show source versions (`data/meta.json`) rather than dates wherever possible; any date shown (a release date) is Gregorian plus Hijri through the kit formatter. Note `meta.json.generated` is currently "-". | skill copy reference section 4 |
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
| 5 | exact, calm, native in both languages, fast, trustworthy | OPEN, approver assumed |
| 6 | Simple and clear modern Saudi professional Arabic, as in `README.ar.md`; identifiers isolated | prior record |
| 7 | Plain developer documentation English, as in `README.md` | prior record |
| 8 | No identity exists; K4 proposes; no studio brand; flags from `flags/*.svg` | request; skill |
| 9 | Type: OPEN (owner). Proposed: OFL pairing from the Google Fonts pool, self-hosted; Thmanyah kept out of the public repo | owner's rules in conflict; skill assets |
| 9b | Icons: OPEN (approver). Proposed: Font Awesome Free inline SVG subset, one pack, self-hosted; Pro hosted kit only if the owner adds the Pages domain | skill assets; base-resources notes |
| 10 | No references sent; designer shortlists at K2 from the pool above; approver picks | request; skill K2 |
| 11 | Blocked: studio and other-project UIs, competitor sites as look references, maps and border imagery, generic template tells | approver assumed; Handoff 3.1, 6.2, 14 |
| 12 | Designer shortlist | request; skill |
| 13 | Delegated; hard stops to the owner | request; `DESIGN.md` |
| 14 | Flows: 1 onboarding (home), 2 install per platform, 3 custom-file builder, 4 country page; budgets as tabled | request; Handoff 7, 8, 9; budgets approver assumed |
| 15 | Untouched: data, paths, README wording, helpers, root package. Wrong: brand, maps, marketing, server, Eastern digits, em dashes, any Israel string | request; Handoff 3.1, 6.1, 12, 14 |
| 16 | Static export, `/ar/` and `/en/`, hreflang, sitemap, JSON-LD, both themes, no external requests, gates 7 and 8, no launch date. OPEN sub-items: stack, root behaviour, country URL, dates | request; Handoff 9, 12; skill |

## OPEN items, in one list

| # | Item | Proposed answer | Who rules |
| --- | --- | --- | --- |
| O1 | Type: Thmanyah in a public repo | OFL pairing from the Google Fonts pool (lead: IBM Plex Sans Arabic), self-hosted `.woff2`; Thmanyah not in this repo; no Actions secret | **Owner** (overrides a default; the alternative is a secret, a hard stop) |
| O2 | Icons | Font Awesome Free inline SVG subset, classic solid, self-hosted, attributed in the footer | Approver (owner only if the Pro hosted kit is wanted, since that needs the Pages domain added by hand) |
| O3 | Feel words | exact, calm, native in both languages, fast, trustworthy | Approver |
| O4 | Core flows and budgets | The 4 flows in item 14 | Approver |
| O5 | Stack | Next.js static export in `site/` as its own workspace, `basePath` `/worldref`, merged by `site/build.mjs` | Approver |
| O6 | Root `/` behaviour | Language pick by `navigator.languages` with a no-JavaScript fallback showing both links; `x-default` to root | Approver |
| O7 | Country URL | `/{lang}/countries/{iso2}/` | Approver |
| O8 | Dates on the site | Versions instead of dates; any date Gregorian plus Hijri via the kit formatter | Approver |
| O9 | Blocked references list | As in item 11 | Approver |

Every answer the approver rules on is logged in `DELEGATED-DECISIONS.md` with its reason and source; O1 pauses and asks the owner once.

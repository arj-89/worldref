# References (K2): worldref website

**Picked by the approver** (02/11/2026, Delegated mode, model Opus 5.5 (claude-opus-5-5), `DELEGATED-DECISIONS.md` entry 11): 7 of 9.

| Reference | Role | K4 direction it seeds |
| --- | --- | --- |
| 1. Astro Docs in Arabic | Seed; flows 1, 2, shared chrome; Arabic RTL | **Direction A, "Docs shell":** header row (search, language, theme), side navigation, one 45rem reading column; the page reads as documentation and install is a section of it |
| 2. Apple Saudi Arabia, iPhone specs in Arabic | Seed; flow 4, countries index; Arabic RTL | **Direction B, "Fact sheet":** no cards; label column plus facts column, one hairline per section, footnote markers resolving to a sources list; the numbers from `meta.json` are the hero |
| 8. Lucide icons | Seed; flows 1, 3, countries index | **Direction C, "Instrument":** the live search is the first and largest element, results render under it, and one control strip (Arabic, English, both) changes every result at once; exact counts per group |
| 4. Hugging Face dataset page | Support; flows 3, 4 | none (counts and sizes beside each choice, live preview with an explicit end line, one-row facts strip) |
| 6. JSR package page | Support; flows 2, 4 | none (stack row above one command, install plus first use as one unit, provenance line) |
| 5. Stripe Docs, quickstart | Support; flow 2, agents page | none (one shape for every stack with a fallback ladder; a markdown twin per page) |
| 9. Tabby, Arabic home | Support; flow 1; Arabic RTL | none (IBM Plex Sans Arabic in production, one font variable per language, the imperative register) |

Not picked: **3. Can I Use** (the skill says outdated or poor apps are never references, and its own note calls the look dated; its search-first, answer-first and sources patterns are carried by Lucide, Apple's footnotes and JSR's provenance line) and **7. Tailwind CSS installation** (no structural seed; labelled code blocks come from Astro, the stack row from JSR). Both stay below as a record. Each "Take" and "Do not take" line below binds the direction it feeds.

**Status:** picked (entry 11). The picked references move into `DESIGN.md` under Reference notes at K5; the rest stay here as a record.
**Designer model:** Opus 5.5 (claude-opus-5-5), by the owner's ruling in `DELEGATED-DECISIONS.md` entry 10.
**Date:** 02/11/2026.

Flows: **1** onboarding (home and live search), **2** install per platform, **3** custom-file builder, **4** country page.

**How each one was verified.** The browser extension was not connected, so no page was opened in Chrome. Each site was fetched live on 02/11/2026: the served HTML for `lang`, `dir` and visible text, and the served stylesheets for real token values (font stacks, type scale, line heights, colours). Pages that render only in the browser could not be read this way and are marked where that matters. No screenshots were taken, so `docs/design/references/` stays empty.

**Excluded before shortlisting** (blocked list, entry 9): studio and sibling-project UIs; the competing packages' pages from Handoff section 2 (world-countries, countries-list, i18n-iso-countries, country-codes-list, the libphonenumber demo) and other country-data sites (restcountries, flagcdn) as look references; anything built around a map, globe or border imagery; generic developer-landing templates. Other candidates dropped after checking are listed at the end.

## Flow coverage

| Reference | Flow 1 | Flow 2 | Flow 3 | Flow 4 | Arabic / RTL |
| --- | --- | --- | --- | --- | --- |
| 1. Astro Docs in Arabic | yes | yes | | | native RTL docs chrome |
| 2. Apple Saudi Arabia, iPhone specs in Arabic | | | | yes | native RTL fact page |
| 3. Can I Use | yes | | | yes | |
| 4. Hugging Face dataset page | | | yes | yes | |
| 5. Stripe Docs, quickstart | | yes | | agents page | |
| 6. JSR package page | | yes | | yes | |
| 7. Tailwind CSS installation | | yes | | | |
| 8. Lucide icons | yes | | yes | index | |
| 9. Tabby, Arabic home | yes | | | | native RTL product site |

---

## 1. Astro Docs in Arabic (Starlight)

**URL:** https://docs.astro.build/ar/getting-started/
**Verified:** served `<html lang="ar" dir="rtl">`, Arabic UI labels («تخطَّ إلى المحتوى»، «البحث»، «اختر سمة»: «داكن»، «فاتح»، «تلقائي»), 14-language picker, tokens read from the served CSS.
**Flows:** 1 (home shell), 2 (install page shell), and the shared chrome on every page (header, switches, skip link, footer).

**Why it works**

- **Text:** an Arabic docs shell where Latin identifiers (`npm create astro@latest`, `Astro`) stay Latin inside Arabic sentences. The terminal block is labelled in Arabic («نافذة طرفيّة») with an Arabic comment line above the command.
- **Type:** body `1rem` at line height `1.75`; headings at `1.2`. Desktop h1 `2.625rem`, h2 `2.1875rem`, h3 `1.8125rem`: a body-to-h1 ratio of about 2.6 with small steps between headings. System font stack, so Arabic falls to the platform face.
- **Spacing:** content measure `45rem` (inside the 65 to 75 character rule), sidebar `18.75rem`, nav `4rem` desktop and `3.5rem` mobile. `scroll-padding-top` is computed from the nav height, so anchored headings never land under the bar (the "bars never hide content" rule, solved in CSS).
- **Colour:** one accent (`#3d50f5` light, `#3369ff` dark) with high and low variants. A 6-step grey ramp is mirrored per theme rather than inverted ad hoc. Dark background `#17181c`, not pure black.
- **Components:** skip link first; search, theme and language in one header row; the sidebar collapses behind «القائمة» on mobile.
- **RTL logic:** the CSS uses logical properties (`padding-inline`, `margin-inline-start`, `inset-inline`) and only 7 `[dir=rtl]` overrides, which is the same approach the skill's lint enforces.

**Take:** the RTL shell built on logical properties, the token structure (accent with high and low variants, mirrored grey ramp), the scroll padding tied to the nav height, the measure, and labelled code blocks in Arabic.
**Do not take:** the theme and language pickers are dropdown selects (the skill requires segmented switches); the Arabic translation is partial, so the sidebar mixes English labels («Installation»، «Routing») into Arabic, which is the exact failure worldref must avoid; sponsor logo grids and the course banner on the docs home.

## 2. Apple Saudi Arabia: iPhone technical specifications in Arabic

**URL:** https://www.apple.com/sa-ar/iphone-18-pro/specs/ (same pattern on https://www.apple.com/sa-ar/iphone-air/specs/)
**Verified:** served `<html lang="ar-SA" dir="rtl">`; Arabic font stack `"SF Pro AR", "SF Pro AR Text"` from the served CSS; fact text read from the page.
**Flows:** 4 (country page), and the countries index rows.

**Why it works**

- **Text:** a fact sheet in native Arabic with Western numerals throughout («71.9 مم»، «211 غم»، «2622 × 1206»). Units are Arabic words, Latin product tokens stay Latin, and right-to-left marks are placed around Latin runs (`256GB‏`) so they never flip. Each fact is a short noun phrase, not a sentence. Comparison rows say «كلا الموديلين» instead of repeating a value twice.
- **Type:** two weights only, a bold section label and regular facts. Display and text faces are separate cuts (`SF Pro AR Display` against `SF Pro AR Text`).
- **Spacing:** each section (السعة، الحجم والوزن، الشاشة) is a label in a narrow column with facts in a wide column, and a hairline only between sections, never under every row.
- **Colour:** near-monochrome; colour appears only in the product, not in the fact sheet.
- **Components:** numbered footnote markers on a fact (`1`, `2`, `3`) resolve to a footnote list at the end of the page. This is the pattern for "every column names its source".
- **Rhythm:** section label, facts, divider, repeated about 20 times, without one card.

**Take:** the label-column and facts-column grammar for the 9 modules; value then unit; RLM and `<bdi>` discipline around Latin and digits; footnote markers that point to a sources list; one divider per section; "applies to both" phrasing instead of repetition (useful for countries sharing a dial code or currency).
**Do not take:** the product photography and app-icon tiles; the marketing global nav and buy buttons; the SF Pro AR face (proprietary; worldref uses the OFL family from entry 1); the length (worldref's page should reach the phone field and the JSON link fast).

## 3. Can I Use

**URL:** https://caniuse.com/ and a fact page such as https://caniuse.com/css-has
**Verified:** served HTML (`lang="en-US" dir="ltr"`), home and fact-page text, and colour tokens from the served CSS. A news item dated March 2026 and usage data dated September 2026 confirm it is maintained.
**Flows:** 1 (search as the first control), 4 (one fact page per item, with sources).

**Why it works**

- **Text:** the home's job is one question: the search box sits right under the wordmark and is the first control. The fact page leads with the answer (status, global usage `95.91%` to two decimals, never rounded), then the detail.
- **Components:** each fact page ends with three blocks: Resources (links), and Sources naming each data source with its period ("Usage share: StatCounter GlobalStats, September 2026"). That is the same promise worldref makes per column.
- **Colour:** support states use colour plus a pattern (`--no-support-pattern`) so state is never shown by colour alone; a separate `--focus` token for both themes (`#0044ca` light, `#2a70fc` dark).
- **Rhythm:** every fact page has the same order: title, status line, one-line description, table, notes, resources, sources. A visitor learns it once and reads 500 pages.

**Take:** behaviour and structure only: search as the first control on the home, answer first, exact numbers, a fixed section order on all 242 country pages, and a Sources block that names source and version per fact.
**Do not take:** the look. The type (Open Sans, Verdana) and dense chrome are dated and fail the quality floor; the partner advert, the news banner and the "Did you know?" carousel on the home.

## 4. Hugging Face dataset page

**URL:** https://huggingface.co/datasets/openai/gsm8k
**Verified:** served page text: metadata tag row, tabs, dataset viewer controls, sidebar facts.
**Flows:** 3 (builder: choices with counts, size before download), 4 (dataset facts and preview).

**Why it works**

- **Text:** every choice shows its weight before it is picked: subset «main (8.79k rows)», split «train (7.47k rows)», and a «Total file size: 5.9 MB» line. The visitor knows what they will get before downloading.
- **Components:** a single row of metadata tags (format, languages, size, licence, libraries) replaces a feature list; the viewer has a subset selector, a split selector and a live table preview, so the data proves itself before any install. Libraries (Datasets, pandas, Polars) are named next to "Use this dataset". The snippets in that menu render only in the browser and were not read.
- **Spacing:** main column for the viewer and card, a narrow sidebar for counts and links; the preview ends with an explicit "End of preview" and a link, not a cut-off.

**Take:** counts and sizes beside each builder choice (build, module, subdivisions, format), a live preview of the first rows of the selected file before download, the explicit end-of-preview line, and a one-row facts strip (licence, format, languages, version) at the top of the home and the agents page.
**Do not take:** social and community chrome (likes, follow, discussions, leaderboard), sign-up prompts, abbreviated counts like «8.79k» (worldref shows exact numbers from `meta.json`), and the heavy tab bar.

## 5. Stripe Docs: quickstart

**URL:** https://docs.stripe.com/payments/quickstart
**Verified:** served HTML (navigation and title) and the markdown version Stripe returns to non-browser clients. The language and platform selector renders only in the browser and was not read.
**Flows:** 2 (install per platform), and the agents page.

**Why it works**

- **Text:** per language (Node, Ruby, Java, Python, PHP, Go, .NET) the install is one short sentence and one command, then a fallback ladder: the package manager line, then "download the project files", then the library source on GitHub. No stack gets a different shape.
- **Agents:** the same URL returns clean markdown to agents, opening with how to read the page in a terminal and a section written for agents. It is the clearest current example of a docs site serving people and agents from one source, which is worldref's `llms.txt`, `llms-full.txt` and `AGENTS.md` story.

**Take:** the identical shape for every stack (one sentence, one copyable line, the first call, then the fallback: download the file or the GitHub source); a markdown or plain-text twin for every page, linked from the agents page.
**Do not take:** "Create account", "Sign in" and "Ask AI" in the header; the two-pane step and code layout (too heavy for 11 one-line installs); the brand purple; the agent instructions themselves (product-specific).

## 6. JSR package page

**URL:** https://jsr.io/@std/path
**Verified:** served page text: header facts, "Add Package" block, tabs, provenance line.
**Flows:** 2 (install, then the first import), 4 (facts header and provenance).

**Why it works**

- **Text:** the header answers the questions before an install in one block: version with a «latest» tag, licence (MIT), source repository, supported runtimes. Directly under it: the add command, then the import line. Install and first use are never separated.
- **Components:** package managers (Deno, pnpm, Yarn, vlt, npm) as a row of choices above one command; a provenance line, "Built and signed on GitHub Actions", with a transparency-log link, which is trust shown as a fact and not as a claim.
- **Rhythm:** Overview, Docs, Files, Versions, Dependencies; the same order on every package.

**Take:** install line plus first-use line as one unit; the facts header (version, licence, source, runtimes); a provenance line for worldref's own build ("generated from CLDR 49 and libphonenumber v9.0.42 in GitHub Actions"), linking the workflow.
**Do not take:** the score percentage and weekly download counts (worldref has no analytics and no gamified scores); the dependents tab; the yellow brand.

## 7. Tailwind CSS: installation

**URL:** https://tailwindcss.com/docs/installation/using-vite
**Verified:** served page text: method list, steps, code-block labels.
**Flows:** 2.

**Why it works**

- **Text:** one method per page, picked from a short list (Vite, PostCSS, CLI, framework guides, CDN). Each step is a short heading, one sentence, one code block. A single "Are you stuck?" callout catches the reader who picked the wrong method and sends them to framework guides.
- **Components:** each code block is labelled by where it runs ("Terminal", `vite.config.ts`, "CSS", "HTML"), so the reader never wonders where to paste.

**Take:** the method picker as a short list of named stacks; code blocks labelled by where they run (Terminal, `pubspec.yaml`, `Package.swift`, `composer.json`); one "wrong stack?" escape line at the bottom of each stack.
**Do not take:** zero-padded step numbers (`01` to `06`), which read as the section-number tell; the version selector in the header; the word "seamless" in the copy (on the skill's banned list).

## 8. Lucide icons

**URL:** https://lucide.dev/icons/ and a detail page such as https://lucide.dev/icons/search
**Verified:** served page text: customizer controls, category list with counts, detail-page actions and metadata.
**Flows:** 1 (instant search over a known set), 3 (the builder pattern), and the countries index.

**Why it works**

- **Components:** a customizer (colour, stroke width «2px», size «24px») that changes every result on the page at once, so the effect of each choice is visible before copying. This is the builder loop: choose, see, take.
- **Text:** every category shows its exact count («Arrows 178», «Accessibility 34»); the detail page offers exactly two primary actions ("Copy SVG", "Copy JSX") and states its history as versions, «Created 0.0.0», «Last changed 0.507.0», not dates. That matches entry 8 (versions over dates).
- **Rhythm:** search, filter, grid, detail; the same loop for 1,600 items.

**Take:** the choose-see-take loop for the builder (each choice updates the preview and the size line immediately); exact counts on every group in the countries index (region with its count); two copy actions on the country page (JSON URL, JSON content); history shown as data versions.
**Do not take:** the 40-category sidebar (too much at once; worldref groups by region only), the merch and showcase links, and the icon-grid density.

## 9. Tabby: Arabic home

**URL:** https://tabby.ai/ar-SA
**Verified:** served `<html lang="ar" dir="rtl">`, Arabic page text, and the served CSS: the font variables switch to `--tui-font-family: "IBM Plex Sans Arabic"` and `--tui-font-family-heading: "IBM Plex Sans Arabic"` for Arabic (Inter and Radial for English). Body 16 px with line heights of 24 and 26 px (1.5 to 1.625).
**Flows:** 1 (Arabic hero, copy register, type in production).

Design reference only: no view on the product itself.

**Why it works**

- **Type:** the same family worldref's entry 1 names as its default, IBM Plex Sans Arabic, used for both headings and body in a large Saudi-market production site. It shows the face carrying a full page without a separate display font, and the swap is one variable per language.
- **Text:** native Saudi imperatives in short lines («أرسل»، «أنفق»، «حمّل التطبيق»); the hero is one headline, one sentence, one action, within the website craft rule of at most 4 text elements.

**Take:** proof of IBM Plex Sans Arabic at production weights and line heights; one font variable switched per language; the hero shape (headline, one sentence, one action); the imperative register, matching `README.ar.md`.
**Do not take:** the marketing tone and promotional density, rating badges, the repeated download action, and the fintech imagery. The Arabic percent order («%5») is a copy question for `references/copy.md`, not something to copy from here.

---

## Checked and dropped

| Candidate | Why dropped |
| --- | --- |
| restcountries, flagcdn, the libphonenumber demo | Blocked: competitor country-data sites and Handoff section 2 packages (content coverage only, never look) |
| Unicode CLDR charts | Data source, not a reference: the look is dated, which fails "outdated or poor apps are never references" |
| MDN Web Docs | No Arabic locale; its fact-page role is covered better by Can I Use (search first) and Apple's Arabic specs (RTL) |
| ar.react.dev | The Arabic home is still mostly English text under `lang="ar"`: the "English in an Arabic build" failure |
| Moyasar docs | English only; the Arabic link goes to the corporate site, not the docs |
| thmanyah.com | Served a bot challenge (HTTP 429); not bypassed, so not verified |
| design.dga.gov.sa | Renders only in the browser and serves `lang="en"`; its Arabic content could not be verified without the browser |
| shadcn/ui create | Renders only in the browser; the builder could not be read, so it is not offered as verified |
| Fontsource | The served font and download pages no longer show the per-subset builder or install commands; not verifiable without the browser |
| Hudhud developer docs | Not checked in this run |

# Review: worldref website 1.2.0 (time-zone offsets, subdivision types)

**Reviewer:** design-reviewer, Opus 5.5 (claude-opus-5-5), fresh context, from the evidence only.
**Date:** 10/11/2026
**Scope:** trivial additive change (Stop 1 skipped). Owner ruling `DELEGATED-DECISIONS.md` entry 25 applies: one review pass, real defects only.
**Board:** none for 1.2.0. Evidence was the local build at `http://127.0.0.1:8765` (root = `site/_out/`), the built HTML in `site/_out/{ar,en}/countries/{sa,us,ma,gb,ie,cu}/index.html`, `site/assets/site.css`, `site/build.mjs` and `docs/design/flows/country/WORDING.md`.
**Method:** viewed in the browser, then read the evidence files directly. The browser pages loaded **without any stylesheet**: every page links `/worldref/assets/site.css`, and the server serves `site/_out/` at the root, so `/worldref/...` returns 404 (the theme script fails the same way). No styled cell at 390 or 1280, light or dark, could be seen. Layout, wrapping, overflow and contrast below are worked out from the built markup, the CSS cascade and the token values, and each row says so.
**Result:** FAIL (5 checks: 1, 4, 7, 10, 14)

## Contrast, measured from the tokens

| Pair | Light | Dark | Floor |
| --- | --- | --- | --- |
| Hint (`--muted`, 15 px) on `--bg` | 5.69:1 | 7.58:1 | 4.5 |
| Subdivision meta (`--muted`, 15 px) on `--bg` | 5.69:1 | 7.58:1 | 4.5 |

## Checks

| # | Check | PASS/FAIL | Evidence |
| --- | --- | --- | --- |
| 1 | Matches the approved flow | FAIL | (a) `/en/countries/ie/` and `/ar/countries/ie/` show `Europe/Dublin UTC+01:00 (daylight saving UTC+00:00)` and «(التوقيت الصيفي UTC+00:00)». UTC+00:00 is Ireland's winter time. The data is right (README: Irish law defines winter as the shift), but the label says summer or daylight saving, so the page states something false. (b) WORDING `country.v.tz-note` says "under the time zones row". The build puts it inline as `<span class="hint">` straight after the last zone, with no separator (`/en/countries/sa/`: `Asia/Riyadh UTC+03:00 For reference only…`; `/en/countries/us/`: after `Pacific/Honolulu UTC-10:00`). |
| 2 | One job, one primary action | PASS | No new actions. The change adds values only. |
| 3 | All states | PASS | Zones with no switch show the standard offset only (`Asia/Riyadh`, `America/Phoenix`). A null `type_*` shows the code alone (`GB-NNH`, `GB-WNH`). With no zones, the row falls back to `country.null`. |
| 4 | Density | FAIL | (a) `/en/countries/us/` and `/ar/countries/us/`: 29 zones, each "zone, offset, (daylight saving offset)", run on as one comma-joined paragraph of about 1,700 characters. Pairs break across lines, so a zone and its offset end up on different lines, and finding one zone means reading the paragraph. Each entry fits on one line at 1280. (b) Subdivision rows: `<li>` holds `span.name` and `span.meta` as direct children. `.rows li > span {display:flex; min-block-size:44px}` makes the name a block-level flex box. `.rows .meta {display:inline-flex}` wins on specificity, so the meta drops to its own line under the name, and `margin-inline-start:auto` has no effect on an inline box. Result: two lines per row on every page and at every width, never the "right-hand meta", even at 1280 where name, type and code fit on one line. (c) `/ar/countries/sa/`: 12 of 13 rows repeat the name's head word, «منطقة الرياض» then «منطقة SA-01», and «المنطقة الشرقية» then «منطقة». `/ar/countries/ma/`: 62 «إقليم …» rows and 4 «عمالة …» rows do the same. |
| 5 | Native first | PASS | Plain `dd` text and list rows. No custom control. |
| 6 | Motion | PASS | No new interaction. |
| 7 | Both languages native, RTL | FAIL | (a) English types show lowercase as standalone values: "state US-CA", "council area GB-ABD", "unitary authority GB-BAS". On the same page, "Kind" values and the header use sentence case ("Country"). On `/en/countries/gb/`, 32 rows show "london borough", a proper noun in lowercase. (b) The Arabic hint «للمرجع فقط، فالفرق يتغير: احسبه بأدوات المنصة.» drops "time zone" and "your". «الفرق» alone is vague, and «أدوات المنصة» reads as this site's tools, not the reader's platform. |
| 8 | Themes | PASS | No new colour. The hint and meta use `--muted`, which is defined for light, dark and system (`site.css` lines 10, 17, 19). Judged from tokens, not seen styled (see Method). |
| 9 | Accessibility floor | PASS | Contrast as measured above. No new targets. The offsets are text inside the `dd`, so a screen reader reads them with the zone. |
| 10 | Copy rules | FAIL | `/en/countries/*`: "For reference only, offsets change: compute them…" joins a fragment and a clause with a comma, so it can read as "offsets change for reference only". |
| 11 | Icons | PASS | None added. |
| 12 | Imagery | PASS | Out of scope (entry 25). |
| 13 | Tokens only | PASS | No CSS added. Existing `.hint` and `.rows .meta` reused. |
| 14 | Feels like the product | FAIL | "Calm" and "exact" are missed on the US time-zones row (wall of text, pairs split) and on the Ireland row (wrong season label). Causes are 1a, 4a and 4b. |
| 15 | Bars never hide content | PASS | Unchanged. `.site-footer` keeps its 76 px end padding under the to-top pill. |
| 16 | One scroll axis | PASS | `body {overflow-wrap:anywhere}` covers the `code` and `bdi` runs. The longest zone (`America/North_Dakota/New_Salem`, about 252 px in 14 px mono) fits the 346 px column at 390. No horizontal overflow from the cascade. Not seen styled. |
| 17 | No clipped icons | PASS | None involved. |
| 18 | Mixed-direction lines | PASS | Arabic pages: each zone is `<code dir="ltr">` (isolated) and each offset `<bdi dir="ltr">`. Items join with «، ». The DST parenthesis holds Arabic, so its brackets resolve RTL and mirror correctly: «(التوقيت الصيفي UTC-04:00)،». In the subdivision meta, the type comes first at the right and the isolated code follows («منطقة SA-01»). |
| 19 | Dates, spacing | PASS | No dates added. Spacing tokens unchanged. |
| 20 | Footer | PASS | Unchanged. |

## Mechanical gate

| Item | Result |
| --- | --- |
| Lint pack green | Not on the board (descoped under entry 25, as in `website.md`). |
| Screenshot matrix | FAIL: no 1.2.0 board. The served pages load no CSS (`/worldref/assets/site.css` returns 404), so no styled cell was viewable. Serve `site/_out/` under `/worldref/` (for example a `worldref` symlink to `_out` in a parent folder that is served) before the next pass. |
| Recordings | Not needed: no interaction added. |

## Notes to the builder

1. **Check 1, `/en/countries/ie/` and `/ar/countries/ie/`:** where `z.dst` is lower than `z.standard`, render a new key `country.v.tz-winter` instead of `country.v.tz-dst`. Add it to `docs/design/flows/country/WORDING.md`: Arabic «(التوقيت الشتوي {o})», English "(winter time {o})", note "after the standard offset where the law defines winter as the shift (Ireland)". Compare the offsets as signed minutes. Leave the data unchanged.
2. **Checks 1 and 4, every country page, time zones row:** render the note as its own line under the zones: `<span class="hint tz-note">` with `.tz-note { display: block; margin-block-start: 4px; }`.
3. **Check 4, `/en/countries/us/` and `/ar/countries/us/` (any multi-zone page):** render each zone as its own line, `<span class="tz">{zone} {offset}{ dst}</span>` with `.tz { display: block; }`. Drop the `sep(lang)` join, because the lines separate the items.
4. **Check 4, every subdivisions list:** wrap each row's two spans in one span, so the existing `.rows li > span` rule makes the row the flex line and `.meta` pushes to the end: `<li><span><span class="name">…</span><span class="meta">…</span></span></li>`.
5. **Check 4, `/ar/countries/sa/` and `/ar/countries/ma/` (all languages, same rule):** omit the type span when the displayed name already starts with the type word, or with «ال» plus the type word (Arabic), or case-insensitively with the type (English). Keep the code.
6. **Check 7, `/en/countries/*` subdivisions:** in `scripts/build.mjs` line 361, emit `type_en: en?.replace(/^london /, "London ")`. The Arabic lookup keeps using the lowercase `en`. In `site/build.mjs`, show `type_en` with its first letter uppercased ("State", "Council area", "London borough").
7. **Check 7, Arabic `country.v.tz-note`:** «للمرجع فقط، ففرق التوقيت يتغيّر: احسبه بأدوات المناطق الزمنية في منصتك.»
8. **Check 10, English `country.v.tz-note`:** "For reference only: offsets change, so compute them with your platform's time-zone support."

## Outside this change (not counted)

- `/en/countries/gb/`: `GB-PTE` reads "Peter". That comes from CLDR upstream (`cldr-subdivisions-en.xml`: `gbpte` = "Peter"), so it needs an `E.SUBDIVISION_NAME` fix to "Peterborough".
- `/en/countries/gb/`: `GB-NNH` and `GB-WNH` have no type (both are unitary authorities since 2021).
- Arabic UK glossary terms «منطقة مجلس» (council area) and «منطقة رئيسية» (principal area) read as word-for-word renderings. Not confirmed against an Arabic reference, so not failed here.
- WORDING `country.subs.more` (over 20 rows) is not built: `/en/countries/gb/` lists all 221 rows.

## Pass 2

**Reviewer:** Opus 5.5 (claude-opus-5-5). **Date:** 10/11/2026.
**Method:** viewed in the browser at `http://127.0.0.1:8765/worldref/`, styled (CSS and scripts load). 1280 px, light and dark (theme button cycled to Dark), Arabic and English: `ar/countries/sa`, `ar/countries/us`, `ar/countries/ma`, `en/countries/us`, `en/countries/gb`, `en/countries/ie`. The built HTML was also read for `ar/ie`, `ar/cu`, `en/cu` and `ar/gb`. **390 px was not viewable:** the browser window does not narrow below desktop width (the resize call reports success, but the viewport stays 1288 px), and there are no 1.2.0 captures on the board. The 390 behaviour below comes from the shipped CSS (`.tz, .tz-note {display:block}`, `.rows li > span` flex-wrap, `body {overflow-wrap:anywhere}`).

**Result: FAIL (1 check: 7).** Every prescription from pass 1 is applied and verified.

| # | Pass 1 item | Pass 2 | Evidence |
| --- | --- | --- | --- |
| 1a | Ireland season label | PASS | `en/ie` 1280 light: `Europe/Dublin UTC+01:00 (winter time UTC+00:00)`. `ar/ie` HTML: «(التوقيت الشتوي UTC+00:00)». `cu` still reads "daylight saving" / «التوقيت الصيفي». |
| 1b, 4 | Note under the row | PASS | `en/us` 1280 light and `ar/us` 1280 dark: the note sits on its own line under `Pacific/Honolulu UTC-10:00`, 4 px below, muted. |
| 4a | One zone per line | PASS | `en/us` light and `ar/us` dark: 29 lines, each zone with its offset on one line at 1280. In RTL the zone sits at the right, then the offset, then «(التوقيت الصيفي …)». At 390 an entry may wrap inside its own block, and each block still starts with the mono zone name. |
| 4b | Meta on the row | PASS | `en/gb` 1280 light: name at the start, "Council area GB-ABD" at the end of the same line. `ar/ma` 1280 dark: «جهة MA-01» at the left end of the row. |
| 4c | Type repeating the name | PASS | `ar/sa`: codes only (all 13 names already carry «منطقة»). `ar/ma`: «جهة» shown for the regions, «عمالة» for `MA-AGD` «أكادير», omitted for «إقليم …» rows. |
| 7a | English type case | PASS | `en/gb`: "District", "Council area", "Unitary authority", "London borough", "Borough". |
| 7b | Arabic note | PASS | `ar/sa` 1280: «للمرجع فقط، ففرق التوقيت يتغيّر: احسبه بأدوات المناطق الزمنية في منصتك.» |
| 10 | English note | PASS | `en/us` 1280: "For reference only: offsets change, so compute them with your platform's time-zone support." |
| 14 | Feel | PASS | Its causes (1a, 4a, 4b) are fixed. The US row now reads calm and exact. |
| 8, 9, 16, 18 | Re-seen styled | PASS | Dark theme on `ar/us` and `ar/ma`: hint and meta legible in `--muted` (7.58:1). No horizontal scroll at 1280. Mixed-direction runs render in the order described in pass 1. |

### New FAIL in pass 2

| # | Check | Page and cell | What is wrong |
| --- | --- | --- | --- |
| 7 | Both languages native | `ar/countries/sa` 1280 light, section «قرارات تحريرية في هذا الصف»; also `ar/ma`, `ar/gb` and 31 other Arabic country pages | The editorial decisions added with the subdivision types and names in 1.2.0 have no Arabic reason. The Arabic page shows `subdivisions.type: المصادر` (a bare link) where the English page gives the reason ("Saudi Arabia's 13 regions (Law of Regions, نظام المناطق)"). There are about 85 such rows on 34 Arabic pages, for example `subdivisions.type_ar` (ma, dz, tn, ly, ir…), `subdivisions.type (GB-…)` and `subdivisions.name (MA-01…MA-12)`. Also on `ar/ma`: `geo.timezones`; on `ar/ph`: `address.region_label`. WORDING (section "Editorial decision reasons") requires one `ovr.*` key per override and a build that fails without it. |

**Fix (check 7):**
- Add one `ovr.{iso2}.{field}` row to `docs/design/flows/country/WORDING.md` for every override that falls back to the link. Write each Arabic reason natively, and copy each English cell verbatim from the `why` in `data/sources.json`.
- Restore the build check: `site/build.mjs` must fail when an override has no `ovr.*` key, instead of rendering the `المصادر` link.
- To list the affected rows, grep `site/_out/ar/countries` for `</code>: <a href="https://github.com/arj-89/worldref/blob/main/data/sources.json">المصادر</a>`.

### Outside this change (not counted)

- `ar/countries/sa` and `ar/countries/ma` at 1280: the label column heading «التقسيمات الإدارية (13)» wraps, leaving «(13)» alone on the second line. This predates 1.2.0. To fix it, keep the count with the last word: «التقسيمات الإدارية&nbsp;({n})».
- `ar/countries/gb`: `GB-NNH` and `GB-WNH` show English names («North Northamptonshire») on the Arabic page, because there is no Arabic name in the data.
- `site/build.mjs` `subType` matches a prefix without a word boundary (`name.startsWith(type)`). It is harmless on the pages checked. A name that merely begins with the type's letters would lose its type.

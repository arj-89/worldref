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

## Pass 3

**Reviewer:** Opus 5.5 (claude-opus-5-5). **Date:** 10/11/2026.
**Method:** viewed in the browser at `http://127.0.0.1:8765/worldref/`, 1280 px, dark theme (`ar/countries/ma#overrides`, `ar/countries/sa#subdivisions`). The built HTML of the decisions section was read for `ar/sa`, `ar/ma`, `ar/gb`, `ar/ph`, plus `ar/ly`, `ar/cn` and `ar/iq` (my picks). 390 px is still not viewable in this browser (see pass 2).

**Result: FAIL (2 checks: 4, 10).** Check 7 now passes. The two FAILs are in the same decisions section. I should have caught them in pass 2, because both were already visible in the English section then. They are not regressions from this fix.

| # | Item | Pass 3 | Evidence |
| --- | --- | --- | --- |
| 7 | Arabic reasons for the 1.2.0 decisions | PASS | Grep of `site/_out/ar/countries` for the bare «المصادر» link: 0 files. `ar/sa`: «مناطق السعودية الثلاث عشرة (نظام المناطق)». `ar/ly`: «شعبيات ليبيا الاثنتان والعشرون…». `ar/ma`: «جهات المغرب الاثنتا عشرة منذ 2015 (المرسوم 2.15.40)…». `ar/cn`, `ar/iq`, `ar/ph` and `ar/gb` are complete. The number agreement is correct throughout (ثلاث عشرة، الاثنتان والعشرون، الاثنتا عشرة، الستة عشر، الإحدى عشرة). |
| 18 | Mixed direction in the reasons | PASS | `ar/ma` dark: `subdivisions.name (MA-01)` stays one LTR code run. «(المرسوم 2.15.40)» keeps its digit order. Each «وفق ISO 3166-2:GB» ends its line intact. |
| Side notes | Heading, `subType` | PASS | `ar/sa` 1280: the heading wraps as «التقسيمات / الإدارية (13)» (U+00A0 before the count), so no lone «(13)». `subType` still omits on `ar/sa` (codes only) and on `ar/ma` «إقليم …» rows. «جهة» is still shown, and «Province», «Prefecture», «London borough» and «State» are unchanged. |
| 4 | Density | FAIL | `ar/countries/ma#overrides` 1280 dark (same on `en/ma`): 12 consecutive items `subdivisions.name (MA-01)` … `(MA-12)` repeat one identical two-line reason, 24 lines of the same sentence. `ar/gb` and `en/gb`: 11 items `subdivisions.type (GB-ABC … GB-NMD)` repeat «إحدى المناطق الإحدى عشرة في أيرلندا الشمالية، وفق ISO 3166-2:GB». `ar/cn`: 4 items repeat «إحدى البلديات الأربع في الصين…», and 2 more repeat «منطقة إدارية خاصة…». |
| 10 | Copy rules | FAIL | (a) Within one list, the end punctuation differs. `ar/sa`: the new reason ends with no full stop, the old `name_ar` reason ends with «.». The same mix appears on `ar/ph` (three new without, `nationality_en` with). (b) `ar/gb`, `subdivisions.name (GB-PTE)`: the reason spells «بيتربره», while the same page's row name is «بيتربرة». |

### Notes to the builder (pass 3)

1. **Check 4, decisions section, all country pages, both languages:** in `site/build.mjs`, group overrides that share the same field stem (the text before ` (`) and an identical reason into one `<li>`, with the codes joined inside the code run. For example `<code dir="ltr">subdivisions.name (MA-01, MA-02, …, MA-12)</code>: {reason}`. Keep the codes in data order.
2. **Check 10a, all Arabic reasons:** end every Arabic reason with «.», matching the existing `ovr.*` Arabic cells. Apply it to the new `why_ar` values in `data/sources.json` (through `scripts/editorial.mjs`) and to the WORDING rows. Leave the English `why` as it is: it is verbatim data, consistently without a stop.
3. **Check 10b, `GB-PTE` reason:** «اسم بيتربرة بالإنجليزية مقطوع في CLDR.»

## Pass 4

**Reviewer:** Opus 5.5 (claude-opus-5-5). **Date:** 10/11/2026.
**Method:** viewed in the browser at `http://127.0.0.1:8765/worldref/`, 1280 px, dark theme: `ar/countries/gb#overrides`, `ar/countries/ma#overrides`. The built HTML of the decisions section was read for `ar/ma`, `en/ma`, `ar/gb`, `en/gb`, `ar/cn`, `en/cn`, `ar/sa`, `en/sa`, `ar/ph` and `en/ph`. 390 px is still not viewable in this browser (see pass 2).

**Result: PASS.** Checks 4 and 10 pass. No regression found.

| # | Item | Pass 4 | Evidence |
| --- | --- | --- | --- |
| 4 | Repeated reasons merged | PASS | `ar/ma` and `en/ma`: one item, `subdivisions.name (MA-01, MA-02, …, MA-12)`, with the reason once (was 12). `ar/gb` and `en/gb`: one item, `subdivisions.type (GB-ABC, GB-AND, …, GB-NMD)` (was 11). `ar/cn` and `en/cn`: two items, `(CN-HK, CN-MO)` and `(CN-BJ, CN-SH, CN-TJ, CN-CQ)` (was 6). Distinct reasons stay separate: `GB-LND`, `GB-CMA`, `GB-NNH` and `GB-WNH` each keep their own item. |
| 10a | Arabic full stops | PASS | Every Arabic reason on `ar/sa`, `ar/ma`, `ar/gb`, `ar/cn` and `ar/ph` ends with «.», so old and new match within each list. English `why` is unchanged and consistently without a stop. |
| 10b | `GB-PTE` spelling | PASS | `ar/gb`: «اسم بيتربرة بالإنجليزية مقطوع في CLDR.», matching the row name «بيتربرة». |
| 18 | Mixed direction after the changes | PASS | `ar/gb` dark: the merged code run wraps after a comma («…GB-FMO،» / «GB-LBC, … GB-NMD)») and stays one LTR isolate in order. The new full stop after a Latin run resolves to the RTL end of the sentence (the stop sits left of «ISO 3166-2:GB»). `ar/ma` dark: «(المرسوم 2.15.40)» keeps its digit order. |
| 7 | Arabic reasons still complete | PASS | The bare «المصادر» link is still absent. |

### Outside this change (not counted)

- `en/countries/cn`: the English `why` for `CN-HK` and `CN-MO` reads only "ISO 3166-2:CN", while the Arabic says what was decided («منطقة إدارية خاصة، وفق ISO 3166-2:CN.»). This is verbatim `sources.json` data. A fuller English `why` ("Special administrative region, ISO 3166-2:CN") would make the two languages carry the same information.

## Pass 5 (390 px)

**Reviewer:** Opus 5.5 (claude-opus-5-5). **Date:** 10/11/2026.
**Method:** viewed in the browser at `http://127.0.0.1:8765/m390.html`. The page holds six 390 px iframes, and each is its own viewport, so the site's media queries apply. I scrolled inside each frame, in dark and then in light: `ar/us` and `en/us` (time zones), `ar/sa` and `en/gb` (subdivisions), `ar/ma` (decisions), `en/ie` (Ireland). I switched the theme with the site's theme button. It is stored per origin, so it applies in every frame. Also confirmed: `en/cn` now reads "Special administrative region, ISO 3166-2:CN".

**Result: FAIL (2 checks: 4, 18).** Checks 15, 16 and 17 pass.

| # | Check | Pass 5 | Evidence at 390 |
| --- | --- | --- | --- |
| 4 | Density | FAIL | `ar/us` dark: each zone runs to two lines, and the break falls in a different place on each row. Some second lines hold only «(UTC-04:00» (the closing bracket shows on the left, as RTL should). Others split the term itself: «(التوقيت» at the end of line 1, «الصيفي UTC-04:00)» on line 2 (Indiana/Winamac, Marengo, Vevay, Knox, Los_Angeles, Metlakatla). `en/us`: New_York and Detroit leave "UTC-04:00)" alone on line 2, while the other rows carry "(daylight saving UTC-04:00)" whole. `en/ie`: "(winter time" / "UTC+00:00)". The list reads ragged, and the parenthetical's label and value are separated. |
| 18 | Mixed-direction lines | FAIL | `ar/us` dark: `America/Nome` and `America/Adak` break inside the offset, «UTC-» at the end of line 1 and «08:00)» / «09:00)» on line 2. `ar/ma#overrides` dark: the merged code run breaks inside codes, `MA-` / `03` and `MA-` / `08`. The colon after the run then lands beside the split code, so line 3 reads «:08, MA-09, MA-10, MA-11, MA-12)». The browser breaks after the hyphen before a digit, so codes and offsets need protecting. |
| 15 | Bars never hide content | PASS | The to-top pill floats over content mid-scroll and moves out of the way when you scroll. The section ends clear it (footer end padding), as in earlier passes. |
| 16 | One scroll axis | PASS | No horizontal scroll in any of the six frames, light or dark. The longest zone (`America/North_Dakota/New_Salem UTC-06:00`) fits one line. Long subdivision names wrap their meta to the end of the next line (`en/gb` "Bournemouth, Christchurch and Poole", then "Unitary authority GB-BCP"). |
| 17 | No clipped icons | PASS | The to-top chevrons and the theme button are whole in both languages and both themes. |

Also seen at 390 and fine: `ar/sa` heading «التقسيمات الإدارية (13)» on one line, codes only on the rows. `en/gb` rows show name, then type and code at the end. The `ar/ma` reasons and `en/ie` note are readable in light (`--muted`) and dark.

### Notes to the builder (pass 5)

1. **Check 18 and check 4, time zones row (`site/build.mjs`, `country.f.timezones`):** add `.nw { white-space: nowrap; }` to `site/assets/site.css`. Render each offset as `<bdi dir="ltr" class="nw">UTC-08:00</bdi>`. Wrap the whole parenthetical (`country.v.tz-dst` or `country.v.tz-winter` with its offset) in `<span class="nw">…</span>`. Each entry then breaks only between zone, offset and parenthetical. Line 2, where needed, is always the whole «(التوقيت الصيفي UTC-04:00)» / "(daylight saving UTC-04:00)" (about 190 px, which fits 346 px).
2. **Check 18, merged decision codes (`site/build.mjs`, decisions section):** inside the code run, wrap each code in `<span class="nw">MA-01</span>`. Keep the ", " separators outside the spans so lines break after commas only.

## Pass 6

**Reviewer:** Opus 5.5 (claude-opus-5-5). **Date:** 10/11/2026.
**Method:** viewed in the browser. At 390 px, `http://127.0.0.1:8765/m390.html` after the rebuild: I scrolled through the whole list in `ar/us` and `en/us`, and checked `en/ie` and `ar/ma#overrides`, in light and then dark (switched with the site's theme button). At 1280 px, a regression look at `en/ie` (light), `ar/us` (dark) and `ar/gb#overrides` (dark).

**Result: PASS.** Checks 4 and 18 pass at 390. No regression at 1280.

| # | Check | Pass 6 | Evidence |
| --- | --- | --- | --- |
| 4 | Density at 390 | PASS | `ar/us` and `en/us`, light and dark: every switching zone now breaks in the same place. Line 1 holds the zone and its offset (`America/New_York UTC-05:00`). Line 2 holds the whole bracket, «(التوقيت الصيفي UTC-04:00)» / "(daylight saving UTC-04:00)". There is no lone "UTC-04:00)", and «التوقيت الصيفي» is never split. Non-switching zones (`America/Phoenix`, `Pacific/Honolulu`) stay on one line. `en/ie`: `Europe/Dublin UTC+01:00`, then "(winter time UTC+00:00)" whole. |
| 18 | Mixed-direction lines at 390 | PASS | `ar/us`: `America/Nome` «UTC-09:00» and `America/Adak` «UTC-10:00» stay whole, with their brackets whole on line 2. `ar/ma#overrides`, light and dark: the merged run breaks only after commas, as `subdivisions.name (MA-01, MA-02,` / `MA-03, … MA-07,` / `MA-08, … MA-12)`. Every code is whole. The colon after the run sits on the RTL side of the run's last line, the same as on every other item in the list. |
| — | Regression at 1280 | PASS | `en/ie` light: one line, `Europe/Dublin UTC+01:00 (winter time UTC+00:00)`. `ar/us` dark: all 29 zones on one line each. `ar/gb#overrides` dark: same layout as pass 4. The merged NI run breaks after «GB-FMO,», and each reason ends with «.». |
| 15, 16, 17 | Unchanged at 390 | PASS | No horizontal scroll in any frame. The to-top pill still clears section ends. Icons are whole. |

**Final state of this review:** every FAIL from passes 1 to 5 is fixed and verified. The 390 px gap from pass 2 is closed by pass 5 and this pass. Lint output and recordings stay descoped (entry 25). The not-counted items in the "Outside this change" lists are unchanged unless a later pass says they were fixed.

## Kotlin on Maven Central (10/11/2026)

**Reviewer:** design-reviewer, Opus 5.5 (claude-opus-5-5), fresh context. **Scope:** narrow Stop 2 of a trivial copy and data change (Delegated mode, lean per `DELEGATED-DECISIONS.md` entry 25): the Kotlin/Android stack on the install page moves from JitPack (two blocks, "Step 1 of 2") to Maven Central (one block).
**Method:** viewed in the browser. At 1280 px: `http://127.0.0.1:8765/worldref/ar/install/#kotlin` and `/worldref/en/install/#kotlin`, dark and then light (switched with the header theme button), compared with the Swift, Python and Dart sections on the same page. At 390 px: `http://127.0.0.1:8765/m390.html` (`ar/install` and `en/install` frames, light), scrolled through Swift, Kotlin and Python. I clicked the Kotlin copy button on `ar` at 1280 dark. I grepped the built `site/_out` for JitPack and step labels, and checked the registry link's `href` and accessible name. Dark at 390 was not viewed separately. It uses the same tokens as dark at 1280.

**Result: FAIL (1 check: 18).**

| # | Item | PASS/FAIL | Evidence |
| --- | --- | --- | --- |
| 1 | The block and its line | PASS | `ar` and `en`, 1280 and 390: one block, labelled `build.gradle.kts`, containing `implementation("io.github.arj-89:worldref:1.2.0")`. The version matches the page's other stacks (Swift `from: "1.2.0"`). |
| 1 | No step label, no JitPack | PASS | `site/_out`, case-insensitive grep for `jitpack`, `class="step"`, `Step \d` and «الخطوة»: 0 matches. No step label appears on the Kotlin section in either language or at either width. |
| 7, 10 | Subtitle (`install.stack.kotlin.on`) | PASS | `en`: "from Maven Central". `ar`: «من Maven Central». Both match WORDING exactly, and they read as naturally as the other subtitles («عبر Composer» / "via Composer"). |
| — | One-pattern rule | PASS | The Kotlin section has the same shape as Swift (file-name label in mono, one code field, copy button, "first call" toggle, guide link) and puts the registry link first, as Python, Dart and PHP do. The spacing, button size and divider position match Python's at 1280 and 390. The copy label «انسخ الأمر» / "Copy command" is the same one Swift uses for `Package.swift`. |
| 5 | Copy button | PASS | `ar` 1280 dark: the click opens the "first call" block, as WORDING `install.first.show` specifies. `data-copy` holds the exact line (`site/build.mjs` `copyBtn(line, …)`). |
| 1 | Registry button | PASS | `href="https://central.sonatype.com/artifact/io.github.arj-89/worldref"`, `rel="external"`. Label: "The package on Maven Central" / «صفحة الحزمة على Maven Central». The accessible name includes "Maven Central". It sits before "Full guide on GitHub", as PyPI does. At 390 both links stack one per line in both languages, and neither is cut. |
| 18 | Mixed direction (Arabic, 1280) | PASS | The subtitle runs right to left: «من» at the right, then "Maven Central" as one Latin run. The button reads «صفحة الحزمة على» then "Maven Central", with the chevron at the left end, matching PyPI. The code field is `dir="ltr"` and left-aligned. The `build.gradle.kts` label is right-aligned over the field, like `Package.swift`. |
| 8 | Themes | PASS | 1280 light and dark, both languages: the label, code field, copy pill and links are as legible as the Python section next to them. No new colour. |
| 16 | One scroll axis at 390 | PASS | No horizontal scroll in either frame. The code field wraps inside its 346 px box. |
| 18 | Wrapping at 390 | FAIL | `ar/install` and `en/install` at 390, light: the line breaks inside the Maven group id, `implementation("io.github.arj-` / `89:worldref:1.2.0")`. The hyphen at the end of line 1 reads as a soft hyphen, and the coordinate a reader has to match is split in two. This is the break-after-hyphen-before-digit defect failed in pass 5 and fixed for offsets and codes in pass 6. |

### Notes to the builder (Kotlin on Maven Central)

1. **Check 18, `/ar/install/#kotlin` and `/en/install/#kotlin` at 390:** in `site/build.mjs` `install()`, change the code-field markup in the `blocks` template from `<code>${esc(line)}</code>` to `<code>${esc(line).replace(/arj-89/g, '<span class="nw">arj-89</span>').replace(/^implementation\(/, "implementation(<wbr>")}</code>`. `.nw` already exists (`site/assets/site.css` line 120). At 390 the block then reads `implementation(` / `"io.github.arj-89:worldref:1.2.0")`. That is 34 characters, about 285 px of mono text, in the 314 px text width of the field. The copied text does not change: `data-copy` keeps the raw line, and the span and `<wbr>` add no characters to a manual selection. The `arj-89` rule also reaches the Swift, PHP and Go lines (one pattern), so check those three at 390 after the rebuild.

### Outside this change (not counted)

- Swift (`/ar/install/#swift`, `/en/install/#swift`, 390) has had the same break since before this change: `"https://github.com/arj-` / `89/worldref.git", from: "1.2.0")`. The fix above covers it. Confirm it on the rebuild.
- The open "first call" toggle keeps the label «اعرض أول استدعاء» / "Show the first call", but WORDING defines `install.first.hide` («أخفِ أول استدعاء» / "Hide the first call"), and `site/` never uses that key. This affects every stack.
- WORDING `install.step` still says it is used "for a stack whose lines go to two destinations (PHP)". No stack now has two blocks, so `install.step` and `install.step.next` are unused. Update the note or retire the keys.

### Pass 2

**Reviewer:** Opus 5.5 (claude-opus-5-5). **Date:** 10/11/2026.
**Method:** viewed in the browser at `http://127.0.0.1:8765/m390.html` after the rebuild (`ar/install` and `en/install` frames, 390 px, light). I scrolled inside each frame through Swift, Kotlin, PHP, Go and "No install". I opened and closed the "first call" toggle on PHP in both frames, and clicked the Kotlin copy button in the `en` frame. I read the built `<code>` markup and the `data-copy` values in `site/_out/{ar,en}/install/index.html`.

**Result: FAIL (1 check: 18).** The Kotlin FAIL is fixed. My pass 1 prescription caused a regression on Swift. The `nw` span took away the hyphen break, and nothing replaced it.

| # | Item | Pass 2 | Evidence at 390 |
| --- | --- | --- | --- |
| 18 | Kotlin wrapping | PASS | `ar` and `en`: `implementation(` / `"io.github.arj-89:worldref:1.2.0")`. The coordinate is whole on line 2. |
| 18 | Swift wrapping | FAIL | `ar` and `en`: `.package(url:` / `"https://github.com/arj-89/worldref.g` / `it", from: "1.2.0")`. Line 2 does not fit the 314 px field (41 characters, about 343 px). With the hyphen protected, the line has no break opportunity left, so `overflow-wrap: anywhere` cuts the word `git`. This is worse than the old `arj-` / `89` break. |
| 18 | PHP, Go, "No install" | PASS | PHP: `composer require arj-89/worldref` on one line. Go: `go get` / `github.com/arj-89/worldref/go@v1.2.0`, a break at the space. "No install" (`en`): `https://arj-89.github.io/worldref/api` / `/v1/sa.json`, a break at a path separator. |
| 5 | Copy | PASS | `en` Kotlin click: the label changes to "Command copied" and the first call opens. `data-copy` holds the raw line for all six `arj-89` lines (Kotlin `implementation(&quot;io.github.arj-89:worldref:1.2.0&quot;)`, no `<wbr>`, no span). The span and `<wbr>` live only inside `<code>`, so a manual selection is unchanged too. |
| 7 | First-call toggle | PASS | PHP, both frames. Closed: "▶ Show the first call" / «اعرض أول استدعاء ◀». Open: "▼ Hide the first call" / «أخفِ أول استدعاء ▼». Closing it again restores "Show". The Kotlin toggle also reads "Hide the first call" after a copy opens it. |
| — | WORDING `install.step` | PASS | The coordinator reports that the note now says the key is unused. Not re-read here; this is outside the counted checks. |

### Notes to the builder (Kotlin pass 2)

1. **Check 18, `/ar/install/#swift` and `/en/install/#swift` at 390:** in the install-line helper, after the `arj-89` replace, add `.replace("/worldref.git", "/<wbr>worldref.git")`. The block then reads `.package(url:` / `"https://github.com/arj-89/` / `worldref.git", from: "1.2.0")`. Those are 27 and 29 characters, about 226 px and 243 px of the 314 px field. Line 2 cannot take `worldref.git",` as well (41 characters), so the browser uses the `<wbr>`. The rule matches only the Swift line, so Kotlin, PHP, Go and the URLs keep the layout seen in this pass. `data-copy` is unaffected.

### Outside this change (not counted)

- PHP first call, at 390, both languages: the mono font turns `->` into a ligature arrow (`$sa→name_ar`), and `geo->capital_en` breaks as `geo-` / `>capital_en`. A reader who types the code by hand could copy the arrow glyph. `font-variant-ligatures: none` on `pre` (or the font's `calt` off) and a break rule for `->` would fix both. This predates the change.

## Full width and modules (10/11/2026)

**Reviewer:** design-reviewer, Opus 5.5 (claude-opus-5-5), fresh context. **Scope:** Stop 2 for decision 32 in `DELEGATED-DECISIONS.md` (owner rulings: full-width titles, leads, search and form fields; module subtitles on /build), the link rule change from `inline-flex` to `inline-block`, and a regression look at the Kotlin pass 2 fixes. The width ruling is recorded in `DESIGN.md` under "Exceptions and rules", so the 65 to 75 character measure is not applied to `h1`, `.lede`, `.search` or `.try`.
**Method:** viewed in the browser. At 1280 px: `en/` home light (demo results, then the field cleared), `ar/` home dark, `en/countries/` light (intro, filter, map, Africa list), `en/build/` light (ticked Currency, then Clear selection), `ar/build/` dark, `ar/countries/sa/` dark (header, phone tester), `en/countries/sa/#sources` dark, `ar/install/#php` dark (first call opened). At 390 px: `http://127.0.0.1:8765/m390.html`, all 7 frames in dark (`ar` and `en` home, `ar/countries`, `en` and `ar` build, `en/install` Swift and Kotlin, `ar/install` PHP and Go). I read `site/assets/site.css` and the `/build` markup in `site/build.mjs` (lines 296 to 301). I did not view light at 390 or `ar/countries` at 1280; they share the same cascade as the cells I did view.

**Result: FAIL (6 checks: 4, 10, 11, 14, 18, 19).** The width ruling itself is applied correctly. Most of the FAILs come from the new link rule at `site.css` line 87.

| # | Item | PASS/FAIL | Evidence |
| --- | --- | --- | --- |
| 1 | Full width: title, lead, search, tester | PASS | 1280: `en/` and `ar/` home, `en/countries/` and both `/build` pages show the `h1`, `.lede` and search field across the full 936 px column. On `ar/countries/sa/`, the phone tester field fills the whole value column (672 px). Long body copy keeps 68ch (the `en/build` subdivisions hint wraps at about 100 characters). |
| 4 | Result and list rows | FAIL | The new rule `li > a:only-child { display: inline-block; padding-block: 10px }` (specificity 0,1,2) beats `.rows a { display: flex; gap: 4px 10px }` (0,1,1). Every `.rows` link row has lost its flex layout. `en/` home results at 1280: "🇺🇸United Statesالولايات المتحدةYour region +1", "🇦🇫Afghanistanأفغانستان+93", with flag, name, other name and dial code run together and the meta no longer at the row's end. `en/countries/` at 1280: all 242 rows, for example "Algeria(الجزائر)+213" and "Cape Verde(الرأس الأخضر)+238". At 390 the same happens in the `ar` home, `en` home and `ar/countries` frames («الأردنJordan+962», «أذربيجان(Azerbaijan)+994»). `/agents` uses the same `.rows a` markup, so it is affected by the same rule; I did not view it. |
| 11 | Chevrons on `.btn` links | FAIL | Line 87 also hits `.btn` links (`.guide a.btn`, and `p > a.btn:only-child`). They change from `inline-flex` to `inline-block`, so `.btn::after` is an inline box: its size and rotation no longer apply, and the chevron shows as a 1.5 px vertical bar. Seen on `ar/install` 1280 dark («صفحة الحزمة على pub.dev|», «الدليل الكامل على GitHub|») and at 390 in `en/install` ("The package on Maven Central|", "Full guide on GitHub|") and `ar/install`. Also seen on `ar/countries/sa/` 1280, next to «افتح ملف JSON». |
| 10 | Module subtitles, copy | FAIL | `en/build` 1280: "FIFA and IOC codes" has the subtitle "FIFA and IOC codes", which repeats the label word for word. The Arabic subtitle does add something («رمز فيفا ورمز اللجنة الأولمبية الدولية» under «رموز فيفا والأولمبية»). The other 8 subtitles in both languages say what the module holds and read naturally. «الجغرافيا والمناطق الزمنية» / "Geography and time zones" is shown as specified. |
| — | Module grid, status, Clear | PASS | 1280: 3 columns in both languages, each checkbox aligned with its label's first line, and the muted subtitle under the label. 390: one column. Ticking Currency changes the status line to "1 of 9: currency". Clear selection unticks it and restores "All 9 modules. Pick none and you get every module." The subdivisions hint sits under the legend in both languages. |
| 14 | Widows after the width change | FAIL | `en/` home 1280: the `h1` ends with "both" alone on line 2. `ar/` home 1280: the lead ends with «حساب.» alone on line 2. `en/build` 1280: the subdivisions hint (a `p`, still capped at 68ch) leaves "type" alone on line 2, where the full column would hold the whole line. The Arabic hint fits on one line. These are the most visible lines on each page, and an orphaned last word makes them look unfinished. |
| 18 | API URL in the Arabic country header | FAIL | `ar/countries/sa/` 1280 dark: the URL `https://arj-89.github.io/worldref/api/v1/sa.json` sits at the far left of the column. Its label «افتح ملف JSON» and its copy button are at the right edge, about 560 px away. `.cmd { justify-items: stretch }` makes the LTR `code.url` span the full row, so the URL aligns left inside it. |
| 19 | Link rhythm in footnote lists | FAIL | `en/countries/sa#sources` 1280 dark: each item that has a link is 44 px tall (the `.fine a` tap target). The one item with no link, "Official sources per country (GOV.UK FCDO, …)", sits at the 20 px text line height. It is pressed against the next item, so the list spacing is uneven. |
| 9 | 44 px targets elsewhere | PASS | Footer links (`en/` home 1280), "Show all 242 countries", «لا تجد مكانًا تبحث عنه؟ راجع سياسة البيانات.» and the guide links all keep a 44 px box. They line up with their neighbours, on one baseline in the footer row and stacked 56 px apart at 390. |
| 10 | "Show all 242 countries" | PASS | `en/` home 1280 with the field cleared: "Show all 242 countries", with the spaces kept. |
| 18 | Swift at 390 (Kotlin pass 2 fix) | PASS | `en/install` frame: `.package(url:` / `"https://github.com/arj-89/` / `worldref.git", from: "1.2.0")`. The word `git` is whole. Kotlin is unchanged (`implementation(` / `"io.github.arj-89:worldref:1.2.0")`). |
| — | PHP first call | PASS | `ar/install` 1280 dark: `$sa->name_ar` and `$sa->geo->capital_en` show a plain `->`, with no ligature arrow. |
| 8 | Themes | PASS | Dark on `ar/build`, `ar/countries/sa`, `ar/install` and all 390 frames. Light on `en/` home, `en/countries/` and `en/build`. The subtitles and hints are legible in `--muted` in both themes. |

### Notes to the builder (full width and modules)

1. **Checks 4 and 11, `site/assets/site.css` line 87:** replace the selector list with `p > a:only-child:not(.btn), .fine a, .guide a:not(.btn), :not(.rows) > li > a:only-child:not(.btn)`. Keep the same declarations.
   - `.rows a` gets its flex row back: flag, name, other name, and the meta at the end.
   - `.btn` gets back its `inline-flex` and its chevron. It already has `min-block-size: 44px`.
   - "Show all 242 countries" stays `inline-block`, so its spaces stay too.
   - Re-check `en/` home results, `en/countries/` and `/agents`, plus the `/install` guide links and the `ar/countries/sa` header link.
2. **Check 10, `docs/design/flows/onboarding/WORDING.md`, `module.sports.desc` (English):** "The FIFA code and the International Olympic Committee code". Leave the Arabic as it is.
3. **Check 14, `site/assets/site.css`:**
   - Add `h1, .lede { text-wrap: pretty; }`. The lines still use the full column, but the browser pulls a second word down, giving "…English, / or both" and «…من مصادر رسمية / وبلا حساب.». The copy itself does not change.
   - Add `max-inline-size: none;` to `.builder .hint` (line 176), so the subdivisions hint uses the full column, as the width ruling asks for form fields.
4. **Check 18, `site/assets/site.css` line 162:** change it to `.c-head .cmd code.url { font-size: 0.8125rem; color: var(--muted); justify-self: start; }`. The URL box then shrinks to its text and sits at the start edge: right in Arabic, left in English. It lines up with the label and the copy button.
5. **Check 19, `site/assets/site.css`:** add `.fine li { min-block-size: 44px; }`. Every source item is then at least as tall as the linked ones, so the rhythm is even.

### Not counted

- Decision 32 calls for "a one-line subtitle under each module". At 1280, 7 of the 9 English subtitles and 6 of the 9 Arabic ones run to 2 or 3 lines in the 3-column grid (for example "ISO codes, common, official and alternative names, flag, continent, groups, internet domain, sort keys"). I read "one-line" as one phrase rather than one rendered line, so I did not fail it. If the owner meant one rendered line, each subtitle has to drop to about 40 characters.
- `/build` checkboxes: the label wraps both the module name and its subtitle, and the input also points `aria-describedby` at the subtitle. The accessible name may therefore include the subtitle, and the subtitle would then be read twice. The browser tools did not show me the computed name, so this is unconfirmed. Check it with VoiceOver. If it is the case, give the name span an id and point `aria-labelledby` at it.

### Pass 2

**Reviewer:** Opus 5.5 (claude-opus-5-5). **Date:** 10/11/2026.
**Method:** viewed in the browser after the rebuild. At 1280 px: `en/` home dark (demo result), `ar/` home light, `ar/countries/` dark (intro, map, Asia list; the 1280 cell missing from pass 1), `en/agents/` dark (files list), `ar/countries/sa/` dark (header), `ar/install/#kotlin` dark, `en/countries/sa/` dark (sources), `en/build/` light. At 390 px: `http://127.0.0.1:8765/m390.html` in light (the theme missing from pass 1). Frames: `ar` and `en` home (search for "K"), `ar/countries`, `en` and `ar` build, `en/install` Swift and Kotlin. I read the new `.mod` rules in `site/assets/site.css` (lines 179 to 182) and the built `/build` markup.

**Result: FAIL (1 check: 19).** All six FAILs from the first pass of this section are fixed. Moving the subtitle out of the label (done for the screen-reader note) left it out of line with the module name.

| # | Item | Pass 2 | Evidence |
| --- | --- | --- | --- |
| 4 | Result and list rows | PASS | `en/` home 1280 dark: "🇪🇬 Egypt مصر", with "+20" at the row's end. `ar/countries/` 1280 dark: flag, name and «(Azerbaijan)» at the right, «+994» at the row's end on the left, for all 50 rows of Asia. `en/agents/` 1280 dark: each file name sits at the start of its row and its description at the end. At 390 in light, the `ar` and `en` home and `ar/countries` frames all show the same layout. |
| 11 | `.btn` chevrons | PASS | `ar/install/#kotlin` 1280 dark: «صفحة الحزمة على Maven Central ‹» and «الدليل الكامل على GitHub ‹», with the same chevrons on PyPI. `ar/countries/sa/` 1280: «افتح ملف JSON ‹». At 390 in light (`en/install`): "The package on Maven Central ›" and "Full guide on GitHub ›". |
| 10 | Sports subtitle | PASS | `en/build` 1280 light: "The FIFA code and the International Olympic Committee code". |
| 14 | Widows | PASS | `en/` home 1280: "Every country in Arabic, English, / or both". `ar/` home 1280: «… من مصادر رسمية / وبلا حساب.». `en/build`: the subdivisions hint now fits on one line. At 390: "Every country in / Arabic, English, / or both", and the Arabic lead ends «مصادر رسمية وبلا حساب.» with no lone word. |
| 18 | Arabic header URL | PASS | `ar/countries/sa/` 1280 dark: the URL now sits at the right, under «افتح ملف JSON» and above the copy button. |
| 19 | Sources list rhythm | PASS | `en/countries/sa` 1280 dark: the item without a link is now as tall as its neighbours, about 33 px of space above and below it, against 44 px between the one-line link items. The leftover difference comes from the item's two lines, and it no longer touches the next item. |
| 9 | `/build` checkbox name | PASS | The subtitle is now a `p.hint` outside the `label`. The browser tool reports the Currency checkbox's name as the module name only, with the subtitle as its description. |
| 19 | Subtitle alignment on `/build` | FAIL | `en/build` 1280 light: the module name starts 36 px from the column edge, but the subtitle starts at 28 px, 8 px further in towards the checkbox. It lines up with neither the checkbox nor the name, and this repeats on all 9 modules. The same offset shows at 390 in the `en` and `ar` build frames (in Arabic it mirrors: the subtitle ends 8 px to the right of the name). Cause: `.builder .mod .hint { margin-inline-start: 28px }` assumes checkbox 20 px plus gap 8 px. The checkbox also keeps the browser's default margin (about 4 px before and 3 px after), so the name sits at about 35 px. |
| 8 | Light at 390, `ar/countries` at 1280 | PASS | All 390 frames in light: the contrast of the rows, chips, subtitles and code fields matches the dark cells. `ar/countries` 1280: the title, lead, filter and map span the full column, and the list rows are correct. |

### Notes to the builder (full width and modules, pass 2)

1. **Check 19, `/en/build/` and `/ar/build/`, 1280 and 390:** in `site/assets/site.css`, add `.builder .mod input { margin: 0; }`. The name then starts at 28 px (20 px checkbox plus 8 px gap), the same as the subtitle's `margin-inline-start: 28px`, in both directions. The checkbox also sits flush with the column edge, like the status line above it. The other radios and checkboxes on the page keep their current margins.

### Pass 3

**Reviewer:** Opus 5.5 (claude-opus-5-5). **Date:** 10/11/2026.
**Method:** viewed in the browser, served build `.builder .mod input { margin: 0; }`. At 1280: `en/build/` light and `ar/build/` light. I zoomed on the "Language of names" radios and the first module in each language and measured the edges against the column edge (176 px in English, 1112 px in Arabic). At 390: the `en` and `ar` build frames in `http://127.0.0.1:8765/m390.html`, light.

**Result: FAIL (1 check: 19).** The subtitle now lines up with the module name. My pass 2 prescription was too narrow, though. It zeroed the margin on the module checkboxes only, so in the same form they are now out of line with the radio buttons above them.

| # | Item | Pass 3 | Evidence |
| --- | --- | --- | --- |
| 19 | Subtitle against name | PASS | `en/build` 1280: the name and subtitle both start at 28 px from the column edge ("Names and codes" over "ISO codes, common, …"), on all 9 modules. `ar/build` 1280: both end 28 px from the right edge. At 390, `en` frame: both start at 28 px; `ar` frame: both end at the same point. |
| — | Other radios and checkboxes | Unchanged, as specified | The "Language of names", "Subdivisions" and "Format" radios keep the browser's default margin. They are the only other controls on /build. |
| 19 | One edge for the whole form | FAIL | `en/build` 1280: the radio circles start about 4 px in from the column edge, and the module checkboxes start at the edge itself. The radio labels ("Arabic and English") start at about 36 px, and the module names ("Names and codes") at 28 px. So going down the form, the label column jumps 8 px between "Language of names" and "Modules", and back again at "Subdivisions" and "Format". The same holds mirrored on `ar/build` 1280 («عربي وإنجليزي» ends about 8 px further from the right edge than «الأسماء والرموز») and at 390 in both frames ("Arabic and English" at about 36 px, "Names and codes" at 28 px). |

### Notes to the builder (full width and modules, pass 3)

1. **Check 19, `/en/build/` and `/ar/build/`, 1280 and 390:**
   - In `site/assets/site.css`, add `margin: 0;` to the existing rule on line 175. It then reads `.builder input[type="radio"], .builder input[type="checkbox"] { inline-size: 20px; block-size: 20px; accent-color: var(--accent); margin: 0; }`.
   - The `.builder .mod input { margin: 0; }` rule from pass 2 then says nothing new and can be removed.
   - Result: every control on /build starts at the column edge, and every label starts 28 px in (20 px control plus 8 px gap). That matches the subtitles, in both directions.
   - The gap between radio options (`margin-inline-end: 22px`) and the 44 px label height are unchanged.

### Pass 4

**Reviewer:** Opus 5.5 (claude-opus-5-5). **Date:** 10/11/2026.
**Method:** viewed in the browser, served build from branch `site/build-align`: `margin: 0` on `.builder input[type="radio"], .builder input[type="checkbox"]`, with the `.builder .mod input` rule removed. At 1280, light: `en/build/` and `ar/build/`, the whole form from "Language of names" down to "Format". At 390, light: the `en` and `ar` build frames in `http://127.0.0.1:8765/m390.html`, scrolled from the top of the form to "Subdivisions" (`en`) and "Format" (`ar`).

**Result: PASS.** Check 19 passes, and every control and label on /build now shares one edge.

| # | Item | Pass 4 | Evidence |
| --- | --- | --- | --- |
| 19 | Controls on one edge | PASS | `en/build` 1280: the "Arabic and English" radio, the "Names and codes" checkbox, the "Without" radio and the "JSON" radio all start at the column edge, the same edge as the legends and the status line. `ar/build` 1280: «عربي وإنجليزي», «الأسماء والرموز», «بدونها» and «JSON» all end at the right column edge. |
| 19 | Labels and subtitles on one line | PASS | `en/build` 1280: the radio labels, module names and subtitles all start 28 px in ("Arabic and English", "Names and codes", "ISO codes, common, …", "Without", "JSON"). `ar/build` 1280: all of them end 28 px from the right edge. |
| 19 | At 390 | PASS | `en` frame: controls at the column edge and labels 28 px in, through "Language of names" (including "English only", which wraps to its own row), all 9 modules and "Subdivisions" ("Only subdivisions" on its wrapped row). `ar` frame: the same, mirrored, through «إنجليزي فقط», the modules, «وحدها» and «CSV». |
| — | Unchanged | PASS | The 22 px gap between radio options and the 44 px label height are as before. "Clear selection" / «امسح الاختيار» and the hints are unchanged. |

**Final state of this section:** every FAIL from the first pass of this section and from passes 2 and 3 is fixed and verified. Ready to merge from Stop 2's side.

## Install icons and release notes (10/11/2026)

**Reviewer:** design-reviewer, Opus 5.5 (claude-opus-5-5), fresh context. **Scope:** Stop 2, Delegated mode, lean per `DELEGATED-DECISIONS.md` entry 25. Branch `site/icons-releases`, PR #3: (1) brand marks on the /install stack headings and jump chips (Simple Icons 16.37.0, `site/icons.json`); (2) the new release notes page `/{lang}/releases/` and its footer link.
**Method:** viewed in the browser. At 1280 px: `en/install` light (chips, then every stack heading down to the footer), `ar/install` dark (chips, JavaScript and CDN headings), `en/releases` light and dark, `ar/releases` light (1.2.0 and 1.1.0) and dark (1.0.0 and the footer). At 390 px: `http://127.0.0.1:8765/m390.html`. I viewed all four frames in light and the three upper frames in dark, and scrolled `ar/releases` from 1.2.0 to 1.1.2 and `en/releases` from 1.2.0 to 1.1.1. I read `site/build.mjs` (`marks`, `changelog`, `releases`, `isoLatin`), `site/assets/site.css` lines 123 to 129, `site/icons.json`, `CHANGELOG.ar.md`, the flow spec, WORDING and `site/_out/api/v1/{ie,ir,iq,tr}.json`. I grepped `site/_out` for the footer link and for the excluded state's name. I applied the vendored Web Interface Guidelines (upstream commit 434b7f9) and read Apple's trademark guidelines for third parties on apple.com. The theme was set back to Light afterwards. Not checked: the largest text size, and `en/releases` at 390 in dark.

**Result: FAIL (6 checks: 1, 7, 10, 11, 14, 18).**

Contrast: the marks are `--muted` on `--bg`, which measures 5.69:1 in light and 7.58:1 in dark. The floor for non-text graphics is 3:1.

| # | Check | PASS/FAIL | Evidence |
| --- | --- | --- | --- |
| 1 | Matches the approved flow | FAIL | `ar/releases` 1.2.0, the «تغيير» item says «(تركيا: ولاية، وإيران وأيرلندا والعراق: محافظة)». The data gives Ireland `region_label_ar: "مقاطعة"` (`api/v1/ie.json`), and the English item lists only Turkey, Iran and Iraq, so the Arabic page states something false. The rest matches the flow spec: title, one-line lede, GitHub releases link, one section per version with the newest first, version heading, date and list. The footer link is on all 496 pages (2 × 248). |
| 2 | One job, one primary action | PASS | The release page only reads, and its one action is the GitHub link. The marks add no action. |
| 3 | All states | PASS | Static page. `releases()` falls back to `releases.auto` and the date for a version that `CHANGELOG.ar.md` does not cover. It is not triggered now because every version is covered, so the Arabic page has no English prose. |
| 4 | Density | PASS | Releases at 1280: the version is in the label column, and the date sits muted at the top of the facts column on the heading's baseline. Below it come the summary and the list, with 8 px between items and one hairline between versions. At 390 the date sits under the version. The 14 items in 1.2.0 are long, but each is one change. Install: the marks add one 24 px row above each heading and leave no new empty area. |
| 5 | Native first, one pattern | PASS | One `marks()` helper and one `.marks` rule serve both the headings (up to 3 marks, 24 px) and the chips (the first mark, 16 px). The GitHub link under the release lede uses the plain standalone link style that home already uses ("Full policy on GitHub"). |
| 6 | Motion | PASS | Nothing added. |
| 7 | Both languages native, RTL | FAIL | (a) `ar/releases` lede (WORDING `releases.body`): «…والأول تغيير يكسر.» A verb with no object reads unfinished and copies "breaking change" word for word. (b) `ar/releases` 1.2.0, search item: in «وإذا لم يطابق شيء فقط يُقبل الاسم…», «فقط» follows «شيء», so the clause reads as "if only nothing matches". The English means "only when nothing else matches". RTL on /install passes: in `ar/install` (1280 dark and 390) the first mark sits at the right edge and the order mirrors, and no logo is flipped (the Swift bird and the Kotlin K face the same way as in `en`). |
| 8 | Light and Dark | PASS | Both pages, both languages, 1280 light and dark. 390 in light (four frames) and dark (three frames). Marks, dates, hints and lists are legible in both themes. |
| 9 | Accessibility floor | PASS | Marks have `aria-hidden="true"` and `focusable="false"`, and the heading and chip text names each stack. The footer link and the GitHub link keep their 44 px boxes. Contrast is measured above. |
| 10 | Copy rules | FAIL | (a) `en/releases` 1.0.0 says "5012 ISO 3166-2 subdivisions", while 1.2.0 on the same page says "5,012". The Arabic page uses 5,012 in both. (b) Web Interface Guidelines, Typography: the changelogs use "..." instead of "…" ("Libya شعبية...", "Casablanca-Settat...", «الدار البيضاء سطات»...). |
| 11 | Icons | FAIL | (a) Simple Icons fits every mark into a 24 × 24 box by its widest side. The three wordmark-only logos (`php`, `go`, `dotnet`) therefore render about 7 to 12 px tall, next to 24 px square marks. In the 16 px chips, ".NET" and "GO" are about 4 to 6 px tall and cannot be read. On `en/install` 1280, the C# mark reads as a tiny ".NET" caption above "C#, .NET". (b) `stacks.swift` includes the Apple logo. Apple's guidelines for third parties (section 2) say: "You may not use the Apple Logo or any other Apple-owned graphic symbol". The Swift section already names its platforms ("iOS, macOS"). (c) The standard takes logos from fa-brands. Simple Icons replaces that source here, and `DESIGN.md` does not record the exception. |
| 12 | Imagery | PASS | Out of scope (entry 25). |
| 13 | Tokens only | PASS | `.marks` uses `var(--muted)` through `currentColor`. Sizes and gaps are in px, like the rest of `site.css`. `DESIGN.md` defines no spacing tokens. |
| 14 | Feels like the product | FAIL | "Exact" is missed on /install. Three of the twelve chips, in the first row a visitor sees, carry a mark that cannot be read, at a third of the height of its neighbours (cause 11a). Otherwise the muted marks read calm, and the release page reads like the rest of the fact sheet. |
| 15 | Bars never hide content | PASS | The to-top pill behaves as in earlier passes, and the footer end padding clears it. |
| 16 | One scroll axis | PASS | 390, all four frames in light and the three upper frames in dark: no horizontal scroll. Long inline code wraps inside the column (`dotnet add package WorldRef`, `io.github.arj-89/worldref`). |
| 17 | No clipped icons | PASS | Marks are whole at 24 px and 16 px, in both languages and both themes. The chips wrap without clipping at 390. |
| 18 | Mixed-direction lines | FAIL | (a) `en/releases` 1.2.0, 1280 light and dark: "Morocco جهة, عمالة, إقليم" shows as "Morocco إقليم ,عمالة ,جهة,". The three Arabic terms and the commas between them form one RTL run, so the order reverses and the commas attach to the wrong words. (b) `ar/releases` 1.1.2 at 390, light: «JSON-RPC رقم -32600» shows the code as "32600-", with the minus on the right of the digits. The same bidi rule turns «"+971"» in 1.1.0 into "971+", and "C#" in 1.2.0 and 1.0.0 into "#C": a leading sign or a trailing # takes the Arabic direction. Cause: `inline()` in `changelog()` does not apply `isoLatin`, which /install uses for exactly C# and .NET. `isoLatin` also cannot start a run at "-". These read correctly: versions, dates, URLs, `<code dir="ltr">` spans, `UTC±hh:mm` and "ISO 3166-2". |
| 19 | Dates, spacing | PASS | Dates are Gregorian DD/MM/YYYY, and Hijri is not relevant here. Section spacing matches the other pages. |
| 20 | Footer | PASS | «سجل الإصدارات» / "Release notes" ends the site-pages row, after «سياسة البيانات» / "Data policy", on every page (496 files). The 404 page is unchanged. |

**Excluded state's name:** a case-insensitive grep of `site/_out` for the English and Arabic names finds 3 files: `AGENTS.md`, `llms.txt` and `llms-full.txt`, the three the scan exempts. It is not on any HTML page. PASS.

**Web Interface Guidelines:** the decorative icons have `aria-hidden` (pass). The "…" rule fails (check 10b). Nothing else applies to this change.

### Mechanical gate

| Item | Result |
| --- | --- |
| Lint pack green | Not on the board (descoped under entry 25). |
| Screenshot matrix | No board. Viewed live: both pages, both languages, 1280 light and dark, and 390 light (four frames) and dark (three frames). Largest text size not checked, as in earlier sections. |
| Recordings | Not needed: no interaction added. |

### Notes to the builder (install icons and release notes)

1. **Check 1, `ar/releases` 1.2.0 (`CHANGELOG.ar.md` line 17):** «(تركيا: ولاية، وإيران والعراق: محافظة)». This removes «أيرلندا».
2. **Check 7a, `docs/design/flows/releases/WORDING.md` `releases.body` (Arabic):** end the lede with «…والأول تغيير يكسر التوافق.»
3. **Check 7b, `CHANGELOG.ar.md` line 12:** «…وعلامات الترقيم («cote divoire»)، وإن لم يطابق شيءٌ آخر، فعندها فقط يُقبل الاسم الذي يختلف بحرف واحد عن نص من 4 إلى 7 أحرف…»
4. **Check 10:** in `CHANGELOG.md` 1.0.0, change "5012" to "5,012". In `CHANGELOG.md` and `CHANGELOG.ar.md`, replace every "..." with "…".
5. **Checks 11a and 14, `site/icons.json`, `site/build.mjs` `marks()` and `site/assets/site.css` lines 123 to 126:**
   - When vendoring, store a `viewBox` per icon, cropped to the path's bounding box. Have `marks()` use it instead of `0 0 24 24`.
   - Size every mark by height: `.marks svg { block-size: 20px; inline-size: auto; }` and `.jump a .marks svg { block-size: 14px; inline-size: auto; }`.
   - Result: the square marks shrink slightly, and the PHP, Go and .NET wordmarks get the same height as the rest, so they can be read in the headings and the chips.
   - Re-check the chip rows at 1280 and 390 in both languages.
6. **Check 11b, `site/icons.json`:** remove `apple` from `stacks.swift` and from `icons`.
7. **Check 11c, `DESIGN.md` "Exceptions and rules":** add a line along these lines: "Brand marks on /install: Simple Icons 16.37.0 (CC0), vendored in `site/icons.json`, one colour (`--muted`), decorative (`aria-hidden`), used instead of fa-brands because …". Give the actual reason (the stacks that fa-brands does not cover).
8. **Check 18, `site/build.mjs` and `CHANGELOG.ar.md`:**
   - On the Arabic page, pass every item and paragraph through `isoLatin` after `inline()`.
   - Widen the start of `isoLatin`'s run from `[A-Za-z.#+]` to `(?:[A-Za-z.#+]|-(?=\d))`, so "-32600" is isolated.
   - In `CHANGELOG.ar.md`, quote the Latin examples with «» instead of straight quotes ("971", "+971", "US", "UK", "Bosnia", "Hong Kong SAR China", "Hong Kong", "cote divoire", "Kuwiat"). `isoLatin` already accepts «» before a run, and this also ends the mix of «» and straight quotes inside one bracket («"Kuwiat"، «الكويب»»).
   - On the English page, isolate the Arabic runs: `.replace(/[؀-ۿ]+(?:[  ][؀-ۿ]+)*(?![^<]*>)/g, (m) => '<bdi lang="ar" dir="rtl">' + m + '</bdi>')`. "Morocco جهة, عمالة, إقليم" then shows in source order, with each comma after its own word.
   - After the rebuild, re-check `ar/install` and one Arabic country page for `isoLatin` side effects.

### Outside this change (not counted; owner decisions)

- The Swift logo is also an Apple-owned graphic symbol, so the same Apple clause appears to cover it. I did not confirm whether swift.org grants a separate permission. The owner should decide whether to keep it.
- Google's Android brand guidelines are generally understood to license the Android robot under CC BY 3.0, which requires attribution. I did not re-check them in this pass, and the site has no attribution. Either add an attribution line to the licences page or drop the `android` mark.
- "Any language" shows JSON, PostgreSQL and SQLite. The text also names MySQL, so with the three-mark cap the marks suggest only two of the three SQL engines are supported.
- The /install "Any language" section has a "Releases page" link (GitHub files), while the footer now has "Release notes" (this site's page). Two near-identical names point to different places.
- At 390, inline code and version numbers wrap at spaces and hyphens ("Node" / "20.10", "JSON-" / "RPC", `addressForm(country,` / `lang)`). It stays readable, so it is not failed.
- The footer's "v1.2.0" could link to the release page.

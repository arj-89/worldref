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

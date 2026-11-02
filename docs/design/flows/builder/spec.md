# Flow spec: 3. Custom-file builder

The page `/{lang}/build/`: choose language build, modules, subdivisions and format, see the exact size and a real preview before downloading, and get the published file's CDN URL whenever the choice equals a shipped file. Everything runs in the browser from the published files. Platform-neutral. Approved at Stop 1 together with the wireframe; nothing here is built before approval.

**Status:** draft, 02/11/2026
**Approval mode:** Delegated
**Model:** Opus 5.5 (claude-opus-5-5), by the owner's ruling in `DELEGATED-DECISIONS.md` entry 10
**Wording:** `docs/design/flows/builder/WORDING.md` (plus the shared keys in `docs/design/flows/onboarding/WORDING.md`)
**Wireframe:** `docs/design/flows/builder/wireframe.html`

## 1. Goal

The visitor downloads exactly the file their project needs (one language or both, only the modules they use, with or without subdivisions, JSON or CSV), knowing its size and shape before the download starts.

## 2. User and context

- **Who:** developers on a stack with no package (or who prefer plain data), anyone seeding a database or a spreadsheet, and developers who want only Arabic names or only the phone rules.
- **Situation:** setting up a project. They will commit the file or load it at runtime, so size and shape matter.
- **What they know:** what JSON and CSV are. They may not know that the data is split into 9 modules joined on `iso2`, or that a single-language build drops the `_ar` and `_en` suffixes.
- **State of mind:** careful. They want to see the shape before committing to it (Hugging Face reference: counts and sizes beside each choice, a preview with an explicit end).

## 3. Entry points

| Entry | From | Condition |
| --- | --- | --- |
| `/{lang}/build/` | Home "Build a file" action and row, menu, footer, the install page's "Any language" row and module hint | Defaults: Arabic and English, all 9 modules, no subdivisions, JSON |
| The same URL with a query (`?b=ar&m=core,phone&s=inside&f=csv`) | Shared links, the country page's "build a file with this module" | Choices restored from the query; unknown values ignored. The query holds choices only, never personal data |

## 4. Steps

One screen; each choice updates the size line and the preview at once (Lucide reference: choose, see, take).

| # | Section | Job (one line) | Primary action | Secondary | Taps so far |
| --- | --- | --- | --- | --- | --- |
| 1 | Language of names | Pick the build | 3-segment switch: Arabic and English (default), Arabic only, English only | none | 0 or 1 |
| 2 | Modules | Narrow to the modules needed | Toggle a module row (each shows what it adds, in KB, for the current build and format) | Clear selection | +1 per module |
| 3 | Subdivisions (5,012) | Add the ISO 3166-2 list | 3-segment switch: Without (default), Inside each country, Only subdivisions | none | +0 or 1 |
| 4 | Format | JSON or CSV | 2-segment switch | none | +0 or 1 |
| 5 | Same file on the CDN (shipped selections only) | Offer the published URL instead of a download | Copy URL | none | |
| 6 | Preview of the first row | Show the exact shape (Andorra, the first row) | none | | |
| 7 | Bar (sticky at the bottom) | Name, size, download | Download | Download subdivisions (CSV with "Inside" only) | +1 |

**Selection model (decision D8).** Picking no module means all 9; the summary line says "All 9 modules", and picking the 9th module manually folds back to the same state. This keeps the full file at 1 tap and any narrowed file within 5. "Only subdivisions" replaces the module rows with one line saying modules don't apply.

**Output.** The builder writes files with the generator's own serialisation (`jsonLines`, `csv`, `localize` in `scripts/lib/outputs.mjs`): one row per line in JSON, the same flattened columns and quoting in CSV, the same key order. So a selection equal to a shipped file is byte-identical to it, and every custom file looks like its shipped siblings. "Inside each country" nests `subdivisions` in each row, the same shape as `api/v1/{iso2}.json`. CSV cannot nest, so it gives the published `subdivisions{build}.csv` as a second file.

**Shipped equivalents** (Download fetches the published file directly, no build; the CDN URL block appears):

| Selection | Shipped file |
| --- | --- |
| All 9 modules, no subdivisions, JSON | `data/worldref{build}.json` |
| All 9 modules, no subdivisions, CSV | `data/csv/worldref{build}.csv` |
| One module, no subdivisions, JSON | `data/modules/{module}{build}.json` |
| Only subdivisions, JSON or CSV | `data/subdivisions{build}.json`, `data/csv/subdivisions{build}.csv` |

**Sizes.** Exact bytes from a table written at site build time. A file's size is the sum of a base (the `iso2` column and the file's framing) and one figure per chosen module, plus the nested subdivisions when chosen; the table was checked against every shipped file (all 9 modules in 3 builds and 2 formats, and each module file) and against freshly built custom files (Arabic core and phone in JSON, CSV and JSON with subdivisions), all exact. Shown as KB to one decimal with the byte count beside it (`491.5 KB (503,245 bytes)`). No fetch is needed to show a size.

**Preview.** The first row of the chosen file, pretty-printed for JSON (first 14 lines, then "The row goes on for n more lines"), header plus first row for CSV, then "End of preview. The file has 242 rows." The first row of every module in every build is embedded at build time (a few KB), so the preview never waits on the network.

**Fetching.** Download fetches only the chosen module files of the chosen build from the same origin (`/worldref/data/modules/{module}{build}.json`, each at most 124,737 bytes; the subdivisions file 322,723 to 507,953 bytes by build), joins them on `iso2` in canonical module order, serialises, and saves through a Blob link. Files fetched during the visit are kept in memory for the next download. This needs the data files on Pages (decision D2).

## 5. Tap budget

| Path | Happy path | Budget |
| --- | --- | --- |
| Full bilingual JSON | 1 tap (Download) | 1 |
| Arabic only, `core` and `phone`, CSV | 5 taps (Arabic only, core, phone, CSV, Download) | 5 |
| Arabic only, one module, JSON | 3 taps (Arabic only, module, Download) | 5 |
| Bilingual, all modules, subdivisions inside, JSON | 2 taps (Inside each country, Download) | 5 |
| Arabic only, all modules, subdivisions, CSV | 5 taps (Arabic only, Inside, CSV, Download, Download subdivisions) | 5 |
| Copy the CDN URL of a shipped file | 1 tap after the choices | not set |

All within budget.

## 6. States

| Screen | First-run | Empty | Loading | Partial | Error | Offline | Success |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Builder | Defaults; the bar reads `worldref.json`, "Same as the published file", `491.5 KB (503,245 bytes)`; the CDN URL block shows; the preview shows Andorra | n/a by construction: no module picked means all 9, and every other choice always has a value, so no selection can be empty (D8) | Download pressed and the module files have not arrived after 300 ms: the button is disabled, shows a spinner and "Preparing the file: 0 of 2 files" | 1 of 2 files arrived: "Preparing the file: 1 of 2 files"; choices stay editable and a change cancels the build | A module file failed: the bar shows the cause naming the file (`phone.ar.json`), the fix (try again or remove that module) and Try again; nothing is saved | Offline line names the files already loaded in this visit; Download stays enabled when every needed file is loaded, else disabled with the line saying the others need a connection | "Downloaded `worldref-core-phone.ar.csv`." in the bar; the button returns to Download |

Every row captured in both languages, both themes, default and largest text, with the bar visible and the last section scrolled clear of it.

## 7. Copy

| Screen | Keys |
| --- | --- |
| Page | `build.title`, `build.body` |
| Language | `build.lang.label`, `build.bilingual`, `build.ar`, `build.en` |
| Modules | `build.modules.*`, `module.*`, `build.size.short` |
| Subdivisions | `build.subs.*`, `build.csv.two-files` |
| Format | `build.format.label` (JSON and CSV are format names, not copy) |
| CDN block | `build.shipped.title`, `build.shipped.body`, `action.copy-url`, `action.copied-url` |
| Preview | `build.preview.title`, `build.preview.more.*`, `build.preview.end`, `build.rows` |
| Bar | `build.download`, `build.download.second`, `build.shipped.tag`, `build.size`, `build.size.mb`, `build.loading`, `build.error`, `build.success`, `action.retry` |
| Offline | `state.offline.line`, `build.offline.body`, `build.offline.none` |
| One-module hint | `build.use-install`, `chrome.nav.install` |

## 8. Motion

| Trigger | Element | Property | From | To | Duration | Easing | Reduce Motion |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Any choice changes the size (the page's one authored moment) | Size figure in the bar | number tween between old and new byte counts | old | new | 250 ms | ease-out | instant swap |
| Any choice | Preview block | opacity | 0.6 | 1 | 120 ms | ease-out | instant |
| Download progress | Spinner on the button | rotation | 0 | 360° | 800 ms loop | linear | static icon and the text count only |

## 9. Data entry

The model question applies: build, modules, subdivisions and format are four facets of one file, so they share one screen and one size line; there is no separate flow per format. All choices are switches or toggles; nothing is typed. The query string mirrors the choices so a configured builder can be linked.

## 10. Edge cases

| Case | Behaviour |
| --- | --- |
| The visitor picks all 9 modules one by one | Folds back to "All 9 modules"; the shipped tag and CDN URL appear |
| One module and CSV | Custom file (no shipped CSV per module); no CDN block |
| One module and JSON | Shipped module file, CDN URL, plus the hint that a JavaScript project can import it directly (link to install `#modules`) |
| "Only subdivisions" | Module rows replaced by one line; size and preview switch to the subdivisions file (5,012 rows) |
| "Inside each country" with CSV | Two files in the bar, each with its own size and Download; the second is the shipped subdivisions CSV |
| Largest file: bilingual, all modules, subdivisions inside, JSON | Over 1 MB: the size shows in MB to two decimals with the byte count |
| Arabic-only build | Keys lose their suffix (`name_ar` becomes `name`); the preview shows that, which is the point of previewing |
| A choice changes while a download is preparing | The build is cancelled and the button returns to Download; files already fetched stay cached |
| Browser blocks the Blob download (rare in-app browsers) | Error in the bar naming the cause and offering the CDN URL or the shipped file link where one exists |
| CSV opened in Excel | Files keep the generator's UTF-8 byte order mark, so Arabic opens correctly |
| Query string with an unknown module | Ignored; the rest of the choices apply |

## 11. Acceptance list

- [ ] Defaults download `worldref.json` in 1 tap, and the saved file is byte-identical to `data/worldref.json` (checksum in the evidence).
- [ ] Arabic only, `core` and `phone`, CSV takes 5 taps and the bar shows `173,208 bytes` before the download; the saved file has exactly that size.
- [ ] The size shown for every shipped-equivalent selection equals the shipped file's size in all 3 builds (table in the evidence).
- [ ] Each module row shows what it adds in the current build and format, and the figures change when the build or format changes.
- [ ] Shipped-equivalent selections show "Same as the published file" and the CDN URL with Copy URL; custom selections show neither.
- [ ] The preview updates on every choice without a network request, ends with the explicit end line, and shows unsuffixed keys in single-language builds.
- [ ] Download fetches only the chosen module files of the chosen build (network log), all from `arj-89.github.io`.
- [ ] Loading, partial, error, offline and success render as in section 6, in both languages and both themes, default and largest text.
- [ ] The sticky bar never covers the last section when scrolled to the end; nothing scrolls sideways at 390 px.
- [ ] All switches are segmented, keyboard reachable, with visible selected state not shown by colour alone.
- [ ] File names follow `worldref-{modules}{-with-subdivisions}{build}.{json|csv}` for custom files and the shipped name otherwise.

## 12. Wireframe

`docs/design/flows/builder/wireframe.html`: one screen, every state in the corner panel. Sizes come from the exact table computed from `data/`; the preview is the real first row in each build; CSV preview uses the generator's flattening and quoting. Download is simulated (success line) in the wireframe.

## 13. Decisions needed at Stop 1

- **D2. Data files on Pages.** Pages serves only `api/`, `schema/`, `flags/` and the text files today; `data/` is not published there. The builder must fetch module files from the same origin (no external requests). Proposed: `site/build.mjs` also copies `data/worldref*.json`, `data/modules/`, `data/subdivisions*.json` and `data/csv/` to `/worldref/data/`, matching the repo paths (5,312,191 bytes, free on Pages). New paths only; nothing moves. Not proposed: `data/sql/` (3.9 MB, not offered by the builder).
- **D8. "No module picked means all 9".** It keeps the full file at 1 tap and a 2-module, single-language CSV at 5, but makes the builder's empty state unreachable by design. Alternative: an explicit "All modules" toggle above the rows, which costs 1 more tap on every narrowed file (6 for the example in section 5, over budget).
- **Shared serialiser (implementation note, no ruling needed unless the approver objects).** Byte-identical output needs `jsonLines`, `csv`, `flatten` and `localize` in the site bundle. They live in `scripts/lib/outputs.mjs`, which imports `node:fs`. The builder is their second real use, so moving them to a pure module both sides import is justified; that is a generator change outside design scope and is listed under Noticed.

# Review: worldref website (Stop 2)

**Reviewer:** design-reviewer, Opus 5.5 (claude-opus-5-5), fresh context, from the evidence only.
**Date:** 02/11/2026
**Scope:** owner rulings in `DELEGATED-DECISIONS.md` apply, entry 25 (lean scope) and entries 26 to 28 (direction B, riyal fallback, scan rules).

## Pass 1: FAIL (13 of 20)

The reviewer's write to this path was refused by a hook (it resolved paths against the session's working directory), so the builder saved its report here verbatim in substance.

Contrast, measured from the tokens in `site/assets/site.css`:

| Pair | Light | Dark | Floor |
| --- | --- | --- | --- |
| Body text on background | 16.3:1 | 16.9:1 | 4.5 |
| Secondary text on background | 5.7:1 | 7.5:1 | 4.5 |
| Secondary text on footer band | 5.2:1 | 7.1:1 | 4.5 |
| Hint on field | 5.2:1 | 6.7:1 | 4.5 |
| Link on background | 6.5:1 | 7.6:1 | 4.5 |
| Text on accent pill | 6.5:1 | 7.9:1 | 4.5 |
| Code on field | 14.8:1 | 15.1:1 | 4.5 |
| Field edge against background | 1.10:1 | 1.12:1 | 3.0 (non-text): FAIL |

| # | Check | Pass 1 | How it was handled |
| --- | --- | --- | --- |
| 1 | Matches the approved flow | FAIL | Fixed: region tag on the pinned row; continents ordered by the page language; sources named with licences and emergency hostnames; builder disables modules for "only subdivisions", disables Download while building, CSV plus "inside" downloads two files; install module example completes the sentence; 404 takes the path language first and forwards uppercase country URLs. Descoped (entry 25): footnotes on every country value, per-module sizes, CDN URL in the builder, sticky bar, unknown-stack empty state. |
| 2 | One job, one primary action | FAIL | Fixed: the 404 has one `h1`; the other-language block is demoted (no second primary). |
| 3 | All states | FAIL | Fixed: copy error as a line under the block, selection of the code text, countries filter error line, offline line on the home search, Download disabled with progress, no-JavaScript link to the index. Descoped: offline lines elsewhere. |
| 4 | Density | FAIL | Fixed: the language link sits beside the wordmark (no lone row at 390); continent counts in brackets; agents file names wrap as one block; aliases summary keeps its spaces; FAQ questions are one text run. |
| 5 | Native first | PASS | |
| 6 | Motion | FAIL | Fixed: pressed state on every link and control; View Transitions rule under no-preference; result fade 120 ms. |
| 7 | Both languages native, RTL | FAIL | Fixed: per-language list separators; English calendar names in brackets; chevrons through `:dir()`; English module labels capitalised; English source versions lowercase mid-line. |
| 8 | Themes | PASS | |
| 9 | Accessibility floor | FAIL | Fixed: switches 44 px; 44 px hit areas for footnotes and standalone small links; current nav item by weight and underline; field edge token (#8e8e93 light, #6e6e73 dark); theme switch as pressed buttons; results region and footer navigation named. |
| 10 | Copy rules | FAIL | Fixed: dangling colon; Font Awesome credit removed (no icons ship); 404 no longer asks to search; ellipsis character. |
| 11 | Icons | PASS | |
| 12 | Imagery | PASS | Out of scope (entry 25). |
| 13 | Tokens only | FAIL | Descoped (entry 25): the token table in `DESIGN.md` and the spacing-scale refactor. Colours and fonts are tokens. |
| 14 | Feels like the product | FAIL | Its causes are the items under 4, 7 and 18, all fixed. |
| 15 | Bars never hide content | PASS | |
| 16 | One scroll axis | PASS | |
| 17 | No clipped icons | PASS | |
| 18 | Mixed-direction lines | FAIL | Fixed: Latin runs isolated in Arabic install names («C# و.NET»); `dir="auto"` on both search fields; «لـ» kept with the number. |
| 19 | Spacing | FAIL | Fixed: builder fieldset spacing. |
| 20 | Footer | FAIL | Fixed: privacy line in every footer; the 404 has a footer. |
| Gate | Lint, matrix, recordings | FAIL | Matrix recaptured: 58 cells in `docs/design/boards/site/` (every page in both languages, both themes, 390 and 1280, plus root and 404). Descoped (entry 25): recordings, lint output on the board, largest-text cells. |

## Pass 2

Narrow re-check of the fixes above: see below.

**Result: 15 PASS, 3 FAIL** (Opus 5.5, 02/11/2026). Items 1 to 3, 5 to 16 PASS.

| # | Pass 2 FAIL | Fix applied as the reviewer prescribed |
| --- | --- | --- |
| 4 | Meta descriptions joined with " , "; number lists on Arabic pages used ", " | Descriptions and every list (lengths, prefixes, plugs, phone-tester lengths) join by page language, each item isolated |
| 17 | CSV plus "inside": preview, size and status did not match the two files; second automatic download could be blocked; modules hint stale | Preview and size built from the two files with the "two files" note; the second file is a "Download subdivisions" button; `build.modules.off` shown when modules do not apply; progress reaches the total |
| 18 | Copy failure selected the wrong text on the install modules block and nothing on country pages | The modules URL has its own block; country pages show the URL as text beside its Copy; selection prefers the code right before the button |

Side notes also fixed: country pages mark "Countries" as the current nav item; the aliases disclosure shows its marker. Browser checks after the fixes: all search vectors, the phone tester, the builder, no overflow, no script errors, absence scan clean.

**Stop 2:** fixes applied verbatim from the reviewer's prescriptions; released under owner ruling entry 25 (one review pass, move fast).

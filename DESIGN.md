# DESIGN.md: worldref website

**Status:** shipped (v1.1.1, 04/11/2026). Direction B "Fact sheet" (DELEGATED-DECISIONS.md entry 26).
**Approval mode:** Delegated. Hard stops (money, making a repo public, deleting data, irreversible migrations, secrets) go to the owner.
**Surface:** website, static export to GitHub Pages (`site/build.mjs`, plain Node; entry 25).

## Identity

- Feel: exact, calm, native in both languages, fast, trustworthy (entry 3).
- No cards. Each section: a display-face label column (216 px from 860 px) beside the facts; one hairline between sections.
- One accent, used for the primary pill, links and focus. Numbered footnotes point to versions and sources.

## Tokens (source of truth: `site/assets/site.css`, `:root`)

| Token | Light | Dark |
| --- | --- | --- |
| `--bg` | #fbfbfc | #111113 |
| `--text` | #1d1d1f | #f2f2f4 |
| `--muted` | #64646a | #a3a3aa |
| `--hair` | #d2d2d7 | #38383d |
| `--field` | #f0f0f3 | #1d1d20 |
| `--field-edge` | #8e8e93 | #6e6e73 |
| `--accent` | #0b5cad | #5ea6ff |
| `--error` | #a3271c | #ff9b8f |
| `--land` (map) | #d6d6dc | #2c2c31 |

- Type: IBM Plex Sans Arabic 400/600 (body, UI), Noto Kufi Arabic 600 (h1, section labels, figures, wordmark), JetBrains Mono 400 (code). All OFL, self-hosted, `font-display: swap`. Thmanyah is not used here (public repo; entry 1).
- Radius: 980 px pills, 12 px fields and code, 2 px flags.
- Motion: search results fade 120 ms; FAQ chevron 200 ms; pressed state opacity .85; View Transitions; all off under Reduce Motion.

## Exceptions and rules specific to this project

- **Map:** a real world map on the countries page only (owner rulings, entries 29 and 30). Natural Earth admin-0, Saudi Arabia point of view, the excluded state's polygon merged into Palestine. Not a precedent for other pages or projects.
- **Featured example:** Jordan («الاردن», 00962), not the UAE (entry 30).
- **Digits:** no Arabic-Indic digit in authored content (entry 15); visitors may type them.
- **Riyal:** U+20C1 through the system font, with «ر.س» shown as the text fallback (entry 27).
- Width (owner ruling, 10/11/2026): page titles, lead paragraphs, search fields and form fields use the full content column (980 px less the gutters) in both languages. This overrides the standard's 65 to 75 character measure for those elements; long-form body paragraphs keep `p { max-inline-size: 68ch }`.

## Blocked references

Studio and sibling-project UIs; competitor country-data sites as look references; generic landing-template tells (entry 9). Map imagery only as above.

## Carousels and custom controls

None. The theme control is one button that cycles System, Light, Dark (entry 29).

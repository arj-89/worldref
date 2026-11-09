# LESSONS: worldref website

Append-only. One entry per lesson, written the day it is learned. The owner reviews this file weekly or monthly and brings lessons back into the product-design skill. A lesson that affects a sibling app is applied there the same day, and the entry says where.

Format: date, feature, what happened (as a role, no blame), root cause, what changed, sibling apps affected, applied where and when.

## Entries

### <date> · <feature>

- **What happened:**
- **Root cause:**
- **What changed here:**
- **Affects siblings:** none | <app>: applied <date> in <path>
- **Candidate for the skill:** yes | no (why)

### 02/11/2026 · K3 core flows (wireframes)

- **What happened:** in the Arabic wireframe, list-row chevrons drawn with the text glyphs U+2039 and U+203A pointed backwards inside flex rows while pointing correctly in the breadcrumb.
- **Root cause:** both glyphs are bidi-mirrored characters, so their rendered direction depends on the embedding level of the box they land in; a per-direction swap of the two glyphs mirrors twice in some boxes.
- **What changed here:** the wireframes draw the chevron with CSS borders and rotate it by `dir`; the K4 directions and the build use a Font Awesome chevron flipped by direction (a directional icon flips, per the copy reference), never a mirrored text glyph.
- **Affects siblings:** none checked (outside this task's scope).
- **Candidate for the skill:** yes (`references/copy.md`, RTL and bidi: name the bidi-mirrored glyph trap next to the icon-mirroring rule).

### 02/11/2026 · K3 Stop 1 (approver rulings)

- **What happened:** at K1 the approver ruled that strings from `sources.json` and `meta.json` are shown verbatim (entry 8). At K3 the designer found that four of them are English words and that the source names are English sentences, which would put English text in the Arabic build. The ruling had to be narrowed (entry 16).
- **Root cause:** the K1 ruling was made from the field names and two sample values, not from the full set of values it covered.
- **What changed here:** entry 16 limits "verbatim" to version numbers; word forms and source names go through `WORDING.md`. The approver now reads every distinct value a "show as stored" ruling covers before making it.
- **Affects siblings:** none checked (outside this task's scope).
- **Candidate for the skill:** yes (`references/process.md` 4.3: before a Delegated ruling says "show as stored", list the distinct values it covers and check each against the language rules).

### 02/11/2026 · K4 directions (route build)

- **What happened:** (1) base resets scoped as `#site a{color:inherit}` and `#site :where(h1,…){margin:0}` silently beat every direction's class rules (ID specificity): primary-button text went pale in dark mode and heading spacing collapsed. (2) A logical margin or padding on an element set to `direction:ltr` (dial codes, figures) resolves against that element's own direction, so `margin-inline-start:auto` pushed the wrong way on Arabic pages. (3) Flex containers (`summary`, link buttons, tiles) split a translated string with isolated `<bdi>` runs into separate flex items, opening gaps mid-sentence.
- **Root cause:** (1) resets written with an ID selector; (2) logical properties follow the element's own `direction`, not the page's; (3) bidi isolation creates element children inside flex boxes.
- **What changed here:** resets moved under `:where(#site)`; LTR runs are wrapped in a `<bdi dir="ltr">` inside a wrapper that keeps the page direction, and the wrapper carries the logical spacing; the string helper returns one `<span>` per string.
- **Affects siblings:** none checked (outside this task's scope).
- **Candidate for the skill:** yes (`references/copy.md` RTL and bidi: LTR islands never carry logical spacing themselves; one wrapper per translated string inside flex).

### 02/11/2026 · K3 Stop 1 checks (absence scan)

- **What happened:** the entry 14 patterns, applied literally, fail on legitimate content: `IL` matches the ISO 3166-2 codes `US-IL` (Illinois) and `RO-IL` (Ialomița) in the data; `376` matches Andorra's dial code `+376` and coordinates inside Font Awesome SVG path data.
- **Root cause:** token patterns written without the context that makes a value an ISO code.
- **What changed here:** the designer's checks treat hyphen-joined codes as not standalone and skip `+376` and SVG path geometry; the definition is raised to the approver.
- **Affects siblings:** none checked.
- **Candidate for the skill:** yes (absence scans match values in their field context, not bare tokens).
### 10/11/2026 · 1.2.0 country page additions (Stop 2)

- **What happened:** the reviewer's first pass saw no styles (the local server served the site at the root while pages link `/worldref/...`), and five passes could not see 390 px because the browser window will not narrow below desktop width. Two real 390 px defects (offsets split after "UTC-", codes split after "MA-") were only caught once the reviewer saw true phone width.
- **Root cause:** review evidence that is not the shipped rendering: wrong base path, and phone width judged from CSS instead of seen.
- **What changed here:** review servers mirror the Pages base path (`/worldref/`); phone width is reviewed through a page of 390 px iframes, each its own viewport; tokens that must not break (UTC offsets, codes, bracketed qualifiers) carry `.nw`; every data-driven sentence shown on an Arabic page needs an Arabic source (`why_ar` or a WORDING key), and the build fails without one.
- **Affects siblings:** any BIXET site reviewed by an agent in this browser.
- **Candidate for the skill:** yes (`references/process.md`, evidence board: serve under the real base path; capture phone width through iframes when the browser cannot narrow).


## Rejected, do not reopen

Decisions tried and rejected in this project, so a later session does not propose them again.

| Date | Proposal | Why rejected |
| --- | --- | --- |
| 02/11/2026 | Arabic-Indic or Persian digits on the site as example inputs (chips, proof rows, sample states), with an `example_inputs` allowlist in `design-lint.json` | The owner's hard rule 1 bans Eastern Arabic digits in any UI, even in fully Arabic text; the hint copy and the automated digit-vector run prove the feature instead (entry 15) |
| 02/11/2026 | English override reasons with `lang="en"` on Arabic country pages | Puts English text in the Arabic build (brief item 15); Arabic reasons are site copy instead (entry 17) |

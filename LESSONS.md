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

## Rejected, do not reopen

Decisions tried and rejected in this project, so a later session does not propose them again.

| Date | Proposal | Why rejected |
| --- | --- | --- |
| 02/11/2026 | Arabic-Indic or Persian digits on the site as example inputs (chips, proof rows, sample states), with an `example_inputs` allowlist in `design-lint.json` | The owner's hard rule 1 bans Eastern Arabic digits in any UI, even in fully Arabic text; the hint copy and the automated digit-vector run prove the feature instead (entry 15) |
| 02/11/2026 | English override reasons with `lang="en"` on Arabic country pages | Puts English text in the Arabic build (brief item 15); Arabic reasons are site copy instead (entry 17) |

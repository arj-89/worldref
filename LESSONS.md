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

## Rejected, do not reopen

Decisions tried and rejected in this project, so a later session does not propose them again.

| Date | Proposal | Why rejected |
| --- | --- | --- |
| | | |

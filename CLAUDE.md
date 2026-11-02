# worldref

Read `AGENTS.md` for the data pipeline and policy. Generated files (`data/`, `schema/`, `flags/`, package data copies) are never edited by hand.

## Design standard (website)
- Load the `product-design` skill for any UX, UI, screen, flow, layout, copy-in-UI or visual work. It holds the gates.
- Read `DESIGN.md` before any design or frontend task; every visual value comes from its tokens.
- Approval mode: Delegated. Hard stops (money, making a repo public, deleting data, irreversible migrations, secrets) always go to the owner.
- Never skip the stops: Stop 1 (flow spec plus wireframe, `/flow`) before building; Stop 2 (evidence board, `/design-review`) before shipping. Trivial changes skip Stop 1 only.
- The builder never grades its own work; the design-reviewer judges the evidence board. Any FAIL blocks.
- Run the product-design lint pack (`--platform web --path .`) before capturing evidence; allowlists live in `design-lint.json`.
- Strings come from the feature's `WORDING.md`; Western numerals; the riyal is U+20C1.
- Write every lesson to `LESSONS.md` the day it is learned.
- Name the model in every report. No downgrade without the owner's yes.

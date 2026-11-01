# Contributing

Thank you for helping keep worldref correct.

## Reporting a data error

Open an issue with the **Data correction** template. Every correction needs a link to a source:
an official government site, an international body (UN, ITU, ISO, World Bank) or the upstream source
named for that column in `data/sources.json`. Corrections without a source are closed.

## Changing code

1. `npm install`, then `npm run build` and `npm test`.
2. Behaviour shared by the language packages is pinned by `tests/vectors.json`. A change there must
   come with the same change in every package; CI runs all eight suites.
3. Never edit generated files (`data/`, `schema/`, `flags/`, the data copies inside language packages).

## Policy

The data policy in the README (including the exclusion of one state and the handling of disputed
places) is fixed. Issues or pull requests asking to change it are closed without discussion.

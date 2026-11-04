# AGENTS.md

Guide for AI coding agents using or changing worldref.

## Using worldref in a project

- Pick the build that matches the app: bilingual (`*.json`), Arabic-only (`*.ar.json`) or English-only (`*.en.json`).
- Load only the modules you need (`data/modules/{core,nationality,phone,currency,geo,locale,address,travel,sports}.json`); they join on `iso2`.
- Every language package exposes the same helpers: `normalize`, `westernDigits`, `search`, `sortCountries`, `parsePhone`, `isValidMobile`, `formatNational` (named idiomatically per language). Use them instead of writing your own search or phone parsing.
- Country picker: `sortCountries(countries, uiLang, userIso2)`, show flag, name in the UI language, then the dial code isolated left-to-right in Arabic (`<bdi dir="ltr">`).
- Phone field: `parsePhone(input, pickedCountry, allCountries)`; store `e164` and `iso2` together.
- Nationality field: list only rows where `nationality.nationality_en` is not null.
- `null` means unknown. Never fill it from your own knowledge.
- The full rule list (search folding, sorting, display, phone storage, nationality forms) is the README section [Best practices](README.md#best-practices).

## Changing worldref

- The data in `data/`, `schema/`, `flags/` and the language data copies are generated. Never edit them by hand.
- Pipeline: `npm run fetch` (refreshes `upstream/snapshot/` from upstream) then `npm run build` (generates everything offline from the snapshot) then `npm test`.
- Hand decisions live only in `scripts/editorial.mjs`, each with a reason that the build copies into `data/sources.json`.
- Policy (must never change): Israel is absent from every output (`tests/js.test.mjs` scans all files); Palestine carries +970 and +972; disputed places follow Saudi official positions. See README "Data policy".
- Shared behaviour is defined by `src/text.ts` and `src/helpers.ts` and pinned by `tests/vectors.json`. Changing behaviour means changing the vectors and every language package together; CI runs all eight suites.

## Layout

| Path | What |
|---|---|
| `scripts/` | fetch, build, docs, sync, release |
| `upstream/snapshot/` | pinned upstream inputs (reviewable diffs) |
| `data/` | generated outputs (JSON, CSV, SQL, static API) |
| `src/`, `dist/` | TypeScript reference implementation and its build |
| `python/`, `Sources/WorldRef/` (Swift), `kotlin/`, `dart/`, `php/`, `go/`, `csharp/` | language packages |
| `mcp/` | CLI and MCP server |
| `site/` | GitHub Pages site generator |
| `tests/` | shared vectors, JS tests, MCP server tests, reproducibility gate |

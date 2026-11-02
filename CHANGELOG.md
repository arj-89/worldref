# Changelog

All notable changes. Versions follow semantic versioning: a removed row or field is major, a new field
or a name change is minor, a data fix or upstream refresh is a patch.

## 1.0.0 (2026-11-01)

First release.

- 242 countries and territories, 5012 ISO 3166-2 subdivisions, in Arabic and English.
- Modules: core, nationality, phone, currency, geo, locale, address, travel, sports, subdivisions.
- Three builds of every file: bilingual, Arabic-only, English-only. JSON, CSV, SQL (Postgres, MySQL, SQLite), static per-country API.
- Packages for TypeScript, Python, Swift, Kotlin, Dart, PHP, Go and C#, with shared search, sorting and phone helpers held identical by one set of test cases.
- MCP server for AI agents.
- Sources: Unicode CLDR 49, libphonenumber v9.0.42, World Bank, Wikidata, CIA World Factbook (final edition), IANA tzdata 2026f, Google address metadata, official sources for emergency numbers.

## Unreleased

- Fixed: English names used CLDR's abbreviated forms for some rows ("US", "UK", "Bosnia"). Names now use the standard CLDR name, falling back to the short or variant form only when the standard one carries a qualifier ("Hong Kong SAR China" becomes "Hong Kong", "Cocos (Keeling) Islands" becomes "Cocos Islands").
- Fixed: Macao's Arabic name is now the short form «مكاو».
- Fixed: purely numeric aliases removed (Guadeloupe carried "971", which outranked the UAE in a "+971" search). Dial codes are matched through `phone` instead.
- Fixed: the README showed most of its sections twice.
- Docs: the Arabic README now uses the JitPack tag v1.0.0 and states that policy-change requests are closed.
- Docs: a "Best practices" section in both READMEs (search folding, sorting, display, phone storage, nationality forms, data handling), linked from llms.txt and AGENTS.md.

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

## 1.1.1 (2026-11-04)

- Published to the package registries: npm (`npm i worldref`), PyPI (`pip install worldref`), pub.dev (`dart pub add worldref`), Packagist (`composer require arj-89/worldref`), NuGet (`dotnet add package WorldRef`) and the MCP Registry (`io.github.arj-89/worldref`). READMEs and the website use these commands; Swift, Kotlin (JitPack) and Go still install from the repository.
- Website: a real world map on the countries page (Natural Earth, Saudi Arabia point of view) with zoom, Jordan as the featured example, language and theme in the header, a live search demo in the hero, flag emoji on country pages, back to top.
- Packaging: `bin` path without `./`.

## 1.1.0 (2026-11-02)

- New: the website at https://arj-89.github.io/worldref in Arabic and English: live search on the real data, install for every platform, a file builder, a page for each of the 242 countries with a phone checker, and an agents page. The static API, schemas and data files stay at their paths.

- Fixed: English names used CLDR's abbreviated forms for some rows ("US", "UK", "Bosnia"). Names now use the standard CLDR name, falling back to the short or variant form only when the standard one carries a qualifier ("Hong Kong SAR China" becomes "Hong Kong", "Cocos (Keeling) Islands" becomes "Cocos Islands").
- Fixed: Macao's Arabic name is now the short form «مكاو».
- Fixed: purely numeric aliases removed (Guadeloupe carried "971", which outranked the UAE in a "+971" search). Dial codes are matched through `phone` instead.
- Fixed: the README showed most of its sections twice.
- Docs: the Arabic README now uses the JitPack tag v1.0.0 and states that policy-change requests are closed.
- Docs: a "Best practices" section in both READMEs (search folding, sorting, display, phone storage, nationality forms, data handling), linked from llms.txt and AGENTS.md.

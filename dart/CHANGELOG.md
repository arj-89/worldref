# Changelog

All notable changes. Versions follow semantic versioning: a removed row or field is major, a new field
or a name change is minor, a data fix or upstream refresh is a patch.

## 1.2.1 (2026-11-10)

- Fixed: Côte d'Ivoire's English official name was cut off ("Republic of C&ocirc"); the Factbook's HTML entities are now decoded before parsing.
- Fixed: Türkiye's English official name is "Republic of Türkiye" (registered at the UN in 2022).
- Fixed: stray superscript markers removed from subdivision names (Estonia's "Viljandi³").
- Docs: Kotlin installs from Maven Central (`io.github.arj-89:worldref`); JitPack still works. The install check verifies Maven Central on every release.
- Website: brand marks on the install page; this release notes page, in Arabic and English, linked from every footer; full-width titles, leads and fields; a one-line description of each module on the file builder; layout and wrapping fixes at phone width.

## 1.2.0 (2026-11-10)

New, non-breaking. Every field that 1.1.x had is unchanged; a test now fails the build if a shipped field ever disappears.

- New: `geo.timezone_offsets`, each zone's standard UTC offset and its daylight-saving offset (null when it does not switch), from IANA tzdata 2026f compiled with zic, under the rules in force on the date in `data/meta.json`. For describing zones; compute times with the platform's time-zone support. Morocco's permanent move to UTC+00:00 (20/09/2026) and Alberta's to UTC-06:00 are included.
- New: subdivision types, `type_en` and `type_ar`, for 4,869 of 5,012 subdivisions (the rest are null). English from Wikidata classes; Arabic from each Arab country's own official term (Saudi منطقة, Egypt محافظة, UAE إمارة, Morocco جهة, عمالة, إقليم, Algeria and Tunisia ولاية, Libya شعبية…) and otherwise a fixed glossary.
- New: address-form data, `locality_label_*`, `sublocality_label_*`, `postal_code_label_*` (English from Google's libaddressinput, Arabic from the worldref glossary) and `required_fields`, plus an `addressForm(country, lang)` helper in all eight packages that gives the fields line by line in the country's order, with labels and required marks.
- New: search forgives typing. Names match with spaces and punctuation removed ("cote divoire"), and, only when nothing else matches, within 1 edit for 4 to 7 letters or 2 from 8 ("Kuwiat", «الكويب»). Exact results are unchanged. A public `editDistance` helper comes with it.
- Fixed: Morocco's row now lists Western Sahara's zone (`Africa/El_Aaiun`), following the data policy.
- Fixed: Morocco's 12 regions carried the pre-2015 names (from CLDR) under the codes ISO reassigned, so Casablanca sat under «مكناس تافيلالت». They now carry the 2015 names in both languages («الدار البيضاء سطات», Casablanca-Settat…).
- Fixed: subdivision names: Amanat Al Asimah («أمانة العاصمة», not a second «صنعاء»), Kurdistan Region («إقليم كردستان»), Belfast, Islamabad, Gilan («جيلان»), Dubai's hamza («إمارة دبي»), Bahrain's Southern and Northern governorates, City of London; CLDR's draft marker «²» removed from 18 names; Persian letters in 9 Arabic names written as Arabic letters.
- Fixed: postal-code patterns for Kazakhstan and Nigeria follow Google's current data (valid new codes were rejected).
- Changed: Arabic region labels use the country's own term where it differs from the glossary (Turkey ولاية, Iran محافظة, Iraq محافظة).
- Changed: where Google gives no region type, the address region label uses the country's own subdivision type (Egypt: governorate, محافظة, instead of province; also Chile, Estonia, Iraq, Lithuania, Peru, Romania, Somalia, Suriname, El Salvador, Uruguay). The Philippines keeps "province", the level its addresses use.
- Fixed: the Python package's `__version__` reported 1.0.0 since the first release. Releases now set it, and a test checks that every package manifest carries the same version.
- Releases: automatic data releases list what changed (sources, fields, the rows affected) in this changelog and in their release notes.
- Compatibility: typed packages add new fields last, with defaults. C# keeps the 1.1.x constructors and deconstructors, so compiled code keeps working; Kotlin adds `@JvmOverloads`, but the compiled `copy()` of `Geo`, `Address` and `Subdivision` changes, so already-compiled Java or Kotlin code that calls `copy()` on them needs a rebuild (source code is unaffected).
- Website: country pages show each zone's UTC offsets and each subdivision's type, and every editorial decision gives its reason in Arabic as well as English (`why_ar` in `data/sources.json`).
- New: Kotlin on Maven Central (`io.github.arj-89:worldref`), signed in the release job and published from this version on. JitPack still works.

## 1.1.3 (2026-11-09)

- Docs: a "Time zones" section in Best practices, in both READMEs and `llms.txt`: store UTC plus the IANA zone, convert only for display with the platform's time-zone support, never store a fixed UTC offset, and take the zone from the user or device when a country spans several.

## 1.1.2 (2026-11-04)

- Fixed: the JavaScript package needs Node 20.10 or newer (its JSON import syntax does not run on earlier Node 18 releases). `engines` now says so, and CI tests that version.
- MCP server: missing, unknown or wrongly typed arguments now return a clear tool error (`isError`) instead of an empty lookup; malformed requests get JSON-RPC error -32600. A new test suite covers bad input, notifications and long sessions.
- CI installs with `npm ci`, so an outdated lockfile fails the build.

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

## 1.0.0 (2026-11-01)

First release.

- 242 countries and territories, 5,012 ISO 3166-2 subdivisions, in Arabic and English.
- Modules: core, nationality, phone, currency, geo, locale, address, travel, sports, subdivisions.
- Three builds of every file: bilingual, Arabic-only, English-only. JSON, CSV, SQL (Postgres, MySQL, SQLite), static per-country API.
- Packages for TypeScript, Python, Swift, Kotlin, Dart, PHP, Go and C#, with shared search, sorting and phone helpers held identical by one set of test cases.
- MCP server for AI agents.
- Sources: Unicode CLDR 49, libphonenumber v9.0.42, World Bank, Wikidata, CIA World Factbook (final edition), IANA tzdata 2026f, Google address metadata, official sources for emergency numbers.

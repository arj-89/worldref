# worldref

**Every country in Arabic, English, or both:** names, nationalities, capitals, currencies, languages, time zones, dial codes, phone validation, address formats and subdivisions. One dataset, ready for JSON, CSV, SQL, TypeScript, Python, Swift, Kotlin, Dart, PHP, Go and C#, and for AI agents (MCP).

[العربية](README.ar.md) · [Website and search demo](https://arj-89.github.io/worldref) · [Best practices](#best-practices) · [Field reference](#fields) · [Data sources](#sources-and-licences)

[![CI](https://github.com/arj-89/worldref/actions/workflows/ci.yml/badge.svg)](https://github.com/arj-89/worldref/actions/workflows/ci.yml)
[![npm](https://img.shields.io/npm/v/worldref?label=npm)](https://www.npmjs.com/package/worldref) [![PyPI](https://img.shields.io/pypi/v/worldref?label=PyPI)](https://pypi.org/project/worldref/) [![pub.dev](https://img.shields.io/pub/v/worldref?label=pub.dev)](https://pub.dev/packages/worldref) [![NuGet](https://img.shields.io/nuget/v/WorldRef?label=NuGet)](https://www.nuget.org/packages/WorldRef/) [![Packagist](https://img.shields.io/packagist/v/arj-89/worldref?label=Packagist)](https://packagist.org/packages/arj-89/worldref) [![MCP Registry](https://img.shields.io/badge/MCP%20Registry-io.github.arj--89%2Fworldref-blue)](https://registry.modelcontextprotocol.io/?q=worldref)
![countries](https://img.shields.io/badge/countries-242-blue) ![subdivisions](https://img.shields.io/badge/subdivisions-5012-blue) ![languages](https://img.shields.io/badge/names-Arabic%20%7C%20English-green)

```js
import { countries, search, parsePhone, byIso2 } from "worldref";

byIso2("SA").name_ar;                       // "السعودية"
byIso2("SA").nationality.nationality_ar_f;  // "سعودية"
search(countries, "الامارات", "ar")[0].iso2; // "AE"  (ignores «ال», hamza and tashkeel)
parsePhone("٠٥٠١٢٣٤٥٦٧", byIso2("SA"));     // { e164: "+966501234567", valid: true, mobile: true, ... }
```

## Why worldref

- **Arabic done natively.** Short common names (السعودية, not a transliteration), nationality in masculine and feminine (سعودي / سعودية), search that ignores «ال», tashkeel, tatweel and hamza forms, Arabic-Indic and Persian digits accepted everywhere, and sort keys that give correct Arabic alphabetical order on every platform.
- **Works for one language or two.** Every file comes in three builds: bilingual (`name_ar`, `name_en`), Arabic-only (`name`) and English-only (`name`).
- **Phone fields that work.** Dial codes, valid lengths, mobile prefixes and exact validation patterns for every country, shared calling codes resolved (+1, +7, +44...), and international (E.164) output.
- **Everything a form or app needs in one place:** official names, capitals, currencies with symbols (including the new Saudi riyal sign), official languages, week start and weekend, preferred calendars (including Umm al-Qura), postal code rules, address templates, emergency numbers, plug types and voltage, FIFA and IOC codes, and ISO 3166-2 subdivisions.
- **Sourced, not guessed.** Official sources first (Unicode CLDR, Google libphonenumber, World Bank, IANA, ITU and government sources). Every column names its source in [`data/sources.json`](data/sources.json). A missing value is `null`, never a guess or a machine translation.

## Install

Published on npm, PyPI, pub.dev, Packagist, NuGet and the MCP Registry. Swift, Kotlin and Go install straight from this repository.

| Stack | Install |
|---|---|
| JavaScript, TypeScript (web, Node 20.10+, React Native, Bun, Deno) | `npm i worldref` |
| CDN (no build step) | `https://cdn.jsdelivr.net/npm/worldref@1.1.3/data/worldref.json` |
| Swift (iOS, macOS) | Swift Package Manager: `https://github.com/arj-89/worldref`, from `1.1.3`, product `WorldRef` |
| Kotlin, Android | JitPack: `maven("https://jitpack.io")`, then `implementation("com.github.arj-89:worldref:v1.1.3")` |
| Python | `pip install worldref` |
| Dart, Flutter | `dart pub add worldref` (Flutter: `flutter pub add worldref`) |
| PHP, Laravel | `composer require arj-89/worldref` |
| Go | `go get github.com/arj-89/worldref/go@v1.1.3` |
| C#, .NET | `dotnet add package WorldRef` |
| Any language | JSON, CSV and SQL (Postgres, MySQL, SQLite) in [`data/`](data) and on the [releases page](https://github.com/arj-89/worldref/releases) |
| AI agents | MCP server: `npx -y worldref mcp` (listed in the MCP Registry as `io.github.arj-89/worldref`) |
| No install | One country: `https://arj-89.github.io/worldref/api/v1/sa.json` |

Each language folder has its own README with a usage example: [python](python/README.md), [Swift](Sources/WorldRef/README.md), [kotlin](kotlin/README.md), [dart](dart/README.md), [php](php/README.md), [go](go/README.md), [csharp](csharp/README.md).

## Use only what you need

- The data is split into **modules** that share the key `iso2`: `core`, `nationality`, `phone`, `currency`, `geo`, `locale`, `address`, `travel`, `sports`, plus `subdivisions`. Find them in [`data/modules/`](data/modules).
- Each module comes in 3 builds: `.json` (Arabic and English), `.ar.json` (Arabic only), `.en.json` (English only).
- **JS/TS:** import only the module you use, and your bundler ships only that file:
  ```js
  import phone from "worldref/data/modules/phone.json" with { type: "json" };
  import { parsePhone } from "worldref/helpers";
  ```
- **Other languages:** load only the module files you need. [`data/worldref.json`](data/worldref.json) has everything.
- **One country, no install:** `https://arj-89.github.io/worldref/api/v1/{iso2}.json`.
- A missing value is `null` (or an empty list). Treat it as unknown; never fill it in.
- Within a major version, fields are never renamed or removed.

## Recipes

**Country picker** (user's country first, then alphabetical in the UI language):
```js
import { countries, sortCountries, search } from "worldref";
const list = sortCountries(countries, "ar", "SA");          // السعودية first, then Arabic order
const hits = search(countries, userQuery, "ar");            // names, aliases, ISO codes, +966 / 00966 / 966, small typos
```
Show: flag, name in the UI language, then the dial code. In Arabic, isolate the dial code left-to-right (`<bdi dir="ltr">+966</bdi>`).

**Phone field** (store the international form plus the country the user picked):
```js
const p = parsePhone(input, byIso2(pickedIso2), countries);
if (p?.valid && p.mobile) save({ phone: p.e164, phone_country: p.iso2 });
```

**Nationality field** (only rows that have one: countries, plus Taiwan, Hong Kong and Macau):
```js
const options = countries.filter((c) => c.nationality.nationality_en);
const label = (c, female) => (female ? c.nationality.nationality_ar_f : c.nationality.nationality_ar_m);
```

**Address form** (the country's own fields, order, labels and required marks):
```js
import { byIso2, addressForm } from "worldref";
for (const line of addressForm(byIso2("SA"), "ar"))         // one row of inputs per line
  for (const f of line) renderInput(f.field, f.label, f.required);   // street: «العنوان», city: «المدينة»...
```

**Database seed:** run [`data/sql/postgres.sql`](data/sql/postgres.sql) (or `mysql.sql`, `sqlite.sql`). It creates `countries` and `subdivisions`.

## Best practices

Every rule below is built into the helpers of all eight packages and locked by the shared tests in [`tests/vectors.json`](tests/vectors.json). Use the helpers; if you write your own, follow these rules exactly.

**Search** (`normalize()`, `search()`)
- Normalise both sides, the query and the names, the same way.
- Arabic: drop «ال» at the start of every word (not only the first); remove tashkeel (fatha, damma, kasra, sukun, shadda, tanween) and tatweel (ـ); treat أ إ آ ٱ as ا, ة as ه, ى as ي, ؤ as و, ئ as ي. So «الإمارات», «امارات» and «الأمارات» all find the UAE.
- Latin: ignore case and accents, and treat punctuation as a space, so «cote d'ivoire» finds Côte d’Ivoire. Also compare with the spaces removed, so «cote divoire» finds it too.
- Typos: only when nothing matches, accept a name within 1 edit for queries of 4 to 7 letters and 2 edits from 8 letters (a swap of two neighbours counts as one), so «Kuwiat» finds Kuwait. Never add typo matches to a result list that already has hits.
- Digits: convert Arabic-Indic (٠١٢٣٤٥٦٧٨٩) and Persian (۰۱۲۳۴۵۶۷۸۹) digits to Western before anything else.
- Match names and aliases in both languages, ISO codes (SA, SAU), and dial codes with or without «+» or «00» (+966, 00966, 966).

**Sorting** (`sortCountries()`)
- Put the user's country first: from their profile, else the device region, else pin nothing.
- Then sort by `sort_ar` or `sort_en` with plain string comparison. Do not use locale collation (`Intl.Collator("ar")`, `localizedStandardCompare`): neither ignores «ال», so every «ال» name bunches under ا.

**Display**
- Show the flag, then the name in the UI language, then the dial code.
- In Arabic, isolate the dial code and any Latin text left-to-right in the UI (`<bdi dir="ltr">+966</bdi>`, or U+2066 ... U+2069). The data never contains bidi marks.
- Show Western numerals (0-9) in the UI, in both languages.
- Use `flag_svg` on the web: Windows does not draw flag emoji.
- Currency: show `symbol` (the Saudi riyal sign is U+20C1) and fall back to `symbol_fallback` (ر.س) where the font lacks the new sign.

**Phone fields** (`parsePhone()`, `formatNational()`)
- Accept whatever the user types: Arabic or Western digits, spaces, dashes, a leading 0, «+» or «00».
- Store the international form (`e164`) together with the `iso2` the user picked. Shared calling codes (+1, +7, +44, +599...) cannot be read back to one country from the number alone.
- Validate a mobile with `mobile_pattern`. Where `mobile_distinguishable` is false (US, Canada), do not reject a number for not looking like a mobile.
- Format for display with `formatNational()` (5X XXX XXXX style).

**Nationality fields**
- List only rows where `nationality.nationality_en` is not null (countries, plus Taiwan, Hong Kong and Macau).
- In Arabic, use the form that matches the person: `nationality_ar_m` (سعودي) or `nationality_ar_f` (سعودية).

**Time zones** (guidance; the packages have no time helper)
- Store times in UTC, plus the IANA zone name (`geo.timezones`, e.g. `Asia/Riyadh`) wherever local time matters.
- Convert to local time only for display, with the platform's time-zone support (`Intl.DateTimeFormat` with `timeZone`, Python `zoneinfo`, `java.time.ZoneId`, Swift `TimeZone`). It follows daylight saving time and rule changes.
- Never store or hard-code a UTC offset (+03:00): daylight saving time shifts it twice a year in many countries, and governments change the rules (Morocco moved to permanent UTC+00:00 in 09/2026).
- `geo.timezone_offsets` gives each zone's standard and daylight-saving offset under the rules in force on the date in [`data/meta.json`](data/meta.json). Use it to describe a zone ("UTC+03:00"), not to compute times: `standard` is not always the offset in use today (Cuba keeps daylight saving time through 2027), and in Ireland `dst` is lower than `standard` because its law defines winter time as the shift.
- A country can span several zones (`geo.timezones` lists them all; the US has many). Take the zone from the user or the device, not from the country alone.

**Data**
- `null` (or an empty list) means unknown. Show it as unknown; never fill it from elsewhere.
- Load only the modules you need; they join on `iso2`.
- Pin a version (`#v1.1.3`, `@1.1.3`) so names and rules do not change under you.

## Data policy

- **Israel is not in this dataset**, in any file, under any name or code. A test enforces this on every output.
- **Palestine** is «فلسطين» / "Palestine", a country, with its capital «القدس» / "Jerusalem". Numbers with **+970 and +972** (including Jerusalem and the 1948 lines) are Palestinian numbers here. Its currencies are the Jordanian dinar and the shekel (shown as «شيكل» / "Shekel").
- **Disputed places follow the official positions of Saudi Arabia:** Western Sahara is part of Morocco (no separate row), Kosovo is included, Northern Cyprus is not, and Taiwan, Hong Kong and Macau are territories that still have a nationality (they issue their own passports).
- Requests to change this policy are closed without discussion. Corrections to data are welcome with a source link (see [CONTRIBUTING](CONTRIBUTING.md)).

## Fields

<!-- fields:start -->
Single-language builds drop the `_ar` / `_en` suffix (`name_ar` becomes `name` in `.ar.json`).

| Field | Module | Example (SA) | Meaning |
|---|---|---|---|
| `iso2` | all | `SA` | ISO 3166-1 alpha-2 code (XK for Kosovo). The key that joins every module. |
| `iso3` | core | `SAU` | ISO 3166-1 alpha-3 code (XKK for Kosovo, as in CLDR). |
| `iso_numeric` | core | `682` | ISO 3166-1 numeric code, as text to keep leading zeros. |
| `kind` | core | `country` | country (sovereign state, including Palestine, Vatican and Kosovo) or territory. |
| `name_ar` | core | `السعودية` | Short common name in Arabic. |
| `name_en` | core | `Saudi Arabia` | Short common name in English. |
| `official_name_ar` | core | `المملكة العربية السعودية` | Official long name in Arabic, when a source states one. |
| `official_name_en` | core | `Kingdom of Saudi Arabia` | Official long name in English, when a source states one. |
| `aliases_ar` | core | `["المملكة العربية السعودية","المملكة"...` | Other Arabic names people search with. For search only, not display. |
| `aliases_en` | core | `["KSA","Kingdom of Saudi Arabia","Sau...` | Other English names people search with. For search only, not display. |
| `flag` | core | `🇸🇦` | Flag emoji (regional indicator pair). Windows does not draw these; use flag_svg on the web. |
| `flag_svg` | core | `flags/sa.svg` | Path of the 4:3 SVG flag in this package. |
| `continent` | core | `asia` | africa, americas, asia, europe or oceania (UN M49 via CLDR). |
| `groups` | core | `["gcc","arab_league"]` | Memberships: gcc, arab_league. |
| `un_member` | core | `true` | true for the 193 UN member states. |
| `tld` | core | `.sa` | Country-code top-level domain, when one is delegated. |
| `sort_ar` | core | `سعوديه` | Arabic sort key: compare these with plain string comparison for correct Arabic order (ignores «ال», hamza forms, tashkeel). |
| `sort_en` | core | `saudi arabia` | English sort key: compare with plain string comparison. |
| `nationality` | nationality |  | Nationality names. Filled for countries and for TW, HK, MO; null for other territories. |
| `nationality.nationality_ar_m` | nationality | `سعودي` | Arabic nationality, masculine (سعودي). |
| `nationality.nationality_ar_f` | nationality | `سعودية` | Arabic nationality, feminine (سعودية). |
| `nationality.nationality_en` | nationality | `Saudi` | English nationality adjective (Saudi). |
| `nationality.icao_code` | nationality | `SAU` | ICAO Doc 9303 code used on passports (mostly iso3; D for Germany, RKS for Kosovo). |
| `phone` | phone | `[{"calling_code":"+966","leading_digi...` | Numbering plans for this row. Most rows have one; some have several (Palestine: +970 and +972). |
| `phone[].calling_code` | phone | `+966` | International calling code with +. |
| `phone[].leading_digits` | phone | `null` | Regex the national number must start with when the calling code is shared (e.g. +1 809\|829\|849 for DO). null when the code is not shared this way. |
| `phone[].primary` | phone | `true` | true when this row is the default country for the calling code. |
| `phone[].trunk_prefix` | phone | `0` | Digit(s) dropped from local numbers before the calling code (0 in 0501234567). |
| `phone[].pattern` | phone | `(?:[15]\d\|800\|92)\d{7}` | Regex for any valid national number (all types). Match against the full national number. |
| `phone[].lengths` | phone | `[9,10]` | Valid national number lengths, all types. |
| `phone[].mobile_pattern` | phone | `579[0-8]\d{5}\|5(?:[013-689]\d\|7[0-8])...` | Regex for a valid mobile national number. Match against the full national number. |
| `phone[].mobile_lengths` | phone | `[9]` | Valid mobile national number lengths. |
| `phone[].mobile_prefixes` | phone | `["50","51","53","54","55","56","57","...` | Leading digits of mobile numbers (up to 3 digits). Quick check; use mobile_pattern for exact validation. |
| `phone[].mobile_distinguishable` | phone | `true` | false when mobile and landline numbers look the same (US, CA). |
| `phone[].mobile_example` | phone | `512345678` | Example mobile national number, good as an input placeholder. |
| `phone[].mobile_format` | phone | `## ### ####` | Display grouping for a mobile national number, # = digit. |
| `currencies` | currency | `[{"code":"SAR","name_ar":"ريال سعودي"...` | Currencies in use. |
| `currencies[].code` | currency | `SAR` | ISO 4217 code. |
| `currencies[].name_ar` | currency | `ريال سعودي` | Currency name in Arabic. |
| `currencies[].name_en` | currency | `Saudi Riyal` | Currency name in English. |
| `currencies[].symbol` | currency | `⃁` | Symbol (the new Unicode sign where one exists, e.g. the riyal sign). |
| `currencies[].symbol_ar` | currency | `ر.س.` | Symbol as written in Arabic (ر.س). |
| `currencies[].symbol_fallback` | currency | `ر.س` | Text to show when the font lacks the new sign. |
| `geo` | geo |  | Geography. |
| `geo.capital_ar` | geo | `الرياض` | Capital in Arabic. |
| `geo.capital_en` | geo | `Riyadh` | Capital in English. |
| `geo.lat` | geo | `23.7167` | Latitude of the country's centre point. |
| `geo.lng` | geo | `44.1167` | Longitude of the country's centre point. |
| `geo.area_km2` | geo | `2149690` | Area in square kilometres. |
| `geo.population` | geo | `36973555` | Population. |
| `geo.population_year` | geo | `2025` | Year of the population figure. |
| `geo.timezones` | geo | `["Asia/Riyadh"]` | IANA time zone names. |
| `geo.timezone_offsets` | geo | `[{"zone":"Asia/Riyadh","standard":"+0...` | For each zone in `timezones`: the standard UTC offset and the daylight-saving offset (null when the zone does not switch), under the rules in force on the date in `data/meta.json`. Reference only: compute the current offset with the platform's time-zone support, never store it. |
| `geo.timezone_offsets[].zone` | geo | `Asia/Riyadh` | IANA time zone name. |
| `geo.timezone_offsets[].standard` | geo | `+03:00` | Standard UTC offset, e.g. +03:00. Not always the offset in use today (Cuba keeps daylight saving time through 2027). |
| `geo.timezone_offsets[].dst` | geo | `null` | Daylight-saving UTC offset, or null when the zone does not switch. Lower than `standard` where the law defines winter as the shift (Ireland). |
| `geo.driving_side` | geo | `right` | left or right. |
| `locale` | locale |  | Locale conventions. |
| `locale.languages` | locale | `[{"code":"ar","name_ar":"العربية","na...` | Official languages, most spoken first. |
| `locale.languages[].code` | locale | `ar` | BCP 47 language code. |
| `locale.languages[].name_ar` | locale | `العربية` | Language name in Arabic. |
| `locale.languages[].name_en` | locale | `Arabic` | Language name in English. |
| `locale.week_start` | locale | `sun` | First day of the week (sun, mon, sat...). |
| `locale.weekend` | locale | `["fri","sat"]` | Weekend days. |
| `locale.calendars` | locale | `["gregorian","islamic-umalqura","isla...` | Calendars in use, most preferred first (gregorian, islamic-umalqura...). |
| `locale.measurement` | locale | `metric` | metric, us or uk. |
| `address` | address |  | Postal address conventions. |
| `address.postal_code_format` | address | `#####` | Postal code shape: # = digit, @ = letter. |
| `address.postal_code_regex` | address | `^(?:\d{5})$` | Regex for a valid postal code. |
| `address.postal_code_example` | address | `11564` | Example postal code. |
| `address.address_format` | address | `%N%n%O%n%A%n%C %Z` | Address template: %N name, %O organisation, %A street, %D district, %C city, %S region, %Z postal code, %X sorting code, %n new line. |
| `address.region_label_ar` | address | `null` | What the top-level region is called, in Arabic. Where Google gives no type, the country's own subdivision type when all its top-level subdivisions share one. |
| `address.region_label_en` | address | `null` | What the top-level region is called (state, province, emirate...). Where Google gives no type, the country's own subdivision type when all its top-level subdivisions share one. |
| `address.locality_label_ar` | address | `المدينة` | Label of the city field in Arabic (المدينة...), or null when the address has no city line. |
| `address.locality_label_en` | address | `City` | Label of the city field (City, Post town, District, Suburb), or null when the address has no city line. |
| `address.sublocality_label_ar` | address | `null` | Label of the area-within-city field in Arabic (الحي...), or null when the address has none. |
| `address.sublocality_label_en` | address | `null` | Label of the area-within-city field (Neighborhood, District, Suburb...), or null when the address has none. |
| `address.postal_code_label_ar` | address | `الرمز البريدي` | Label of the postal code field in Arabic, or null when the address has no postal code. |
| `address.postal_code_label_en` | address | `Postal code` | Label of the postal code field (Postal code, ZIP code, PIN code, Eircode), or null when the address has none. |
| `address.required_fields` | address | `["street","city"]` | Address fields the postal service requires: name, organization, street, sublocality, city, region, postal_code, sorting_code. |
| `travel` | travel |  | Travel facts. |
| `travel.emergency` | travel |  | Emergency numbers confirmed from an official source. A null service means: call `general`. |
| `travel.emergency.police` | travel | `999` | Police. |
| `travel.emergency.ambulance` | travel | `997` | Ambulance. |
| `travel.emergency.fire` | travel | `998` | Fire and civil defence. |
| `travel.emergency.general` | travel | `911` | All-services number (112, 911, 999...). |
| `travel.plug_types` | travel | `["G"]` | IEC plug letters (A to N). |
| `travel.voltage` | travel | `[220,230]` | Residential mains voltages. |
| `travel.frequency_hz` | travel | `[60]` | Mains frequency in hertz. |
| `sports` | sports |  | Sports codes. |
| `sports.fifa` | sports | `KSA` | FIFA country code. |
| `sports.ioc` | sports | `KSA` | IOC country code. |
| `subdivisions.iso2` | subdivisions | `SA` | Country code. |
| `subdivisions.code` | subdivisions | `SA-01` | ISO 3166-2 code (SA-01). |
| `subdivisions.name_ar` | subdivisions | `منطقة الرياض` | Name in Arabic. |
| `subdivisions.name_en` | subdivisions | `Riyadh` | Name in English. |
| `subdivisions.parent` | subdivisions | `null` | ISO 3166-2 code of the parent subdivision, for nested ones. |
| `subdivisions.type_ar` | subdivisions | `منطقة` | What the subdivision is, in Arabic (منطقة، محافظة، إمارة، ولاية...). Arab countries use their own official term. |
| `subdivisions.type_en` | subdivisions | `region` | What the subdivision is (region, province, emirate, state...), from Wikidata. Null when no source names it. |
<!-- fields:end -->

## FAQ

**How do I get a list of countries in Arabic?**
Use `data/worldref.ar.json` (or `data/modules/core.ar.json` for names only). Each row has `name` in Arabic. For a ready-made picker order, sort by `sort` (it ignores «ال» and hamza forms).

**Where is a list of nationalities in Arabic, masculine and feminine?**
`data/modules/nationality.json`: `nationality_ar_m` (سعودي) and `nationality_ar_f` (سعودية), plus `nationality_en` (Saudi).

**How do I validate a Saudi mobile number?**
`parsePhone(input, byIso2("SA"))` and check `valid && mobile`. The rule is in `phone[0].mobile_pattern`: 9 digits starting with 50, 51, 53 to 59 after dropping the leading 0. Arabic digits are accepted.

**Why is `travel.emergency.police` null for some countries?**
Only numbers confirmed by an official source are published. If a service is null, call `general`.

**Can I use this commercially?**
Yes. Code is MIT; data licences (Unicode, Apache-2.0, CC-BY-4.0, CC0, public domain) all allow commercial use with attribution where required. See [LICENSE](LICENSE).

**How current is it?**
An automated job checks the upstream sources monthly (population quarterly) and releases a patch when they change and every test passes. Versions are in [`data/meta.json`](data/meta.json).

## For AI agents

Start at [`llms.txt`](llms.txt) and [`AGENTS.md`](AGENTS.md). Schemas are in [`schema/`](schema). The MCP server (`npx -y worldref mcp`) offers `get_country`, `search_countries`, `validate_phone` and `list_subdivisions`. Answer from the data only and treat `null` as unknown.

## Roadmap

Shipped in 1.2.0: time-zone offsets, subdivision types, forgiving search, the address-form helper, and a changelog that lists what each automatic data release changed.

Planned for 1.3.0 (new, non-breaking):

1. Official Arabic names: 222 rows are empty today, the largest gap in the data.
2. Cities: a new `cities` module with Arabic and English names, linked to each country and subdivision: capitals, subdivision capitals, and every city of 100,000 people or more.
3. Kotlin on Maven Central as `io.github.arj-89:worldref` (the build and the release job are ready; publishing starts once signing is set up). Until then, Kotlin installs through JitPack.

Planned for 1.4.0: a full human review of every Arabic name.

## Sources and licences

Code: MIT. Data: Unicode CLDR 49 (Unicode-3.0), Google libphonenumber v9.0.42 and address metadata (Apache-2.0, modified), World Bank (CC-BY-4.0), Wikidata (CC0), CIA World Factbook final edition and IANA (public domain), flag-icons (MIT), and official government sources for emergency numbers. Full texts: [LICENSES/](LICENSES). Per-column sources and every editorial decision: [`data/sources.json`](data/sources.json).

Cite as: see [CITATION.cff](CITATION.cff).

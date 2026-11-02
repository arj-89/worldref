# WORDING: country page and countries index (flow 4)

Keys for `/{lang}/countries/{iso2}/` (242 pages per language) and `/{lang}/countries/`. Shared keys (`chrome.*`, `switch.*`, `footer.*`, `action.*`, `state.*`, `search.*`, `module.*`) live in `docs/design/flows/onboarding/WORDING.md`. Both columns are written natively. Western numerals; Arabic punctuation; no em dashes. Text in backticks is a technical identifier in the code face, isolated LTR.

Values from the data (names, codes, numbers, IANA zones, regexes) are not copy and are shown as stored. Enum values (`asia`, `sun`, `right`) are shown through the labels below with the raw value in the code face beside them.

**Status:** Stop 1 approved with changes (`DELEGATED-DECISIONS.md` entry 24); changes applied 02/11/2026. **Model:** Opus 5.5 (claude-opus-5-5).

## Page frame

| key | Arabic | English | note |
| --- | --- | --- | --- |
| country.title | {name}: الاسم والجنسية ومفتاح الاتصال وغيرها | {name}: names, nationality, dial code and more | `<title>`; `Country` JSON-LD carries the name |
| country.json.title | بيانات {name} بصيغة JSON | {name} as JSON | label above the URL |
| country.json.open | افتح ملف JSON | Open the JSON | secondary link; the primary is `action.copy-url` |
| country.null | لا يذكره أي مصدر | No source states this | every `null` and empty list; the raw `null` is not shown |
| country.yes | نعم | Yes | |
| country.no | لا | No | |
| country.fn | المصدر {n} | Source {n} | accessible name of a footnote marker |

## Sections

| key | Arabic | English | note |
| --- | --- | --- | --- |
| country.sec.names | الأسماء والرموز | Names and codes | `core` |
| country.sec.nationality | الجنسية | Nationality | |
| country.sec.phone | الهاتف | Phone | one block per numbering plan |
| country.sec.currency | العملة | Currency | one block per currency |
| country.sec.geo | الجغرافيا | Geography | |
| country.sec.locale | اللغة والتقويم | Language and calendar | |
| country.sec.address | العنوان البريدي | Postal address | |
| country.sec.travel | الطوارئ والكهرباء | Emergency and power | |
| country.sec.sports | الرياضة | Sports | |
| country.sec.subdivisions | التقسيمات الإدارية ({n}) | Subdivisions ({n}) | |
| country.sec.sources | المصادر | Sources | footnote targets |
| country.sec.overrides | قرارات تحريرية في هذا الصف | Editorial decisions in this row | only when the row has overrides |

## Field labels

| key | Arabic | English | note |
| --- | --- | --- | --- |
| country.f.name | الاسم | Name | value in the page language, the other language in brackets |
| country.f.official | الاسم الرسمي | Official name | |
| country.f.aliases | أسماء يبحث بها الناس | Names people search with | for search only, says the README |
| country.f.codes | رموز ISO | ISO codes | `iso2`, `iso3`, `iso_numeric` |
| country.f.kind | النوع | Kind | |
| country.f.continent | القارة | Continent | |
| country.f.groups | العضوية | Memberships | |
| country.f.un | عضو في الأمم المتحدة | UN member | yes or no |
| country.f.tld | النطاق الوطني | Country domain | |
| country.f.sort | مفتاح الترتيب | Sort key | the page language's key |
| country.f.flag | ملف العلم | Flag file | `flag_svg` path |
| country.f.nat-m | المذكر | Arabic, masculine | |
| country.f.nat-f | المؤنث | Arabic, feminine | |
| country.f.nat-en | بالإنجليزية | English | |
| country.f.icao | رمز الجواز (ICAO) | Passport code (ICAO) | |
| country.f.calling | مفتاح الاتصال | Calling code | |
| country.f.primary | الدولة الأساسية لهذا المفتاح | Main country for this code | yes or no; shown when the code is shared |
| country.f.leading | يبدأ الرقم بـ | Number starts with | `leading_digits`, shown when not null |
| country.f.trunk | البادئة المحلية | Trunk prefix | |
| country.f.lengths | أطوال الرقم | Number lengths | |
| country.f.mobile-lengths | طول رقم الجوال | Mobile number length | |
| country.f.prefixes | بادئات الجوال | Mobile prefixes | |
| country.f.example | مثال رقم جوال | Mobile example | formatted with `formatNational()`, raw value beside it |
| country.f.mobile-pattern | نمط رقم الجوال | Mobile pattern | regex in the code face, wraps |
| country.f.distinct | الجوال يتميّز عن الثابت | Mobile told apart from landline | yes or no |
| country.f.cur-code | رمز العملة | Currency code | |
| country.f.cur-name | الاسم | Name | |
| country.f.cur-symbol | الرمز | Symbol | U+20C1 for the riyal; the screenshot matrix shows the glyph |
| country.f.cur-symbol-ar | الرمز بالعربية | Symbol in Arabic | |
| country.f.cur-fallback | البديل إن خلا الخط من الرمز | Fallback when a font lacks the sign | |
| country.f.capital | العاصمة | Capital | |
| country.f.area | المساحة | Area | |
| country.f.population | عدد السكان | Population | |
| country.f.centre | نقطة المنتصف | Centre point | latitude, longitude |
| country.f.timezones | المناطق الزمنية | Time zones | IANA names, LTR |
| country.f.driving | جهة القيادة | Driving side | |
| country.f.languages | اللغات الرسمية | Official languages | |
| country.f.week-start | أول أيام الأسبوع | First day of the week | |
| country.f.weekend | العطلة الأسبوعية | Weekend | |
| country.f.calendars | التقاويم | Calendars | most preferred first |
| country.f.measurement | نظام القياس | Measurement system | |
| country.f.postal-format | شكل الرمز البريدي | Postal code shape | `#` a digit, `@` a letter |
| country.f.postal-example | مثال رمز بريدي | Postal code example | |
| country.f.postal-regex | نمط الرمز البريدي | Postal code pattern | |
| country.f.address | ترتيب سطور العنوان | Address lines, in order | rendered from `address_format`, raw template beside it |
| country.f.region-label | اسم التقسيم الأعلى | What the top-level region is called | |
| country.f.police | الشرطة | Police | |
| country.f.ambulance | الإسعاف | Ambulance | |
| country.f.fire | الدفاع المدني | Fire and civil defence | |
| country.f.general | الرقم الموحد للطوارئ | All-services number | |
| country.f.plugs | المقابس | Plug types | |
| country.f.voltage | الجهد | Voltage | |
| country.f.frequency | التردد | Frequency | |
| country.f.fifa | رمز فيفا | FIFA code | |
| country.f.ioc | رمز اللجنة الأولمبية | IOC code | |

## Value formats

| key | Arabic | English | note |
| --- | --- | --- | --- |
| country.v.area | {n} كم² | {n} km² | |
| country.v.population | {n} (عام {year}) | {n} ({year}) | |
| country.v.volts | {v} فولت | {v} V | |
| country.v.hertz | {v} هرتز | {v} Hz | |
| country.v.call-general | لا رقم خاصًا؛ اتصل بـ {general} | No separate number; call {general} | null service with a general number |
| country.v.postal-legend | `#` رقم، و`@` حرف | `#` is a digit, `@` a letter | under the postal shape |
| country.v.aliases | {ar} بالعربية و{en} بالإنجليزية | {ar} in Arabic, {en} in English | counts; the list sits in a disclosure under it |
| country.v.aliases.show | اعرض الأسماء | Show the names | disclosure under the counts |
| addr.name | الاسم | Name | address token `%N` |
| addr.organisation | الجهة | Organisation | `%O` |
| addr.street | الشارع والمبنى | Street address | `%A` |
| addr.district | الحي | District | `%D` |
| addr.city | المدينة | City | `%C` |
| addr.region | المنطقة | Region | `%S` |
| addr.postal-code | الرمز البريدي | Postal code | `%Z` |
| addr.sorting-code | رمز الفرز | Sorting code | `%X` |
| kind.country | دولة | Country | |
| kind.territory | إقليم | Territory | |
| continent.africa | أفريقيا | Africa | |
| continent.americas | الأمريكتان | Americas | |
| continent.asia | آسيا | Asia | |
| continent.europe | أوروبا | Europe | |
| continent.oceania | أوقيانوسيا | Oceania | |
| group.gcc | مجلس التعاون الخليجي | Gulf Cooperation Council | |
| group.arab-league | جامعة الدول العربية | Arab League | |
| day.sat | السبت | Saturday | |
| day.sun | الأحد | Sunday | |
| day.mon | الاثنين | Monday | |
| day.tue | الثلاثاء | Tuesday | |
| day.wed | الأربعاء | Wednesday | |
| day.thu | الخميس | Thursday | |
| day.fri | الجمعة | Friday | |
| driving.right | على اليمين | Right | |
| driving.left | على اليسار | Left | |
| measurement.metric | المتري | Metric | |
| measurement.us | الأمريكي | US customary | |
| measurement.uk | البريطاني | UK imperial | |
| cal.gregorian | الميلادي | Gregorian | |
| cal.islamic | الهجري | Islamic | |
| cal.islamic-umalqura | الهجري (أم القرى) | Islamic, Umm al-Qura | |
| cal.islamic-civil | الهجري الجدولي المدني | Islamic, civil tabular | |
| cal.islamic-tbla | الهجري الجدولي الفلكي | Islamic, astronomical tabular | |
| cal.islamic-rgsa | الهجري برؤية السعودية | Islamic, Saudi sighting | |
| cal.persian | الهجري الشمسي | Persian | |
| cal.chinese | الصيني | Chinese | |
| cal.dangi | الكوري (دانغي) | Korean (Dangi) | |
| cal.japanese | الياباني | Japanese | |
| cal.buddhist | البوذي | Buddhist | |
| cal.roc | تقويم مينغو | Minguo | |
| cal.coptic | القبطي | Coptic | |
| cal.ethiopic | الإثيوبي | Ethiopic | |
| cal.indian | الهندي الوطني | Indian national | |

## Phone tester

| key | Arabic | English | note |
| --- | --- | --- | --- |
| country.try.label | جرّب رقمًا | Try a number | visible label above the field |
| country.try.hint | اكتبه كما يكتبه المستخدم: بالصفر أو بدونه، أو بمفتاح الدولة، ولو بالأرقام العربية. | Type it the way a user would: with or without the leading 0, with the country code, even in Arabic digits. | hint under the label; no placeholder |
| country.try.action | تحقّق | Check | submits; Enter does the same |
| country.try.empty | الحقل فارغ؛ اكتب رقمًا ثم اضغط «تحقّق». | The field is empty; type a number, then press Check. | under the field, focus returns to it |
| country.try.valid-mobile | رقم جوال صالح في {country}. | A valid mobile number in {country}. | result summary |
| country.try.valid-fixed | رقم صالح في {country}، لكنه ليس رقم جوال. | A valid number in {country}, but not a mobile number. | |
| country.try.valid-indistinct | رقم صالح في {country}، وهنا لا يتميّز الجوال عن الثابت. | A valid number in {country}; here mobile and landline numbers look the same. | `mobile_distinguishable` false |
| country.try.other | هذا الرقم من {country}، لا من {here}. | This number belongs to {country}, not {here}. | `parsePhone` resolved another row; links to its page |
| country.try.bad-length | غير صالح: طول الرقم بعد مفتاح الاتصال {n}، والأطوال الصحيحة هنا {lengths}. | Not valid: {n} digits after the calling code; valid lengths here are {lengths}. | cause and fix in one line |
| country.try.bad-pattern | غير صالح: الطول صحيح، لكن بداية الرقم لا تطابق أي نمط في {country}. | Not valid: the length is right, but the start doesn't match any pattern for {country}. | |
| country.try.no-code | لا يبدأ هذا الرقم بمفتاح اتصال موجود في البيانات. | This number doesn't start with a calling code in the data. | `parsePhone` returned null |
| country.try.e164 | الصيغة الدولية (احفظها) | International form (store this) | |
| country.try.national | الصيغة المحلية | National form | formatted with `formatNational()` |
| country.try.mobile | جوال | Mobile | yes or no |
| country.try.from | الناتج من | Output of | before the `parsePhone(…)` line |
| country.try.loading | نحمّل قواعد أرقام الدول الأخرى | Loading the rules for other countries' numbers | screen-reader text for the skeleton |
| country.try.error | لم يُفحص الرقم لأن قواعد الدول الأخرى لم تُحمَّل بعد انقطاع الاتصال. أعد المحاولة، أو اكتب الرقم دون مفتاح الدولة. | The number wasn't checked: the rules for other countries didn't load because the connection dropped. Try again, or type the number without the country code. | then `action.retry` |
| country.try.offline | أرقام {country} تُفحص دون اتصال، وأرقام الدول الأخرى تحتاج اتصالًا. | Numbers for {country} still check offline; other countries' numbers need a connection. | after `state.offline.line` |

## Subdivisions, sources, overrides

| key | Arabic | English | note |
| --- | --- | --- | --- |
| country.subs.more | اعرض التقسيمات كلها ({n}) | Show all {n} subdivisions | over 20 rows |
| country.subs.empty | لا تقسيمات إدارية لـ{name} في ISO 3166-2. | {name} has no subdivisions in ISO 3166-2. | one sentence |
| country.subs.empty.action | تصفّح الدول كلها | Browse all countries | the one action |
| country.subs.file | ملف التقسيمات كلها | The full subdivisions file | link to the builder with "Only subdivisions" |
| country.src.version | الإصدار {v} | Version {v} | numeric or tagged versions, verbatim |
| country.src.snapshot | لقطة من المصدر | Snapshot of the source | for the version token `snapshot` (decision D5) |
| country.src.verified | تحقّقنا منه في {date} | Verified on {date} | for `verified YYYY-MM-DD`; {date} through the site's date formatter (D5) |
| country.src.archived | نسخة مؤرشفة بتاريخ {date} | Archived copy of {date} | for `archived YYYY-MM-DD` (D5) |
| country.src.dated | بتاريخ {date} | As of {date} | for a bare date such as `2026-11-01` (D5) |
| country.src.edition8 | الإصدار الثامن | 8th edition | for `8th edition` (D5) |
| country.src.licence | الترخيص: {l} | Licence: {l} | licence ids stay Latin |
| country.src.open | المصدر | Source | link to the source URL |
| country.src.links | المصادر الرسمية لأرقام {name}: | Official sources for {name}'s numbers: | before the per-country emergency links (hostnames) |
| country.src.generated | مولَّد من البيانات نفسها | Generated from the data itself | `flag`, `sort_ar`, `sort_en` |
| country.ovr.why | السبب | Why | label beside each override's note (D6) |
| date.both | {g} الموافق {h} | {g} ({h}) | Gregorian then Hijri Umm al-Qura through the site's one date formatter (entry 8): `01/11/2026 الموافق 21 جمادى الأولى 1448 هـ`, `01/11/2026 (21 Jumada al-Ula 1448 AH)` |

## Hijri months (decision D5, entry 16)

Month names for the Hijri half of `date.both`, from the Umm al-Qura month number the site's one date formatter returns. Written in full in both languages; never the platform's short form.

| key | Arabic | English | note |
| --- | --- | --- | --- |
| date.hijri | {d} {month} {y} هـ | {d} {month} {y} AH | Hijri half of `date.both`; {d} and {y} in Western digits; the era is «هـ» (ه plus tatweel) |
| hijri.m1 | محرم | Muharram | month 1 |
| hijri.m2 | صفر | Safar | month 2 |
| hijri.m3 | ربيع الأول | Rabi al-Awwal | month 3 |
| hijri.m4 | ربيع الآخر | Rabi al-Akhir | month 4 |
| hijri.m5 | جمادى الأولى | Jumada al-Ula | month 5 |
| hijri.m6 | جمادى الآخرة | Jumada al-Akhirah | month 6 |
| hijri.m7 | رجب | Rajab | month 7 |
| hijri.m8 | شعبان | Shaban | month 8 |
| hijri.m9 | رمضان | Ramadan | month 9 |
| hijri.m10 | شوال | Shawwal | month 10 |
| hijri.m11 | ذو القعدة | Dhu al-Qadah | month 11 |
| hijri.m12 | ذو الحجة | Dhu al-Hijjah | month 12 |

## Editorial decision reasons (decision D6, entry 17)

One key per override in `data/sources.json` `overrides` (67 keys), named `ovr.{iso2 in lowercase}.{field}` with the field exactly as in the data. Arabic pages show the Arabic column under "Editorial decisions in this row"; English pages show `why` verbatim from `sources.json`, and the English column here is that same text, kept for review only. `data/` and `scripts/editorial.mjs` stay unchanged.

Build check: the site build fails when an override has no `ovr.*` key, when an `ovr.*` key matches no override, or when a key's English cell differs from the override's `why`.

| key | Arabic | English | note |
| --- | --- | --- | --- |
| ovr.ps.locale.week_start,locale.weekend | لا بيانات أسبوع لهذا الصف في CLDR، فاعتمدنا ما تعمل به الدول العربية المجاورة. | CLDR has no week data for this row; neighbouring Arab practice | |
| ovr.ps.travel.frequency_hz | يذكر مصدر التيار الكهربائي حول العالم هذه الشبكة باسم الكيان المستبعد، فنسبناها إلى فلسطين. | Electric Current Worldwide lists this grid under the excluded row's name; mapped to Palestine | |
| ovr.ps.phone[+972] | أرقام +972 (ومنها القدس وأراضي 48) منسوبة إلى فلسطين وفق سياسة البيانات. | +972 numbering (Jerusalem, 1948 lines) mapped to Palestine by policy | |
| ovr.ae.name_ar | الاسم المختصر الشائع، وصيغة CLDR العربية هي الاسم الرسمي الطويل. | Common short name; CLDR's standard Arabic form is the official long name | |
| ovr.ba.nationality_ar_m | الصيغة العربية المعتمدة، ولا صيغة لها في Wikidata. | Standard Arabic form; Wikidata has none | |
| ovr.ba.nationality_en | صيغة كتاب حقائق العالم ليست صفة واحدة، فاعتمدنا الصفة الإنجليزية الشائعة. | Factbook form is not a single adjective | |
| ovr.bf.nationality_ar_m | الصيغة العربية المعتمدة، وصيغة Wikidata «بورتوريكي» خطأ. | Standard Arabic form; Wikidata's "بورتوريكي" is wrong | |
| ovr.bo.capital | العاصمة الدستورية، ولاباز مقر الحكومة. | Constitutional capital (La Paz is the seat of government) | |
| ovr.bq.capital | مقر الهيئة العامة لهولندا الكاريبية (Wikidata Q331584). | Seat of the Caribbean Netherlands public body (Wikidata Q331584) | |
| ovr.cd.nationality_ar_m | الصيغة العربية المعتمدة، ولا صيغة لها في Wikidata. | Standard Arabic form; Wikidata has none | |
| ovr.cd.nationality_en | صيغة كتاب حقائق العالم ليست صفة واحدة، فاعتمدنا الصفة الإنجليزية الشائعة. | Factbook form is not a single adjective | |
| ovr.cg.nationality_ar_m | الصيغة العربية المعتمدة، ولا صيغة لها في Wikidata. | Standard Arabic form; Wikidata has none | |
| ovr.cg.nationality_en | صيغة كتاب حقائق العالم ليست صفة واحدة، فاعتمدنا الصفة الإنجليزية الشائعة. | Factbook form is not a single adjective | |
| ovr.cm.nationality_ar_m | الصيغة العربية المعتمدة، وصيغة Wikidata «كمروني» خطأ. | Standard Arabic form; Wikidata's "كمروني" is wrong | |
| ovr.dk.nationality_ar_m | الصيغة العربية المعتمدة، ولا صيغة لها في Wikidata. | Standard Arabic form; Wikidata has none | |
| ovr.dm.nationality_ar_m | الصيغة العربية المعتمدة، ولا صيغة لها في Wikidata. | Standard Arabic form; Wikidata has none | |
| ovr.do.nationality_ar_m | الصيغة العربية المعتمدة، ولا صيغة لها في Wikidata. | Standard Arabic form; Wikidata has none | |
| ovr.er.nationality_ar_m | الصيغة العربية المعتمدة، وصيغة Wikidata «إرتري» خطأ. | Standard Arabic form; Wikidata's "إرتري" is wrong | |
| ovr.fm.nationality_ar_m | الصيغة العربية المعتمدة، ولا صيغة لها في Wikidata. | Standard Arabic form; Wikidata has none | |
| ovr.gd.nationality_ar_m | الصيغة العربية المعتمدة، وصيغة Wikidata «غرنادي» خطأ. | Standard Arabic form; Wikidata's "غرنادي" is wrong | |
| ovr.gh.nationality_ar_m | الصيغة العربية المعتمدة، ولا صيغة لها في Wikidata. | Standard Arabic form; Wikidata has none | |
| ovr.gq.nationality_ar_m | الصيغة العربية المعتمدة، ولا صيغة لها في Wikidata. | Standard Arabic form; Wikidata has none | |
| ovr.gw.nationality_ar_m | الصيغة العربية المعتمدة، ولا صيغة لها في Wikidata. | Standard Arabic form; Wikidata has none | |
| ovr.hk.nationality_ar_m | الصيغة العربية المعتمدة، ولا صيغة لها في Wikidata. | Standard Arabic form; Wikidata has none | |
| ovr.hk.nationality_en | صيغة كتاب حقائق العالم ليست صفة واحدة، فاعتمدنا الصفة الإنجليزية الشائعة. | Factbook form is not a single adjective | |
| ovr.is.nationality_ar_m | الصيغة العربية المعتمدة، ولا صيغة لها في Wikidata. | Standard Arabic form; Wikidata has none | |
| ovr.ki.nationality_en | صيغة كتاب حقائق العالم ليست صفة واحدة، فاعتمدنا الصفة الإنجليزية الشائعة. | Factbook form is not a single adjective | |
| ovr.kp.nationality_en | صيغة كتاب حقائق العالم ليست صفة واحدة، فاعتمدنا الصفة الإنجليزية الشائعة. | Factbook form is not a single adjective | |
| ovr.kr.nationality_en | صيغة كتاب حقائق العالم ليست صفة واحدة، فاعتمدنا الصفة الإنجليزية الشائعة. | Factbook form is not a single adjective | |
| ovr.kz.nationality_ar_m | الصيغة العربية المعتمدة، وصيغة Wikidata «قزاقي» خطأ. | Standard Arabic form; Wikidata's "قزاقي" is wrong | |
| ovr.li.nationality_en | صيغة كتاب حقائق العالم ليست صفة واحدة، فاعتمدنا الصفة الإنجليزية الشائعة. | Factbook form is not a single adjective | |
| ovr.lk.capital | العاصمة الرسمية، وكولومبو العاصمة التجارية. | Official capital (Colombo is the commercial capital) | |
| ovr.lk.nationality_ar_m | الصيغة العربية المعتمدة، وصيغة Wikidata «سريلنكي» خطأ. | Standard Arabic form; Wikidata's "سريلنكي" is wrong | |
| ovr.lu.nationality_en | صيغة كتاب حقائق العالم ليست صفة واحدة، فاعتمدنا الصفة الإنجليزية الشائعة. | Factbook form is not a single adjective | |
| ovr.md.nationality_ar_m | الصيغة العربية المعتمدة، وصيغة Wikidata «ملداوي» خطأ. | Standard Arabic form; Wikidata's "ملداوي" is wrong | |
| ovr.mh.nationality_ar_m | الصيغة العربية المعتمدة، ولا صيغة لها في Wikidata. | Standard Arabic form; Wikidata has none | |
| ovr.mm.nationality_ar_m | الصيغة العربية المعتمدة، وصيغة Wikidata «مينماري» خطأ. | Standard Arabic form; Wikidata's "مينماري" is wrong | |
| ovr.mo.nationality_ar_m | الصيغة العربية المعتمدة، ولا صيغة لها في Wikidata. | Standard Arabic form; Wikidata has none | |
| ovr.mo.nationality_en | صيغة كتاب حقائق العالم ليست صفة واحدة، فاعتمدنا الصفة الإنجليزية الشائعة. | Factbook form is not a single adjective | |
| ovr.ms.capital | العاصمة القانونية، وبرادس المقر الفعلي. | De jure capital (Brades is the de facto seat) | |
| ovr.mz.nationality_ar_m | الصيغة العربية المعتمدة، وصيغة Wikidata «موزنبيقي» خطأ. | Standard Arabic form; Wikidata's "موزنبيقي" is wrong | |
| ovr.ph.nationality_en | صيغة كتاب حقائق العالم ليست صفة واحدة، فاعتمدنا الصفة الإنجليزية الشائعة. | Factbook form is not a single adjective | |
| ovr.ps.nationality_en | صيغة كتاب حقائق العالم ليست صفة واحدة، فاعتمدنا الصفة الإنجليزية الشائعة. | Factbook form is not a single adjective | |
| ovr.ps.currency.ILS.name | وفق سياسة البيانات، لا يرد اسم الكيان المستبعد في أسماء العملات. | Policy: no excluded-state name in currency names | |
| ovr.py.nationality_ar_m | الصيغة العربية المعتمدة، وصيغة Wikidata «باراغواياني» خطأ. | Standard Arabic form; Wikidata's "باراغواياني" is wrong | |
| ovr.qa.nationality_ar_m | الصيغة العربية المعتمدة، وصيغة Wikidata «عربي» خطأ. | Standard Arabic form; Wikidata's "عربي" is wrong | |
| ovr.rw.nationality_ar_m | الصيغة العربية المعتمدة، وصيغة Wikidata «روندي» خطأ. | Standard Arabic form; Wikidata's "روندي" is wrong | |
| ovr.sa.name_ar | الاسم المختصر الشائع، وصيغة CLDR العربية هي الاسم الرسمي الطويل. | Common short name; CLDR's standard Arabic form is the official long name | |
| ovr.sg.nationality_en | صيغة كتاب حقائق العالم ليست صفة واحدة، فاعتمدنا الصفة الإنجليزية الشائعة. | Factbook form is not a single adjective | |
| ovr.sj.capital | المركز الإداري لسفالبارد (Wikidata Q25923). | Administrative centre of Svalbard (Wikidata Q25923) | |
| ovr.sm.nationality_ar_m | الصيغة العربية المعتمدة، ولا صيغة لها في Wikidata. | Standard Arabic form; Wikidata has none | |
| ovr.ss.nationality_ar_m | الصيغة العربية المعتمدة، ولا صيغة لها في Wikidata. | Standard Arabic form; Wikidata has none | |
| ovr.sz.capital | العاصمة الإدارية، ولوبامبا العاصمة الملكية والتشريعية. | Administrative capital (Lobamba is the royal and legislative capital) | |
| ovr.tt.nationality_ar_m | الصيغة العربية المعتمدة، ولا صيغة لها في Wikidata. | Standard Arabic form; Wikidata has none | |
| ovr.tw.nationality_ar_m | الصيغة العربية المعتمدة، ولا صيغة لها في Wikidata. | Standard Arabic form; Wikidata has none | |
| ovr.tw.nationality_en | صيغة كتاب حقائق العالم ليست صفة واحدة، فاعتمدنا الصفة الإنجليزية الشائعة. | Factbook form is not a single adjective | |
| ovr.ua.nationality_ar_m | الصيغة العربية المعتمدة، ولا صيغة لها في Wikidata. | Standard Arabic form; Wikidata has none | |
| ovr.uy.nationality_ar_m | الصيغة العربية المعتمدة، وصيغة Wikidata «أوروغواياني» خطأ. | Standard Arabic form; Wikidata's "أوروغواياني" is wrong | |
| ovr.uz.nationality_ar_m | الصيغة العربية المعتمدة، وصيغة Wikidata «أزبكستاني» خطأ. | Standard Arabic form; Wikidata's "أزبكستاني" is wrong | |
| ovr.va.nationality_ar_m | الصيغة العربية المعتمدة، ولا صيغة لها في Wikidata. | Standard Arabic form; Wikidata has none | |
| ovr.xk.nationality_ar_m | الصيغة العربية المعتمدة، وصيغة Wikidata «قوصوي» خطأ. | Standard Arabic form; Wikidata's "قوصوي" is wrong | |
| ovr.xk.nationality_en | صيغة كتاب حقائق العالم ليست صفة واحدة، فاعتمدنا الصفة الإنجليزية الشائعة. | Factbook form is not a single adjective | |
| ovr.ye.capital | العاصمة الدستورية. | Constitutional capital | |
| ovr.yt.capital | مقر المحافظة. | Seat of the prefecture | |
| ovr.za.capital | العاصمة التنفيذية، وكيب تاون العاصمة التشريعية، وبلومفونتين العاصمة القضائية. | Executive capital (Cape Town legislative, Bloemfontein judicial) | |
| ovr.za.nationality_ar_m | الصيغة العربية المعتمدة، ولا صيغة لها في Wikidata. | Standard Arabic form; Wikidata has none | |
| ovr.zw.nationality_ar_m | الصيغة العربية المعتمدة، وصيغة Wikidata «زنبابي» خطأ. | Standard Arabic form; Wikidata's "زنبابي" is wrong | |

## Source names

Keys are the source ids in `data/sources.json` in kebab-case (`iana_tz` is `source.iana-tz`). English is the `name` in `data/sources.json`, verbatim. Arabic is written for the site and shown on Arabic pages; English pages show the `sources.json` `name` verbatim (D5, approved in entry 16).

| key | Arabic | English | note |
| --- | --- | --- | --- |
| source.iso | رموز ISO 3166-1 عبر Unicode CLDR | ISO 3166-1 codes via Unicode CLDR | |
| source.cldr | Unicode CLDR | Unicode CLDR | |
| source.cldr-sub | تقسيمات Unicode CLDR | Unicode CLDR subdivisions | |
| source.wikidata | Wikidata | Wikidata | |
| source.factbook | كتاب حقائق العالم من CIA (الطبعة الأخيرة، عبر factbook.json) | CIA World Factbook (final edition, via factbook.json) | |
| source.worldbank | البنك الدولي، مؤشرات التنمية العالمية | World Bank World Development Indicators | |
| source.libphonenumber | بيانات Google libphonenumber | Google libphonenumber metadata | |
| source.iana-tz | قاعدة المناطق الزمنية من IANA | IANA Time Zone Database | |
| source.iana-root | قائمة النطاقات العليا من IANA | IANA root zone TLD list | |
| source.google-address | بيانات العناوين من Google (libaddressinput) | Google address metadata (libaddressinput) | |
| source.ecw | وزارة التجارة الأمريكية، التيار الكهربائي حول العالم | U.S. Department of Commerce, Electric Current Worldwide | |
| source.emergency | مصادر رسمية لكل دولة (GOV.UK وبوابة 112 الأوروبية وITU-T E.129 والحكومات) | Official sources per country (GOV.UK FCDO, European Commission 112, ITU-T E.129, national governments) | |
| source.official-lists | قوائم العضوية الرسمية (مجلس التعاون والجامعة العربية والأمم المتحدة) | Official member lists (GCC, Arab League, UN) | |
| source.icao | وثيقة ICAO 9303، الجزء 3 | ICAO Doc 9303 Part 3 | |
| source.flag-icons | flag-icons | flag-icons | |

## Countries index

| key | Arabic | English | note |
| --- | --- | --- | --- |
| index.title | الدول والأقاليم | Countries and territories | h1 |
| index.body | {count} صفًا: {countries} دولة و{territories} إقليمًا، مرتبة أبجديًا داخل كل قارة. | {count} rows: {countries} countries and {territories} territories, alphabetical within each continent. | counts from the data |
| index.policy | لا تجد مكانًا تبحث عنه؟ راجع سياسة البيانات. | Can't find a place? See the data policy. | links to `/{lang}/#policy` |
| index.error | لم يُحمَّل ملف البحث، فالتصفية متوقفة الآن، والقائمة كاملة أدناه. | The search file didn't load, so filtering is off for now; the full list is below. | then `action.retry` |

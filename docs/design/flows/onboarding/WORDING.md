# WORDING: onboarding (flow 1, home) and the shared chrome

One file for flow 1 and for the chrome every page shares (header, menu, switches, footer, copy actions, the root page, the 404). Flows 2 to 4 reuse the `chrome.*`, `switch.*`, `footer.*`, `action.*` and `state.*` keys from here and never redefine them. Both columns are written natively; neither is a translation of the other. Western numerals; Arabic punctuation in the Arabic column; no em dashes.

Rules for the build:

- Text in backticks is a technical identifier: rendered in the code face, isolated with `<bdi dir="ltr">` in both languages.
- `{name}` marks a variable. The site's bidi formatter wraps every variable; numbers go through the Latin-digit formatter with thousands separators (`5,012`).
- Values marked "verbatim" come from `README.md` or `README.ar.md` and change only when the README changes.
- Arabic plural keys follow Arabic number agreement: `one` (1), `two` (2), `few` (3 to 10), `many` (11 and over, and 0 is never shown).

**Status:** Stop 1 approved with changes (`DELEGATED-DECISIONS.md` entries 14 and 21); changes applied 02/11/2026. **Model:** Opus 5.5 (claude-opus-5-5).

## Shared chrome

| key | Arabic | English | note |
| --- | --- | --- | --- |
| chrome.skip-link | تخطَّ إلى المحتوى | Skip to content | first focusable element on every page |
| chrome.wordmark | worldref | worldref | Latin in both builds, isolated; links to the home page of the current language |
| chrome.menu.open | القائمة | Menu | opens the menu sheet; accessible name of the menu button |
| chrome.menu.close | إغلاق القائمة | Close menu | icon-only close carries this name; Escape also closes |
| chrome.nav.home | الرئيسية | Home | |
| chrome.nav.install | ثبّت | Install | one label per intent: the same as `home.hero.install` |
| chrome.nav.build | ابنِ ملفك | Build a file | the same as `home.hero.build` |
| chrome.nav.countries | الدول | Countries | |
| chrome.nav.agents | لوكلاء الذكاء الاصطناعي | For AI agents | |
| chrome.nav.faq | الأسئلة الشائعة | Questions and answers | anchor on the home page |
| chrome.nav.policy | سياسة البيانات | Data policy | anchor on the home page |
| switch.language.label | اللغة | Language | segmented switch; links to the same path in the other language |
| switch.language.ar | العربية | العربية | endonym in both builds, `lang="ar"` |
| switch.language.en | English | English | endonym in both builds, `lang="en"`; the only Latin label in the Arabic chrome, by convention |
| switch.theme.label | المظهر | Theme | segmented switch, three segments |
| switch.theme.system | حسب الجهاز | System | default |
| switch.theme.light | فاتح | Light | |
| switch.theme.dark | داكن | Dark | |
| footer.repo | المستودع على GitHub | Repository on GitHub | `fa-brands` GitHub icon before it |
| footer.issues | أبلغ عن خطأ في البيانات | Report a data error | links to the repo issues |
| footer.licences | التراخيص | Licences | links to `LICENSES/` |
| footer.cite | طريقة الاستشهاد | How to cite | links to `CITATION.cff` |
| footer.licence-line | الكود بترخيص MIT، ولكل مصدر بيانات ترخيصه. الأيقونات من Font Awesome Free بترخيص CC BY 4.0. | Code is MIT; each data source keeps its own licence. Icons: Font Awesome Free, CC BY 4.0. | Font Awesome attribution required by entry 2 |
| action.copy-url | انسخ الرابط | Copy URL | one label for every URL copy on the site |
| action.copied-url | نُسخ الرابط | URL copied | success; replaces the button label for 2 s, then returns |
| action.copy-command | انسخ الأمر | Copy command | one label for every command copy on the site |
| action.copied-command | نُسخ الأمر | Command copied | success; no exclamation mark |
| action.copy.error | لم يُنسخ النص لأن المتصفح منع الوصول إلى الحافظة. حدّد النص وانسخه يدويًا. | Copy didn't work: the browser blocked the clipboard. Select the text and copy it by hand. | error under the code block; the text is selected for the visitor |
| action.retry | أعد المحاولة | Try again | every retry on the site |
| state.offline.line | أنت غير متصل الآن. | You're offline. | first sentence of every offline line; each surface adds what still works |

## Root page `/`

| key | Arabic | English | note |
| --- | --- | --- | --- |
| root.line | كل دول العالم بالعربية والإنجليزية، من مصادر رسمية. | Every country in Arabic, English, or both, from official sources. | one sentence per block; the Arabic block shows the Arabic column, the English block the English column |
| root.enter | ادخل بالعربية | Continue in English | link to `/ar/` or `/en/`; visible without JavaScript |

## Home `/{lang}/`

| key | Arabic | English | note |
| --- | --- | --- | --- |
| home.title | worldref: كل دول العالم بالعربية والإنجليزية | worldref: every country in Arabic, English, or both | `<title>` and Open Graph title |
| home.hero.title | كل دول العالم بالعربية والإنجليزية | Every country in Arabic, English, or both | h1, at most 2 lines at 390 px |
| home.hero.body | الأسماء والجنسيات ومفاتيح الاتصال والتحقق من أرقام الجوال والعملات لـ {count} دولة وإقليمًا، من مصادر رسمية وبلا حساب. | Names, nationalities, dial codes, phone validation and currencies for {count} countries and territories. Sourced, free, no account. | {count} = `meta.countries` (242); under 20 words; «مفاتيح الاتصال» is the one Arabic term for dial codes on the site (entry 21) |
| home.hero.install | ثبّت | Install | primary action; opens `/{lang}/install/` |
| home.hero.build | ابنِ ملفك | Build a file | secondary action; opens `/{lang}/build/` |
| search.label | ابحث عن دولة | Search for a country | visible label above the input |
| search.hint | بالاسم أو رمز الدولة أو مفتاح الاتصال، بالعربية أو الإنجليزية | By name, country code or dial code, in Arabic or English | hint under the label; the input has no placeholder |
| search.clear | امسح البحث | Clear search | icon button inside the input and the empty-state action |
| search.try | جرّب: | Try: | before the example chips; chip values are data, not copy |
| search.region | منطقتك | Your region | tag on the row pinned by `sortCountries(…, first)` |
| search.list.all | اعرض الدول كلها ({count}) | Show all {count} countries | link to the countries index under the 5 first-run rows |
| search.results.count.one | نتيجة واحدة | 1 match | |
| search.results.count.two | نتيجتان | 2 matches | |
| search.results.count.few | {n} نتائج | {n} matches | 3 to 10 |
| search.results.count.many | {n} نتيجة | {n} matches | 11 and over |
| search.results.more | اعرض النتائج كلها ({n}) | Show all {n} matches | partial state: shown when matches exceed 8 |
| search.results.source | النتائج من دالة `search()` نفسها التي تثبّتها. | These results come from the same `search()` you install. | one line under the results, small |
| search.empty.body | لا دولة تطابق «{q}»؛ ابحث باسم الدولة أو رمزها أو مفتاح الاتصال. | No country matches "{q}"; try a country name, code or dial code. | one sentence; the query is isolated |
| search.empty.action | امسح البحث | Clear search | the one action |
| search.loading.label | نحمّل قائمة الدول | Loading the country list | screen-reader text for the skeleton |
| search.error.body | لم تُحمَّل قائمة الدول لأن الاتصال انقطع. تحقق من اتصالك ثم أعد المحاولة. | The country list didn't load because the connection dropped. Check your connection, then try again. | cause, fix; then `action.retry` |
| search.offline.body | البحث يعمل على القائمة المحمّلة، وصفحات الدول تحتاج اتصالًا. | Search still works on the loaded list; country pages need a connection. | after `state.offline.line` |
| home.facts.title | البيانات بالأرقام | The data in numbers | h2, visually hidden; the strip speaks for itself |
| home.facts.rows | دولة وإقليمًا | countries and territories | after {count} = 242 |
| home.facts.rows.split | {countries} دولة و{territories} إقليمًا | {countries} countries, {territories} territories | 195 and 47, counted from `kind` |
| home.facts.subdivisions | تقسيمًا إداريًا | subdivisions | after 5,012 (`meta.subdivisions`) |
| home.facts.modules | وحدات تجمعها `iso2` | modules joined on `iso2` | after 9 |
| home.facts.builds | نسخ: ثنائية اللغة وعربية وإنجليزية | builds: bilingual, Arabic, English | after 3 |
| home.facts.languages | لغات برمجة وخادم MCP | programming languages, plus an MCP server | after 8; counted from the install table |
| home.facts.version | الإصدار {version}، من CLDR {cldr} وlibphonenumber {phone} | Version {version}, from CLDR {cldr} and libphonenumber {phone} | versions from `meta.json`, never dates (entry 8) |
| home.ways.title | خذ ما تحتاجه فقط | Take only what you need | h2 |
| home.ways.install.title | ثبّته في مشروعك | Install it in your project | row link to `/{lang}/install/` |
| home.ways.install.body | {count} طريقة، منها JavaScript وSwift وKotlin وPython وGo. | {count} ways, including JavaScript, Swift, Kotlin, Python and Go. | {count} = 12 install rows |
| home.ways.build.title | ابنِ ملفك | Build a file | row link to `/{lang}/build/` |
| home.ways.build.body | اختر اللغة والوحدات والصيغة، وشاهد الحجم قبل التنزيل. | Pick the language, modules and format, and see the size before you download. | |
| home.ways.api.title | دولة واحدة برابط | One country by URL | |
| home.ways.api.body | بلا تثبيت: ملف JSON لكل دولة، وهذا رابط السعودية. | No install: one JSON file per country. This one is Saudi Arabia. | the URL below it uses the visitor's region when known, else `sa` |
| home.ways.agents.title | لوكلاء الذكاء الاصطناعي | For AI agents | row link to `/{lang}/agents/` |
| home.ways.agents.body | خادم MCP وملف llms.txt وأنماط JSON Schema. | An MCP server, llms.txt and JSON Schemas. | |
| home.native.title | عربية أصيلة لا مترجمة | Arabic done natively | h2; verbatim from the READMEs |
| home.native.body | كل سطر هنا ناتج فعلي من المكتبة. | Every line here is real output from the library. | |
| home.native.search | البحث يتجاهل «ال» والهمزة والتشكيل | Search ignores «ال», hamza forms and tashkeel | label of the example row |
| home.native.nationality | الجنسية بالمذكر والمؤنث | Nationality, masculine and feminine | |
| home.native.digits | حقل الجوال يقبل الأرقام العربية | Phone fields accept Arabic digits | label of the digits row |
| home.native.digits.body | اكتب الرقم بالأرقام العربية أو الفارسية، وتحوّلها `parsePhone()` إلى أرقام غربية قبل التحقق. | Type the number in Arabic-Indic or Persian digits; `parsePhone()` turns them into Western digits before it checks. | the behaviour in words; no Arabic-Indic or Persian digit is rendered anywhere on the site (entry 15) |
| home.native.digits.result | النتيجة واحدة للرقم {number} أيًّا كانت أرقامه: | Same result for {number} in any of the three digit sets: | {number} = `0501234567` in the code face; the output line under it is library output in Western digits |
| home.native.sort | الترتيب الأبجدي العربي الصحيح | Correct Arabic alphabetical order | |
| home.native.sort.value | «السعودية» تحت حرف السين لا الألف | «السعودية» sorts under س, not ا | output column of the sort row |
| policy.title | سياسة البيانات | Data policy | h2, anchor `#policy` |
| policy.palestine | **فلسطين** دولة، عاصمتها «القدس». الأرقام التي تبدأ بـ **+970 و+972** (ومنها القدس وأراضي 48) أرقام فلسطينية. عملاتها الدينار الأردني و«الشيكل». | **Palestine** is «فلسطين» / "Palestine", a country, with its capital «القدس» / "Jerusalem". Numbers with **+970 and +972** (including Jerusalem and the 1948 lines) are Palestinian numbers here. Its currencies are the Jordanian dinar and the shekel (shown as «شيكل» / "Shekel"). | verbatim; dial codes isolated LTR |
| policy.disputed | **الأماكن المتنازع عليها تتبع المواقف الرسمية للمملكة العربية السعودية:** الصحراء الغربية جزء من المغرب، وكوسوفو مدرجة، وشمال قبرص غير مدرجة، وتايوان وهونغ كونغ ومكاو أقاليم لها جنسية. | **Disputed places follow the official positions of Saudi Arabia:** Western Sahara is part of Morocco (no separate row), Kosovo is included, Northern Cyprus is not, and Taiwan, Hong Kong and Macau are territories that still have a nationality (they issue their own passports). | verbatim |
| policy.requests | طلبات تغيير هذه السياسة تُغلق دون نقاش، ونرحّب بتصحيح البيانات مع رابط المصدر. | Requests to change this policy are closed without discussion. Corrections to data are welcome with a source link. | English verbatim; Arabic approved, entry 14 |
| policy.full | السياسة كاملة على GitHub | Full policy on GitHub | Arabic pages link to `README.ar.md#سياسة-البيانات`; English pages link to `README.md#data-policy` (entry 14) |
| faq.title | الأسئلة الشائعة | Questions and answers | h2, anchor `#faq`; `FAQPage` JSON-LD per language |
| faq.q1 | أين أجد قائمة الدول بالعربية؟ | How do I get a list of countries in Arabic? | verbatim |
| faq.a1 | في `data/worldref.ar.json`، ورتّبها حسب الحقل `sort`. | Use `data/worldref.ar.json` (or `data/modules/core.ar.json` for names only). Each row has `name` in Arabic. For a ready-made picker order, sort by `sort` (it ignores «ال» and hamza forms). | verbatim |
| faq.q2 | أين أجد قائمة الجنسيات بالعربية مذكرًا ومؤنثًا؟ | Where is a list of nationalities in Arabic, masculine and feminine? | verbatim |
| faq.a2 | في `data/modules/nationality.json`: الحقلان `nationality_ar_m` و`nationality_ar_f`. | `data/modules/nationality.json`: `nationality_ar_m` (سعودي) and `nationality_ar_f` (سعودية), plus `nationality_en` (Saudi). | verbatim |
| faq.q3 | كيف أتحقق من رقم جوال سعودي؟ | How do I validate a Saudi mobile number? | verbatim |
| faq.a3 | `parsePhone(input, byIso2("SA"))` ثم تحقق من `valid` و`mobile`. تُقبل الأرقام العربية. | `parsePhone(input, byIso2("SA"))` and check `valid && mobile`. The rule is in `phone[0].mobile_pattern`: 9 digits starting with 50, 51, 53 to 59 after dropping the leading 0. Arabic digits are accepted. | verbatim |
| faq.q4 | لماذا قيمة `travel.emergency.police` فارغة في بعض الدول؟ | Why is `travel.emergency.police` null for some countries? | English verbatim; Arabic approved, entry 14 |
| faq.a4 | لا ننشر الرقم إلا إذا أكّده مصدر رسمي. إذا كانت الخدمة `null` فاتصل بالرقم العام `general`. | Only numbers confirmed by an official source are published. If a service is null, call `general`. | English verbatim; Arabic approved, entry 14 (wording fixed, entry 21) |
| faq.q5 | هل يمكنني استخدام worldref في مشروع تجاري؟ | Can I use this commercially? | English verbatim; Arabic approved, entry 14 (wording fixed, entry 21); `worldref` isolated |
| faq.a5 | نعم. الكود بترخيص MIT، وتراخيص البيانات كلها (Unicode وApache-2.0 وCC-BY-4.0 وCC0 والملكية العامة) تسمح بالاستخدام التجاري مع ذكر المصدر متى اشتُرط. | Yes. Code is MIT; data licences (Unicode, Apache-2.0, CC-BY-4.0, CC0, public domain) all allow commercial use with attribution where required. | English verbatim; Arabic approved, entry 14 |
| faq.q6 | ما مدى حداثة البيانات؟ | How current is it? | English verbatim; Arabic approved, entry 14 |
| faq.a6 | تفحص مهمة آلية المصادر كل شهر (وبيانات السكان كل ثلاثة أشهر)، وتصدر تحديثًا متى تغيّرت ونجحت الاختبارات كلها. الإصدارات في `data/meta.json`. | An automated job checks the upstream sources monthly (population quarterly) and releases a patch when they change and every test passes. Versions are in `data/meta.json`. | English verbatim; Arabic approved, entry 14 (wording fixed, entry 21) |

## For AI agents `/{lang}/agents/`

| key | Arabic | English | note |
| --- | --- | --- | --- |
| agents.title | لوكلاء الذكاء الاصطناعي | For AI agents | h1; the same words as `chrome.nav.agents` |
| agents.body | كل ما يحتاجه الوكيل ليقرأ البيانات ويجيب منها وحدها. | Everything an agent needs to read the data and answer from it alone. | one line |
| agents.mcp.title | خادم MCP | MCP server | h2; primary action `action.copy-command` |
| agents.mcp.tools | الأدوات: {tools} | Tools: {tools} | tools listed in the code face, LTR |
| agents.files.title | ملفات للقراءة | Files to read | h2 |
| agents.file.llms | فهرس مختصر للوكلاء | Short index for agents | under `llms.txt` |
| agents.file.llms-full | كل حقل مع سجل كامل مثالًا | Every field, with a full example record | under `llms-full.txt` |
| agents.file.agents-md | دليل لوكلاء البرمجة | Guide for coding agents | under `AGENTS.md` |
| agents.file.openapi | واجهة API الثابتة بمواصفة OpenAPI | The static API as an OpenAPI description | under `openapi.json` |
| agents.file.schema | JSON Schema لكل ملف ولكل نسخة | A JSON Schema for every file and build | under `schema/` |
| agents.file.country | دولة واحدة برمز iso2 بحروف صغيرة | One country, by lowercase iso2 | under `api/v1/{iso2}.json` |
| agents.offline.body | الأوامر والروابط تُنسخ، وفتح الملفات يحتاج اتصالًا. | Commands and links still copy; opening the files needs a connection. | after `state.offline.line` |
| agents.rules.title | قواعد الإجابة من البيانات | Rules for answering from this data | h2 |
| agents.rules.null | أجب من البيانات فقط. القيمة `null` أو القائمة الفارغة تعني أنها مجهولة: قل ذلك ولا تخمّن. | Answer from the data only. `null` or an empty list means unknown: say so, never guess. | English verbatim from `llms.txt` |
| agents.rules.phone | احفظ رقم الجوال بالصيغة الدولية (E.164) مع رمز `iso2` للدولة التي اختارها المستخدم. | Store phone numbers in international form (E.164) plus the `iso2` the user picked. | |
| agents.rules.emergency | أرقام الطوارئ منشورة فقط إذا أكّدها مصدر رسمي، والخدمة `null` تعني: اتصل بالرقم العام `general`. | Emergency numbers are published only when an official source confirms them. A null service means: call `general`. | English verbatim from `llms.txt` |

## 404 (one `404.html` for both languages)

| key | Arabic | English | note |
| --- | --- | --- | --- |
| notfound.title | هذه الصفحة غير موجودة | This page doesn't exist | h1 |
| notfound.body | ربما تغيّر الرابط أو فيه خطأ في الكتابة. ابحث عن الدولة، أو ارجع إلى الصفحة الرئيسية. | The link may have changed or have a typo. Search for the country, or go to the home page. | cause, then fix |
| notfound.home | ارجع إلى الصفحة الرئيسية | Go to the home page | the one action besides the search control |
| notfound.other | النسخة الإنجليزية | English version | label of the foot block that repeats `notfound.title` and `notfound.home` in the other language, with its own `lang` and `dir`; shown as plain text without JavaScript |

## Shared data labels (used by flows 2, 3 and 4)

Module names stay in the code face (`phone`); these labels sit beside them.

| key | Arabic | English | note |
| --- | --- | --- | --- |
| module.core | الأسماء والرموز | names and codes | `core` |
| module.nationality | الجنسية | nationality | `nationality` |
| module.phone | الهاتف والتحقق من الجوال | phone and mobile validation | `phone` |
| module.currency | العملة | currency | `currency` |
| module.geo | العاصمة والمساحة والسكان | capital, area, population | `geo` |
| module.locale | اللغة والأسبوع والتقويم | language, week, calendar | `locale` |
| module.address | العنوان البريدي | postal address | `address` |
| module.travel | الطوارئ والكهرباء | emergency numbers and power | `travel` |
| module.sports | رموز فيفا والأولمبية | FIFA and IOC codes | `sports` |
| module.subdivisions | التقسيمات الإدارية | subdivisions | `subdivisions`, ISO 3166-2 |
| build.bilingual | عربي وإنجليزي | Arabic and English | `.json` |
| build.ar | عربي فقط | Arabic only | `.ar.json` |
| build.en | إنجليزي فقط | English only | `.en.json` |

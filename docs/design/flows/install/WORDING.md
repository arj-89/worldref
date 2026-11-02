# WORDING: install (flow 2)

Keys for `/{lang}/install/`. Shared keys (`chrome.*`, `switch.*`, `footer.*`, `action.*`, `state.*`, `module.*`, `build.*`) live in `docs/design/flows/onboarding/WORDING.md`. Both columns are written natively. Western numerals; Arabic punctuation; no em dashes. Text in backticks is a technical identifier in the code face, isolated LTR.

Commands and first calls are not copy: they are taken verbatim from `README.md` (install table) and each language folder's README, and listed in the spec, section 7.

**Status:** Stop 1 approved with changes (`DELEGATED-DECISIONS.md` entry 22); changes applied 02/11/2026. **Model:** Opus 5.5 (claude-opus-5-5).

## Page

| key | Arabic | English | note |
| --- | --- | --- | --- |
| install.title | ثبّت worldref | Install worldref | h1; `<title>` adds the wordmark |
| install.body | كل الطرق تعمل مباشرة من هذا المستودع دون حساب في أي سجل حزم. | No package registry account is needed for any of these; everything installs from this repository. | verbatim from the READMEs |
| install.jump | انتقل إلى بيئتك | Jump to your stack | label above the jump row of 12 links |
| install.where.terminal | الطرفية | Terminal | label above a command that runs in a shell |
| install.where.url | رابط | URL | label above a URL |
| install.step | الخطوة {n} من {total} | Step {n} of {total} | for the two stacks whose lines go to two destinations (Kotlin, PHP); C# is one Terminal block (entry 20) |
| install.step.next | بقيت الخطوة {n} من {total} | Next: step {n} of {total} | partial state, on the block not yet copied |
| install.first.show | اعرض أول استدعاء | Show the first call | toggle under each stack; opens by itself after a copy |
| install.first.hide | أخفِ أول استدعاء | Hide the first call | |
| install.first.title | أول استدعاء | First call | label above the first-call block |
| install.guide | الدليل الكامل على GitHub | Full guide on GitHub | links to the stack's folder README |
| install.swift.product | اختر المنتج `WorldRef`. | Then pick the product `WorldRef`. | under the Swift line |
| install.dart.where | تحت `dependencies:` | Under `dependencies:` | label detail for `pubspec.yaml` |
| install.php.where | داخل `repositories` | Inside `repositories` | label detail for `composer.json` |
| install.files.body | ملفات JSON وCSV وSQL (Postgres وMySQL وSQLite) في مجلد `data/` وفي صفحة الإصدارات. | JSON, CSV and SQL (Postgres, MySQL, SQLite) in `data/` and on the releases page. | close to the README row |
| install.files.releases | صفحة الإصدارات | Releases page | secondary link in the "Any language" row |
| install.mcp.more | الأدوات والملفات للوكلاء | Tools and files for agents | link to the agents page from the MCP row |
| install.empty.body | لا توجد حزمة خاصة بـ «{stack}» بعد؛ ملفات JSON ورابط الدولة الواحدة يعملان في أي لغة. | There's no package for "{stack}" yet; the JSON files and the one-country URL work in any language. | deep link to a stack that is not listed; one sentence |
| install.empty.action | اذهب إلى الملفات | Go to the files | scrolls to the "Any language" row |
| install.offline.body | الأوامر تُنسخ، والتثبيت نفسه يحتاج اتصالًا. | Commands still copy; installing needs a connection. | after `state.offline.line` |
| install.modules.title | استخدم ما تحتاجه فقط | Use only what you need | h2; verbatim heading |
| install.modules.body | البيانات مقسمة إلى وحدات يجمعها المفتاح `iso2`، ولكل وحدة ثلاث نسخ: `.json` (عربي وإنجليزي)، و`.ar.json` (عربي فقط)، و`.en.json` (إنجليزي فقط). | The data is split into modules that share the key `iso2`. Each module comes in 3 builds: `.json` (Arabic and English), `.ar.json` (Arabic only), `.en.json` (English only). | verbatim, joined |
| install.modules.pick | اختر وحدة | Pick a module | label of the module chip group (single choice) |
| install.modules.js | في JavaScript استورد الوحدة وحدها، فلا تشحن أداة الحزم إلا ملفها: | In JavaScript, import only the module you use, and your bundler ships only that file: | when the last stack used is JavaScript |
| install.modules.other | في اللغات الأخرى حمّل ملف الوحدة التي تحتاجها فقط: | In other languages, load only the module file you need: | otherwise; the block is the module's URL |
| install.modules.build | تريد لغة واحدة أو صيغة CSV أو عدة وحدات في ملف واحد؟ | Need one language, CSV, or several modules in one file? | line before the Build a file link |
| install.null | القيمة `null` تعني أنها غير معروفة، فلا تملأها بتخمين. | A missing value is `null` (or an empty list). Treat it as unknown; never fill it in. | verbatim |

## Stack names

Platform lists sit in brackets after the name, small. Product names stay Latin in both columns.

| key | Arabic | English | note |
| --- | --- | --- | --- |
| install.stack.js | JavaScript وTypeScript | JavaScript, TypeScript | id `js` |
| install.stack.js.on | الويب وNode وReact Native وBun وDeno | web, Node, React Native, Bun, Deno | |
| install.stack.cdn | CDN | CDN | id `cdn` |
| install.stack.cdn.on | بلا خطوة بناء | no build step | |
| install.stack.swift | Swift | Swift | id `swift` |
| install.stack.swift.on | iOS وmacOS | iOS, macOS | |
| install.stack.kotlin | Kotlin وAndroid | Kotlin, Android | id `kotlin` |
| install.stack.kotlin.on | عبر JitPack | via JitPack | |
| install.stack.python | Python | Python | id `python` |
| install.stack.python.on | الإصدار 3.9 أو أحدث | 3.9 or newer | from the Python README |
| install.stack.dart | Dart وFlutter | Dart, Flutter | id `dart` |
| install.stack.dart.on | ومنها Flutter للويب | Flutter web included | from the Dart README |
| install.stack.php | PHP وLaravel | PHP, Laravel | id `php` |
| install.stack.php.on | عبر Composer | via Composer | |
| install.stack.go | Go | Go | id `go` |
| install.stack.go.on | المكتبة القياسية فقط | standard library only | from the Go README |
| install.stack.csharp | C# و.NET | C#, .NET | id `csharp` |
| install.stack.csharp.on | مرجع مشروع، لا حزمة NuGet | project reference, no NuGet package | from the C# README |
| install.stack.files | أي لغة | Any language | id `files` |
| install.stack.files.on | JSON وCSV وSQL | JSON, CSV, SQL | |
| install.stack.mcp | وكلاء الذكاء الاصطناعي | AI agents | id `mcp` |
| install.stack.mcp.on | خادم MCP | MCP server | |
| install.stack.api | بلا تثبيت | No install | id `api` |
| install.stack.api.on | دولة واحدة برابط | one country by URL | |

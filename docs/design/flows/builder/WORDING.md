# WORDING: custom-file builder (flow 3)

Keys for `/{lang}/build/`. Shared keys (`chrome.*`, `switch.*`, `footer.*`, `action.*`, `state.*`, `module.*`, `build.*`) live in `docs/design/flows/onboarding/WORDING.md`. Both columns are written natively. Western numerals; Arabic punctuation; no em dashes. Text in backticks is a technical identifier in the code face, isolated LTR.

Sizes are data, not copy: computed at build time from the files in `data/`, exact to the byte, shown in KB (1 KB = 1,024 bytes) to one decimal with the byte count beside it.

**Status:** draft for Stop 1, 02/11/2026. **Model:** Opus 5.5 (claude-opus-5-5).

| key | Arabic | English | note |
| --- | --- | --- | --- |
| build.title | ابنِ ملفك | Build a file | h1; the same words as the Build a file action everywhere |
| build.body | اختر ما تحتاجه وشاهد الحجم قبل التنزيل. يُبنى الملف في متصفحك من ملفات worldref المنشورة. | Pick what you need and see the size before you download. The file is built in your browser from the published worldref files. | one line of explanation |
| build.lang.label | لغة الأسماء | Language of names | label of the 3-segment switch using `build.bilingual`, `build.ar`, `build.en` |
| build.modules.label | الوحدات | Modules | group label |
| build.modules.all | الوحدات التسع كلها | All 9 modules | summary when none is picked or all 9 are |
| build.modules.some | {n} من 9: {list} | {n} of 9: {list} | summary when some are picked; {list} in the code face |
| build.modules.hint | لم تختر وحدة؟ يأتيك الملف بالوحدات كلها. | Pick none and you get every module. | hint under the label |
| build.modules.clear | امسح الاختيار | Clear selection | shown only when a module is picked |
| build.modules.off | الوحدات لا تخص ملف التقسيمات الإدارية. | Modules don't apply to the subdivisions file. | replaces the chips when subdivisions is "Only" |
| build.subs.label | التقسيمات الإدارية ({n}) | Subdivisions ({n}) | {n} = 5,012 |
| build.subs.none | بدونها | Without | default |
| build.subs.inside | داخل كل دولة | Inside each country | JSON nests them as `subdivisions`; CSV adds a second file |
| build.subs.only | وحدها | Only subdivisions | |
| build.format.label | الصيغة | Format | JSON or CSV, both Latin labels |
| build.csv.two-files | ملف CSV لا يحمل قوائم متداخلة، فتأتي التقسيمات في ملف ثانٍ. | CSV can't hold nested lists, so subdivisions come as a second file. | shown for CSV with "Inside each country" |
| build.size | {kb} كيلوبايت ({bytes} بايت) | {kb} KB ({bytes} bytes) | size line; both values exact from the size table |
| build.size.short | {kb} كيلوبايت | {kb} KB | beside each module: what that module adds to the file in the chosen build and format |
| build.size.mb | {mb} ميغابايت ({bytes} بايت) | {mb} MB ({bytes} bytes) | used at 1,048,576 bytes and above |
| build.rows | {n} صفًا | {n} rows | 242 or 5,012 |
| build.download | نزّل الملف | Download | primary action; the bar shows the file name and size above it |
| build.download.second | نزّل ملف التقسيمات | Download subdivisions | second button, CSV with "Inside each country" only |
| build.shipped.tag | مطابق للملف المنشور | Same as the published file | tag beside the file name when the selection equals a shipped file |
| build.shipped.title | الملف نفسه عبر CDN | The same file on the CDN | heading of the URL block, shipped selections only |
| build.shipped.body | استخدم هذا الرابط إن أردت أن يحمّل تطبيقك الملف مباشرة. | Use this URL if your app should load the file directly. | |
| build.preview.title | معاينة الصف الأول | Preview of the first row | h2 |
| build.preview.more.one | ويكمل الصف سطرًا واحدًا آخر. | The row goes on for 1 more line. | under a cut row |
| build.preview.more.two | ويكمل الصف سطرين آخرين. | The row goes on for 2 more lines. | |
| build.preview.more.few | ويكمل الصف {n} أسطر أخرى. | The row goes on for {n} more lines. | 3 to 10 |
| build.preview.more.many | ويكمل الصف {n} سطرًا آخر. | The row goes on for {n} more lines. | 11 and over |
| build.preview.end | نهاية المعاينة. في الملف {rows}. | End of preview. The file has {rows}. | explicit end line; {rows} uses `build.rows` |
| build.loading | نجهّز الملف: {done} من {total} ملفات | Preparing the file: {done} of {total} files | on the Download button while module files load (over 300 ms) |
| build.error | لم يُحمَّل `{file}` لأن الاتصال انقطع. أعد المحاولة، أو أزل هذه الوحدة من اختيارك. | `{file}` didn't load because the connection dropped. Try again, or remove that module from your selection. | cause, fix; then `action.retry` |
| build.offline.body | الملفات التي حمّلتها في هذه الزيارة تُبنى دون اتصال: {list}. غيرها يحتاج اتصالًا. | Files you loaded during this visit still build offline: {list}. Others need a connection. | after `state.offline.line` |
| build.offline.none | لم تحمّل أي ملف في هذه الزيارة، فالتنزيل يحتاج اتصالًا. | No files are loaded yet in this visit, so downloading needs a connection. | offline before any download |
| build.success | نُزّل الملف `{file}`. | Downloaded `{file}`. | status line after the save; no exclamation mark |
| build.use-install | تحتاج وحدة واحدة في مشروع JavaScript؟ استوردها مباشرة. | Need one module in a JavaScript project? Import it directly. | single-module selections; links to `/{lang}/install/#modules` |

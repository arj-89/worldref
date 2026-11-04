# worldref (Dart / Flutter)

Countries and territories in Arabic and English: names, ISO codes, phone plans, currencies, geo, locale, search and sorting. No runtime dependencies; works in Flutter, including web.

## Install from GitHub

```yaml
dependencies:
  worldref: ^1.1.1
```

## Usage

```dart
import 'package:worldref/worldref.dart';

final sa = byIso2('sa')!;                              // case-insensitive lookup
print(sa.nameAr);                                      // السعودية
print(search(countries, 'مملكة', Lang.ar).first.iso2); // SA
print(sortCountries(countries, Lang.ar, 'SA').first.iso2);
final p = parsePhone('0501234567', sa, countries);
print('${p?.e164} ${p?.valid} ${p?.mobile}');          // +966501234567 true true
print(isValidMobile('+966501234567', sa, countries));
print(subdivisionsOf('SA').length);
```

API: `countries`, `byIso2`, `subdivisions`, `subdivisionsOf`, `normalize`, `westernDigits`, `search`, `sortCountries`, `parsePhone`, `isValidMobile`, `formatNational`. Data is parsed lazily on first use.

## Test

```
cd dart && dart pub get && dart test
```

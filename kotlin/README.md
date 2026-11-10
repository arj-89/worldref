# worldref (Kotlin / JVM)

242 countries and territories in Arabic and English: names, flags, phone plans, currencies, geo, subdivisions. Runs on the JVM and Android (JVM target 11). Only runtime dependency: kotlinx-serialization-json.

## Install from GitHub (JitPack)

```kotlin
repositories { maven("https://jitpack.io") }
dependencies { implementation("com.github.arj-89:worldref:v1.2.0") }
```

Repo: github.com/arj-89/worldref, tag v1.2.0.

## Usage

```kotlin
import worldref.*

val sa = byIso2("sa")!!                          // case-insensitive
println(sa.nameAr)                               // السعودية
search(countries, "سعودية", Lang.AR).first().iso2 // SA
search(countries, "Kuwiat").first().iso2         // KW (forgives small typos when nothing else matches)
search(countries, "unitedstates").first().iso2   // US (spaces ignored)
sortCountries(countries, Lang.AR, first = "SA")  // alphabetical, user's country first
val p = parsePhone("0501234567", sa, countries)  // e164 = +966501234567, valid, mobile
isValidMobile("+966501234567", sa, countries)    // true
formatNational(p!!.national, sa.phone[0])        // 50 123 4567
subdivisionsOf("SA").size
addressForm(sa, Lang.AR)                         // lines of fields: name, organization, street, city + postal_code
    .forEach { line -> println(line.joinToString { "${it.label}${if (it.required) " *" else ""}" }) }
editDistance("kuwiat", "kuwait", 2)              // 1
```

# WorldRef (Swift)

242 countries and territories in Arabic and English, bundled as JSON. iOS 15+, macOS 12+, Foundation only.

## Install

```swift
.package(url: "https://github.com/arj-89/worldref.git", from: "1.1.0")
// target dependency: .product(name: "WorldRef", package: "worldref")
```

## Usage

```swift
import WorldRef

let all = WorldRef.countries
let sa = WorldRef.country(iso2: "sa")!
print(sa.nameAr, sa.geo.capitalAr ?? "")
let hits = search(all, "السعودية", lang: .ar)          // best match first
let sorted = sortCountries(all, lang: .ar, first: "SA")  // Saudi Arabia pinned first
let phone = parsePhone("0501234567", country: sa, all: all)
print(phone?.e164 ?? "", phone?.mobile ?? false)         // +966501234567 true
print(isValidMobile("+966501234567", country: sa))
print(normalize("الإمارات"), WorldRef.subdivisions(iso2: "SA").count)
```

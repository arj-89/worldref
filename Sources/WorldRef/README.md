# WorldRef (Swift)

242 countries and territories in Arabic and English, bundled as JSON. iOS 15+, macOS 12+, Foundation only.

## Install

```swift
.package(url: "https://github.com/arj-89/worldref.git", from: "1.1.3")
// target dependency: .product(name: "WorldRef", package: "worldref")
```

## Usage

```swift
import WorldRef

let all = WorldRef.countries
let sa = WorldRef.country(iso2: "sa")!
print(sa.nameAr, sa.geo.capitalAr ?? "")
let hits = search(all, "السعودية", lang: .ar)          // best match first
search(all, "unitedstates").first?.iso2                  // "US": spaces are optional
search(all, "Kuwiat").first?.iso2                        // "KW": small typos forgiven when nothing else matches
for line in addressForm(sa, lang: .ar) {                 // fields line by line, in the country's order
    print(line.map { "\($0.label ?? $0.field.rawValue)\($0.required ? " *" : "")" })
}
let sorted = sortCountries(all, lang: .ar, first: "SA")  // Saudi Arabia pinned first
let phone = parsePhone("0501234567", country: sa, all: all)
print(phone?.e164 ?? "", phone?.mobile ?? false)         // +966501234567 true
print(isValidMobile("+966501234567", country: sa))
print(normalize("الإمارات"), WorldRef.subdivisions(iso2: "SA").count)
```

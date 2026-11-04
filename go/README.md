# worldref for Go

242 countries and territories in Arabic and English, embedded in the package (no downloads, standard library only):
ISO codes, names and aliases, flags, phone plans, currencies, geography, locale, address formats, travel facts, and ISO 3166-2 subdivisions.
Plus Arabic-aware search, sorting, and phone parsing.

## Install

```sh
go get github.com/arj-89/worldref/go@v1.1.2
```

The module lives in the `go/` subdirectory of github.com/arj-89/worldref, so the git tag is `go/v1.1.2`.

## Usage

```go
sa, _ := worldref.ByISO2("sa")
all := worldref.Countries()

hits := worldref.Search(all, "السعودية", worldref.AR) // names, aliases, ISO and dial codes
fmt.Println(hits[0].ISO2, hits[0].NameEN)             // SA Saudi Arabia

list := worldref.SortCountries(all, worldref.AR, "SA") // Saudi Arabia pinned first
p := worldref.ParsePhone("0501234567", sa, all)
fmt.Println(p.E164, p.Valid, p.Mobile, list[0].ISO2)   // +966501234567 true true SA
```

Other helpers: `Normalize`, `WesternDigits`, `IsValidMobile`, `FormatNational`, `Subdivisions`, `SubdivisionsOf`.

## Test

```sh
go vet ./... && go test ./...
```

The tests load the shared vectors from `../tests/vectors.json`.

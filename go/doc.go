// Package worldref is a reference dataset of 242 countries and territories in
// Arabic and English, with the helpers a form or a picker needs on top of it.
//
// The data is embedded in the package, so there is nothing to download or
// configure. Every record carries ISO codes, names and aliases in both
// languages, flag, continent, nationality, phone plans, currencies, geography,
// locale, address format, travel facts and sports codes. Subdivisions (ISO
// 3166-2) are available separately.
//
// Helpers:
//
//   - [Countries], [ByISO2], [Subdivisions], [SubdivisionsOf] for the data.
//   - [Normalize] and [WesternDigits] fold names and queries for matching
//     (case, accents, Arabic letter variants, tashkeel, tatweel, the "al" prefix).
//   - [Search] ranks countries against a free-text query: names, aliases, ISO
//     codes and dial codes.
//   - [SortCountries] orders countries in the UI language, optionally pinning
//     the user's own country first.
//   - [ParsePhone], [IsValidMobile] and [FormatNational] read and check phone
//     numbers against the per-country plans.
//
// Example:
//
//	sa, _ := worldref.ByISO2("sa")
//	hits := worldref.Search(worldref.Countries(), "السعودية", worldref.AR)
//	p := worldref.ParsePhone("0501234567", sa, nil)
//	fmt.Println(hits[0].ISO2, p.E164, p.Valid, p.Mobile)
package worldref

package worldref

import (
	_ "embed"
	"encoding/json"
	"strings"
	"sync"
)

//go:embed data/worldref.json
var countriesJSON []byte

//go:embed data/subdivisions.json
var subdivisionsJSON []byte

var (
	loadOnce  sync.Once
	countries []Country
	byISO2    map[string]*Country
	subs      []Subdivision
	subsByISO map[string][]Subdivision
)

func load() {
	loadOnce.Do(func() {
		if err := json.Unmarshal(countriesJSON, &countries); err != nil {
			panic("worldref: bad embedded countries: " + err.Error())
		}
		if err := json.Unmarshal(subdivisionsJSON, &subs); err != nil {
			panic("worldref: bad embedded subdivisions: " + err.Error())
		}
		byISO2 = make(map[string]*Country, len(countries))
		for i := range countries {
			byISO2[countries[i].ISO2] = &countries[i]
		}
		subsByISO = map[string][]Subdivision{}
		for _, s := range subs {
			subsByISO[s.ISO2] = append(subsByISO[s.ISO2], s)
		}
	})
}

// Countries returns all records, in the dataset's order. The slice is a copy;
// the records' nested slices are shared and must not be modified.
func Countries() []Country {
	load()
	return append([]Country(nil), countries...)
}

// ByISO2 finds a country by its ISO 3166-1 alpha-2 code, ignoring case.
func ByISO2(iso2 string) (Country, bool) {
	load()
	c, ok := byISO2[strings.ToUpper(iso2)]
	if !ok {
		return Country{}, false
	}
	return *c, true
}

// Subdivisions returns every ISO 3166-2 subdivision.
func Subdivisions() []Subdivision {
	load()
	return append([]Subdivision(nil), subs...)
}

// SubdivisionsOf returns the subdivisions of one country, by alpha-2 code (case-insensitive).
func SubdivisionsOf(iso2 string) []Subdivision {
	load()
	return append([]Subdivision(nil), subsByISO[strings.ToUpper(iso2)]...)
}

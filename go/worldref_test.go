package worldref

import (
	"encoding/json"
	"os"
	"reflect"
	"strings"
	"testing"
)

type vectors struct {
	WesternDigits [][2]string `json:"westernDigits"`
	Normalize     [][2]string `json:"normalize"`
	Search        []struct {
		Query string  `json:"query"`
		Lang  Lang    `json:"lang"`
		First *string `json:"first"`
		Count *int    `json:"count"`
	} `json:"search"`
	Sort []struct {
		Lang  Lang     `json:"lang"`
		First *string  `json:"first"`
		Head  []string `json:"head"`
	} `json:"sort"`
	Phone []struct {
		Input   string `json:"input"`
		Country string `json:"country"`
		E164    string `json:"e164"`
		ISO2    string `json:"iso2"`
		Valid   bool   `json:"valid"`
		Mobile  bool   `json:"mobile"`
	} `json:"phone"`
	Absent      []string `json:"absent"`
	AddressForm []struct {
		ISO2  string    `json:"iso2"`
		Lang  Lang      `json:"lang"`
		Lines [][][]any `json:"lines"`
	} `json:"addressForm"`
	EditDistance [][4]any `json:"editDistance"`
}

func loadVectors(t *testing.T) vectors {
	t.Helper()
	raw, err := os.ReadFile("../tests/vectors.json")
	if err != nil {
		t.Fatal(err)
	}
	var v vectors
	if err := json.Unmarshal(raw, &v); err != nil {
		t.Fatal(err)
	}
	return v
}

func TestData(t *testing.T) {
	if n := len(Countries()); n != 242 {
		t.Fatalf("countries = %d, want 242", n)
	}
	sa, ok := ByISO2("sa")
	if !ok || sa.ISO2 != "SA" || sa.NameEN != "Saudi Arabia" {
		t.Fatalf("ByISO2(sa) = %+v, %v", sa.ISO2, ok)
	}
	if _, ok := ByISO2("ZZ"); ok {
		t.Fatal("ZZ should not exist")
	}
	if len(Subdivisions()) != 5012 || len(SubdivisionsOf("ad")) == 0 {
		t.Fatal("subdivisions not loaded")
	}
}

func TestAbsent(t *testing.T) {
	v := loadVectors(t)
	for _, w := range v.Absent {
		if _, ok := ByISO2(w); ok {
			t.Errorf("%s present", w)
		}
		for _, c := range Countries() {
			if c.ISO3 != nil && *c.ISO3 == w {
				t.Errorf("%s present as ISO3", w)
			}
		}
		if hits := Search(Countries(), w, EN); len(w) > 3 && len(hits) != 0 {
			t.Errorf("search %q returned %d hits", w, len(hits))
		}
	}
	for _, b := range [][]byte{countriesJSON, subdivisionsJSON} {
		for _, w := range v.Absent {
			if len(w) > 3 && strings.Contains(string(b), w) {
				t.Errorf("data contains %q", w)
			}
		}
	}
}

func TestWesternDigits(t *testing.T) {
	for _, c := range loadVectors(t).WesternDigits {
		if got := WesternDigits(c[0]); got != c[1] {
			t.Errorf("WesternDigits(%q) = %q, want %q", c[0], got, c[1])
		}
	}
}

func TestNormalize(t *testing.T) {
	for _, c := range loadVectors(t).Normalize {
		if got := Normalize(c[0]); got != c[1] {
			t.Errorf("Normalize(%q) = %q, want %q", c[0], got, c[1])
		}
	}
}

func TestSearch(t *testing.T) {
	all := Countries()
	v := loadVectors(t)
	if len(v.Search) == 0 {
		t.Fatal("no search vectors")
	}
	for _, c := range v.Search {
		hits := Search(all, c.Query, c.Lang)
		if c.Count != nil && len(hits) != *c.Count {
			t.Errorf("%q: %d hits, want %d", c.Query, len(hits), *c.Count)
		}
		if c.First != nil && (len(hits) == 0 || hits[0].ISO2 != *c.First) {
			t.Errorf("%q: first = %v, want %s", c.Query, firstOf(hits), *c.First)
		}
	}
}

func firstOf(hits []Country) string {
	if len(hits) == 0 {
		return "none"
	}
	return hits[0].ISO2
}

func TestSort(t *testing.T) {
	all := Countries()
	for _, c := range loadVectors(t).Sort {
		first := ""
		if c.First != nil {
			first = *c.First
		}
		sorted := SortCountries(all, c.Lang, first)
		var head []string
		for _, x := range sorted[:len(c.Head)] {
			head = append(head, x.ISO2)
		}
		if !reflect.DeepEqual(head, c.Head) {
			t.Errorf("sort %s %q: %v, want %v", c.Lang, first, head, c.Head)
		}
	}
}

func TestPhone(t *testing.T) {
	all := Countries()
	for _, c := range loadVectors(t).Phone {
		country, _ := ByISO2(c.Country)
		p := ParsePhone(c.Input, country, all)
		if p == nil {
			t.Errorf("%q: nil", c.Input)
			continue
		}
		if p.E164 != c.E164 || p.ISO2 != c.ISO2 || p.Valid != c.Valid || p.Mobile != c.Mobile {
			t.Errorf("%q: got %+v, want %+v", c.Input, *p, c)
		}
	}
}

func TestMobileAndFormat(t *testing.T) {
	sa, _ := ByISO2("SA")
	all := Countries()
	if !IsValidMobile("0501234567", sa, all) || IsValidMobile("0112345678", sa, all) {
		t.Error("IsValidMobile")
	}
	if IsValidMobile("+971501234567", sa, all) {
		t.Error("a number of another country must not be a valid SA mobile")
	}
	if got := FormatNational("512345678", sa.Phone[0]); got != "51 234 5678" {
		t.Errorf("FormatNational = %q", got)
	}
	if got := FormatNational("5123", sa.Phone[0]); got != "5123" {
		t.Errorf("mismatched mask must return digits, got %q", got)
	}
}

func TestAddressForm(t *testing.T) {
	v := loadVectors(t)
	if len(v.AddressForm) == 0 {
		t.Fatal("no addressForm vectors")
	}
	for _, c := range v.AddressForm {
		country, ok := ByISO2(c.ISO2)
		if !ok {
			t.Errorf("%s: unknown country", c.ISO2)
			continue
		}
		got := [][][]any{}
		for _, line := range AddressForm(country, c.Lang) {
			row := [][]any{}
			for _, f := range line {
				var label any
				if f.Label != nil {
					label = *f.Label
				}
				row = append(row, []any{f.Field, label, f.Required})
			}
			got = append(got, row)
		}
		if !reflect.DeepEqual(got, c.Lines) {
			t.Errorf("AddressForm(%s, %s) = %v, want %v", c.ISO2, c.Lang, got, c.Lines)
		}
	}
}

func TestEditDistance(t *testing.T) {
	v := loadVectors(t)
	if len(v.EditDistance) == 0 {
		t.Fatal("no editDistance vectors")
	}
	for _, c := range v.EditDistance {
		a, b := c[0].(string), c[1].(string)
		limit, want := int(c[2].(float64)), int(c[3].(float64))
		if got := EditDistance(a, b, limit); got != want {
			t.Errorf("EditDistance(%q, %q, %d) = %d, want %d", a, b, limit, got, want)
		}
	}
}

package worldref

import (
	"sort"
	"strings"
	"unicode"
	"unicode/utf8"
)

type scored struct {
	c     Country
	score float64
}

func isSpaceOrSep(r rune) bool {
	return unicode.IsSpace(r) || r == 0xFEFF || r == '(' || r == ')' || r == '-'
}

// dialQuery returns the digits of a query that looks like a dial code (1 to 4
// digits, optional "+" or "00" prefix), or "" when it does not.
func dialQuery(query string) string {
	digits := strings.Map(func(r rune) rune {
		if isSpaceOrSep(r) {
			return -1
		}
		return r
	}, WesternDigits(query))
	rest := strings.TrimPrefix(digits, "+")
	if rest == digits {
		rest = strings.TrimPrefix(digits, "00")
	}
	if len(rest) < 1 || len(rest) > 4 {
		return ""
	}
	for _, r := range rest {
		if r < '0' || r > '9' {
			return ""
		}
	}
	return rest
}

func rank(name, q string, place float64) float64 {
	switch {
	case name == q:
		return 50 - place
	case strings.HasPrefix(name, q):
		return 40 - place
	}
	for _, w := range strings.Split(name, " ") {
		if strings.HasPrefix(w, q) {
			return 30 - place
		}
	}
	if utf8.RuneCountInString(q) >= 3 && strings.Contains(name, q) {
		return 10 - place
	}
	return 0
}

func sortKey(c *Country, lang Lang) string {
	if lang == AR {
		return c.SortAR
	}
	return c.SortEN
}

// Search returns the countries matching a query, best first. It matches names
// and aliases in both languages (ignoring the "al" prefix, tashkeel, hamza
// forms, case and accents), ISO codes, and dial codes with or without "+" or "00".
func Search(list []Country, query string, lang Lang) []Country {
	q := Normalize(query)
	if q == "" {
		return []Country{}
	}
	dial := dialQuery(query)
	upper := strings.ToUpper(strings.TrimSpace(query))
	var hits []scored
	for _, c := range list {
		own, other := c.NameEN, c.NameAR
		if lang == AR {
			own, other = c.NameAR, c.NameEN
		}
		score := rank(Normalize(own), q, 0)
		score = max(score, rank(Normalize(other), q, 1))
		for _, a := range c.AliasesAR {
			score = max(score, rank(Normalize(a), q, 2))
		}
		for _, a := range c.AliasesEN {
			score = max(score, rank(Normalize(a), q, 2))
		}
		if upper == c.ISO2 || (c.ISO3 != nil && upper == *c.ISO3) {
			score = max(score, 49.5)
		}
		if dial != "" {
			exact, primary, prefix := false, false, false
			for _, p := range c.Phone {
				cc := strings.TrimPrefix(p.CallingCode, "+")
				if cc == dial {
					exact = true
					primary = primary || p.Primary
				}
				if strings.HasPrefix(cc, dial) {
					prefix = true
				}
			}
			switch {
			case exact && primary:
				score = max(score, 46)
			case exact:
				score = max(score, 45)
			case prefix:
				score = max(score, 5)
			}
		}
		if score > 0 {
			hits = append(hits, scored{c, score})
		}
	}
	sort.SliceStable(hits, func(i, j int) bool {
		if hits[i].score != hits[j].score {
			return hits[i].score > hits[j].score
		}
		return sortKey(&hits[i].c, lang) < sortKey(&hits[j].c, lang)
	})
	out := make([]Country, len(hits))
	for i, h := range hits {
		out[i] = h.c
	}
	return out
}

// SortCountries orders countries alphabetically in the UI language, with the
// country whose ISO2 equals first (if not empty) pinned to the top. It returns a new slice.
func SortCountries(list []Country, lang Lang, first string) []Country {
	out := append([]Country(nil), list...)
	pin := strings.ToUpper(first)
	sort.SliceStable(out, func(i, j int) bool {
		a, b := &out[i], &out[j]
		if pin != "" && a.ISO2 == pin {
			return b.ISO2 != pin
		}
		if pin != "" && b.ISO2 == pin {
			return false
		}
		return sortKey(a, lang) < sortKey(b, lang)
	})
	return out
}

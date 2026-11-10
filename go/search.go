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

func compact(s string) string {
	return strings.ReplaceAll(s, " ", "")
}

// rank scores one normalized name against the query q (qc is q without spaces).
// Tiers: exact (50s), name starts with the query (40s), a word starts with it
// (30s), contains it (10s); place orders the UI-language name, the other
// language, then aliases within a tier.
func rank(name, q, qc string, place float64) float64 {
	nc := compact(name)
	switch {
	case name == q || nc == qc:
		return 50 - place
	case strings.HasPrefix(name, q) || (utf8.RuneCountInString(qc) >= 3 && strings.HasPrefix(nc, qc)):
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

func allDigits(s string) bool {
	for i := 0; i < len(s); i++ {
		if s[i] < '0' || s[i] > '9' {
			return false
		}
	}
	return s != ""
}

// EditDistance is the optimal string alignment distance between a and b
// (insertions, deletions, substitutions, adjacent swaps), compared by rune.
// It returns limit + 1 as soon as the distance must exceed limit.
func EditDistance(a, b string, limit int) int {
	ra, rb := []rune(a), []rune(b)
	diff := len(ra) - len(rb)
	if diff < 0 {
		diff = -diff
	}
	if diff > limit {
		return limit + 1
	}
	var prev2 []int
	prev := make([]int, len(rb)+1)
	for j := range prev {
		prev[j] = j
	}
	for i := 1; i <= len(ra); i++ {
		cur := make([]int, len(rb)+1)
		cur[0] = i
		low := i
		for j := 1; j <= len(rb); j++ {
			cost := 1
			if ra[i-1] == rb[j-1] {
				cost = 0
			}
			v := min(prev[j]+1, cur[j-1]+1, prev[j-1]+cost)
			if i > 1 && j > 1 && ra[i-1] == rb[j-2] && ra[i-2] == rb[j-1] {
				v = min(v, prev2[j-2]+1)
			}
			cur[j] = v
			low = min(low, v)
		}
		if low > limit {
			return limit + 1
		}
		prev2, prev = prev, cur
	}
	return prev[len(rb)]
}

func sortKey(c *Country, lang Lang) string {
	if lang == AR {
		return c.SortAR
	}
	return c.SortEN
}

// Search returns the countries matching a query, best first. It matches names
// and aliases in both languages (ignoring the "al" prefix, tashkeel, hamza
// forms, case, accents, spaces and punctuation), ISO codes, and dial codes with
// or without "+" or "00". When nothing matches, a second pass forgives small
// typos ("Kuwiat"): 1 edit for 4 to 7 letters, 2 from 8.
func Search(list []Country, query string, lang Lang) []Country {
	q := Normalize(query)
	if q == "" {
		return []Country{}
	}
	qc := compact(q)
	dial := dialQuery(query)
	upper := strings.ToUpper(strings.TrimSpace(query))
	var hits []scored
	for _, c := range list {
		own, other := c.NameEN, c.NameAR
		if lang == AR {
			own, other = c.NameAR, c.NameEN
		}
		score := rank(Normalize(own), q, qc, 0)
		score = max(score, rank(Normalize(other), q, qc, 1))
		for _, a := range c.AliasesAR {
			score = max(score, rank(Normalize(a), q, qc, 2))
		}
		for _, a := range c.AliasesEN {
			score = max(score, rank(Normalize(a), q, qc, 2))
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
	if n := utf8.RuneCountInString(qc); len(hits) == 0 && n >= 4 && !allDigits(qc) {
		// Typo pass: edit distance between the query and whole names, spaces ignored.
		limit := 1
		if n >= 8 {
			limit = 2
		}
		for _, c := range list {
			names := []string{c.NameEN, c.NameAR}
			if lang == AR {
				names = []string{c.NameAR, c.NameEN}
			}
			names = append(append(names, c.AliasesAR...), c.AliasesEN...)
			best := 0.0
			for i, name := range names {
				if d := EditDistance(qc, compact(Normalize(name)), limit); d <= limit {
					best = max(best, 3-float64(d)-float64(min(i, 2))*0.25)
				}
			}
			if best > 0 {
				hits = append(hits, scored{c, best})
			}
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

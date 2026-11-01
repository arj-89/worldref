package worldref

import (
	"regexp"
	"sort"
	"strings"
	"sync"
)

var (
	reMu    sync.RWMutex
	reCache = map[string]*regexp.Regexp{}
)

// compiled returns the cached regexp for an expression; invalid data patterns never match.
func compiled(expr string) *regexp.Regexp {
	reMu.RLock()
	re, ok := reCache[expr]
	reMu.RUnlock()
	if ok {
		return re
	}
	re, err := regexp.Compile(expr)
	if err != nil {
		re = nil
	}
	reMu.Lock()
	reCache[expr] = re
	reMu.Unlock()
	return re
}

func fullMatch(pattern *string, s string) bool {
	if pattern == nil || *pattern == "" {
		return false
	}
	re := compiled("^(?:" + *pattern + ")$")
	return re != nil && re.MatchString(s)
}

func prefixMatch(pattern string, s string) bool {
	re := compiled("^(?:" + pattern + ")")
	return re != nil && re.MatchString(s)
}

type candidate struct {
	iso2 string
	plan *PhonePlan
	rest string
}

// ParsePhone reads what a user typed into a phone field. country is the one
// picked in the field; numbers typed with "+" or "00" are matched against all
// (or country alone when all is nil). It returns nil when no plan applies.
func ParsePhone(input string, country Country, all []Country) *ParsedPhone {
	s := strings.Map(func(r rune) rune {
		if (r >= '0' && r <= '9') || r == '+' {
			return r
		}
		return -1
	}, WesternDigits(input))
	if s == "" {
		return nil
	}
	var plans []candidate
	if strings.HasPrefix(s, "+") || strings.HasPrefix(s, "00") {
		if strings.HasPrefix(s, "+") {
			s = s[1:]
		} else {
			s = s[2:]
		}
		pool := all
		if pool == nil {
			pool = []Country{country}
		}
		for ci := range pool {
			c := &pool[ci]
			for pi := range c.Phone {
				plan := &c.Phone[pi]
				cc := strings.TrimPrefix(plan.CallingCode, "+")
				if !strings.HasPrefix(s, cc) {
					continue
				}
				rest := s[len(cc):]
				if plan.LeadingDigits != nil && *plan.LeadingDigits != "" && !prefixMatch(*plan.LeadingDigits, rest) {
					continue
				}
				plans = append(plans, candidate{c.ISO2, plan, rest})
			}
		}
		weight := func(p candidate) int {
			w := 0
			if p.iso2 == country.ISO2 {
				w += 16
			}
			if p.plan.LeadingDigits != nil && *p.plan.LeadingDigits != "" {
				w += 8
			}
			if fullMatch(p.plan.MobilePattern, p.rest) {
				w += 4
			}
			if !p.plan.Primary && fullMatch(p.plan.Pattern, p.rest) {
				w += 2
			}
			if p.plan.Primary {
				w++
			}
			return w
		}
		sort.SliceStable(plans, func(i, j int) bool { return weight(plans[i]) > weight(plans[j]) })
	} else {
		for i := range country.Phone {
			plan := &country.Phone[i]
			rest := s
			if plan.TrunkPrefix != nil && *plan.TrunkPrefix != "" && strings.HasPrefix(s, *plan.TrunkPrefix) && !fullMatch(plan.Pattern, s) {
				rest = s[len(*plan.TrunkPrefix):]
			}
			plans = append(plans, candidate{country.ISO2, plan, rest})
		}
	}
	if len(plans) == 0 {
		return nil
	}
	pick := plans[0]
	for _, p := range plans {
		if fullMatch(p.plan.Pattern, p.rest) {
			pick = p
			break
		}
	}
	return &ParsedPhone{
		E164:        pick.plan.CallingCode + pick.rest,
		ISO2:        pick.iso2,
		CallingCode: pick.plan.CallingCode,
		National:    pick.rest,
		Valid:       fullMatch(pick.plan.Pattern, pick.rest),
		Mobile:      fullMatch(pick.plan.MobilePattern, pick.rest),
	}
}

// IsValidMobile reports whether the input is a valid mobile number for the
// country. When all is given, a number that resolves to another country is not valid.
func IsValidMobile(input string, country Country, all []Country) bool {
	p := ParsePhone(input, country, all)
	return p != nil && p.Valid && p.Mobile && (all == nil || p.ISO2 == country.ISO2)
}

// FormatNational groups national digits with the plan's mobile_format mask
// ("### ### ####" style); it returns the digits unchanged when the mask does not fit.
func FormatNational(national string, plan PhonePlan) string {
	if plan.MobileFormat == nil || *plan.MobileFormat == "" {
		return national
	}
	mask := *plan.MobileFormat
	if strings.Count(mask, "#") != len(national) {
		return national
	}
	var b strings.Builder
	i := 0
	for _, r := range mask {
		if r == '#' {
			b.WriteByte(national[i])
			i++
		} else {
			b.WriteRune(r)
		}
	}
	return b.String()
}

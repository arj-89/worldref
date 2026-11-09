package worldref

import (
	"strings"
	"unicode/utf8"
)

// AddressFormField is one field of a country's address form. Field is one of
// "name", "organization", "street", "sublocality", "city", "region",
// "postal_code", "sorting_code".
type AddressFormField struct {
	Field string
	// Label is in the requested language; nil when the data has no label in that language.
	Label    *string
	Required bool
}

var addressTokens = map[byte]string{
	'N': "name", 'O': "organization", 'A': "street", 'D': "sublocality",
	'C': "city", 'S': "region", 'Z': "postal_code", 'X': "sorting_code",
}

var fixedLabels = map[string][2]string{
	"name":         {"الاسم", "Name"},
	"organization": {"المنشأة", "Organization"},
	"street":       {"العنوان", "Street address"},
	"sorting_code": {"رمز الفرز", "Sorting code"},
}

const defaultAddressFormat = "%N%n%O%n%A%n%C"

// AddressForm returns the address form of a country: its fields line by line,
// in the country's order, with labels in lang and whether the postal service
// requires each one. Tokens the format uses beyond Google's nine are skipped.
func AddressForm(country Country, lang Lang) [][]AddressFormField {
	a := &country.Address
	pick := func(ar, en *string) *string {
		if lang == AR {
			return ar
		}
		return en
	}
	labelOf := func(f string) *string {
		if fixed, ok := fixedLabels[f]; ok {
			s := fixed[1]
			if lang == AR {
				s = fixed[0]
			}
			return &s
		}
		switch f {
		case "city":
			return pick(a.LocalityLabelAR, a.LocalityLabelEN)
		case "sublocality":
			return pick(a.SublocalityLabelAR, a.SublocalityLabelEN)
		case "region":
			s := pick(a.RegionLabelAR, a.RegionLabelEN)
			if s != nil && *s != "" && lang != AR {
				r, size := utf8.DecodeRuneInString(*s)
				capped := strings.ToUpper(string(r)) + (*s)[size:]
				return &capped
			}
			return s
		}
		return pick(a.PostalCodeLabelAR, a.PostalCodeLabelEN)
	}
	required := func(f string) bool {
		for _, r := range a.RequiredFields {
			if r == f {
				return true
			}
		}
		return false
	}
	format := defaultAddressFormat
	if a.AddressFormat != nil {
		format = *a.AddressFormat
	}
	seen := map[string]bool{}
	out := [][]AddressFormField{}
	for _, line := range strings.Split(format, "%n") {
		var fields []AddressFormField
		for i := 0; i+1 < len(line); i++ {
			if line[i] != '%' || line[i+1] < 'A' || line[i+1] > 'Z' {
				continue
			}
			f, ok := addressTokens[line[i+1]]
			i++
			if !ok || seen[f] {
				continue
			}
			seen[f] = true
			fields = append(fields, AddressFormField{Field: f, Label: labelOf(f), Required: required(f)})
		}
		if len(fields) > 0 {
			out = append(out, fields)
		}
	}
	return out
}

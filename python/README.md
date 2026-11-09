# worldref (Python)

242 countries and territories in Arabic and English: names, aliases, phone plans, currencies, geo, locale, addresses, subdivisions, plus search, sorting, phone parsing and address forms. Standard library only, Python 3.9 or newer.

## Install

```sh
pip install worldref
```

## Usage

```python
from worldref import countries, by_iso2, search, sort_countries, parse_phone, address_form, subdivisions

sa = by_iso2("sa")
print(sa.name_ar, sa.name_en, sa.flag)                  # السعودية Saudi Arabia 🇸🇦
print([c.iso2 for c in search(countries(), "سعودية", "ar")][:3])
print(search(countries(), "Kuwiat")[0].iso2)            # KW (small typos are forgiven when nothing matches)
print([c.name_en for c in sort_countries(countries(), "en", first="SA")][:3])
p = parse_phone("0501234567", sa, countries())
print(p.e164, p.valid, p.mobile)                        # +966501234567 True True
for line in address_form(sa, "ar"):                     # the address fields line by line
    print([(f.field, f.label, f.required) for f in line])
print(len(subdivisions("SA")))
```

# worldref (Python)

242 countries and territories in Arabic and English: names, aliases, phone plans, currencies, geo, locale, subdivisions, plus search, sorting and phone parsing. Standard library only, Python 3.9 or newer.

## Install

```sh
pip install "git+https://github.com/arj-89/worldref@v1.1.0#subdirectory=python"
```

## Usage

```python
from worldref import countries, by_iso2, search, sort_countries, parse_phone, subdivisions

sa = by_iso2("sa")
print(sa.name_ar, sa.name_en, sa.flag)                  # السعودية Saudi Arabia 🇸🇦
print([c.iso2 for c in search(countries(), "سعودية", "ar")][:3])
print([c.name_en for c in sort_countries(countries(), "en", first="SA")][:3])
p = parse_phone("0501234567", sa, countries())
print(p.e164, p.valid, p.mobile)                        # +966501234567 True True
print(len(subdivisions("SA")))
```

# worldref for PHP

242 countries and territories in Arabic and English, with phone plans, currencies, subdivisions, search and sorting. PHP 8.1+, no runtime dependencies (needs ext-intl, ext-mbstring, ext-json).

## Install

```sh
composer require arj-89/worldref
```

This works in Laravel and plain PHP. The data is read from the package's `data/` folder.


## Usage

```php
use WorldRef\WorldRef;

$all = WorldRef::countries();                       // list<Country>
$sa  = WorldRef::byIso2('sa');                      // case-insensitive
echo $sa->name_ar, ' ', $sa->geo->capital_en;       // السعودية Riyadh
$hits = WorldRef::search($all, 'السعودية', 'ar');   // best first
$list = WorldRef::sortCountries($all, 'ar', 'SA');  // Saudi Arabia pinned first
$p = WorldRef::parsePhone('0501234567', $sa, $all); // ParsedPhone: e164, iso2, valid, mobile
echo $p->e164;                                      // +966501234567
$ok = WorldRef::isValidMobile('0501234567', $sa);   // true
$subs = WorldRef::subdivisions('SA');               // list<Subdivision>
```

`WorldRef::normalize()` and `WorldRef::westernDigits()` expose the text folding used by search.

## Tests

From the repo root: `php php/tests/run.php`. It runs the shared `tests/vectors.json` and exits non-zero on any failure.

## Notes

Without ext-intl, `Text::normalize` cannot do NFD; the package requires it because Arabic hamza and Latin accent folding depend on decomposition.

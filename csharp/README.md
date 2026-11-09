# worldref for C# (.NET)

Offline reference data for 242 countries and territories in Arabic and English: names, flags, dial plans, currencies, geography, subdivisions. Search, sorting and phone parsing behave identically to the JavaScript package.

The library targets net8.0 and has no dependencies beyond the base library. The data is embedded in the assembly.

## Install

```sh
dotnet add package WorldRef
```


## Usage

```csharp
using WorldRef;

var sa = Dataset.Find("sa")!;                                   // case-insensitive
Console.WriteLine($"{sa.Flag} {sa.NameAr} / {sa.NameEn}");
var hits = Lookup.Search(Dataset.Countries, "السعودية", Lang.Ar); // best match first
var typo = Lookup.Search(Dataset.Countries, "Kuwiat");          // forgives small typos when nothing else matches: KW
Lookup.Search(Dataset.Countries, "unitedstates");               // spaces are optional: US
var sorted = Lookup.SortCountries(Dataset.Countries, Lang.Ar, first: "SA");
var phone = Lookup.ParsePhone("0501234567", sa, Dataset.Countries);
Console.WriteLine($"{phone?.E164} valid={phone?.Valid} mobile={phone?.Mobile}");
Console.WriteLine(Lookup.IsValidMobile("+966501234567", sa, Dataset.Countries));
Console.WriteLine(Text.Normalize("المملكة العربية السعودية"));     // folded form used for matching
Console.WriteLine(Dataset.SubdivisionsOf("SA").Count);
foreach (var line in Lookup.AddressForm(sa, Lang.Ar))           // address fields line by line, in the country's order
    Console.WriteLine(string.Join(" | ", line.Select(f => $"{f.Label}{(f.Required ? " *" : "")}")));
```

`Search` matches names with or without spaces. When nothing matches, a second pass forgives small typos: 1 edit for queries of 4 to 7 letters, 2 from 8. `Lookup.EditDistance(a, b, limit)` is the distance it uses.

`AddressForm` returns lines of `AddressFormField(Field, Label, Required)`. `Field` is one of `name`, `organization`, `street`, `sublocality`, `city`, `region`, `postal_code`, `sorting_code`; `Label` is null when the data has no label in that language.

Models are records (`Country`, `PhonePlan`, `Currency`, `Subdivision`, ...) with PascalCase properties mapped from the snake_case JSON fields, for example `NameAr`, `Geo.AreaKm2`, `Phone[0].MobilePattern`.

## Tests

```sh
cd csharp && dotnet test
```

The suite loads `tests/vectors.json` from the repository root, so run it from a full checkout.

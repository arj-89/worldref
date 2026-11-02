# worldref for C# (.NET)

Offline reference data for 242 countries and territories in Arabic and English: names, flags, dial plans, currencies, geography, subdivisions. Search, sorting and phone parsing behave identically to the JavaScript package.

The library targets net8.0 and has no dependencies beyond the base library. The data is embedded in the assembly.

## Install

There is no NuGet package. Take the source from GitHub (github.com/arj-89/worldref, tag v1.1.0) and add it as a project reference.

```sh
# Option 1: git submodule
git submodule add https://github.com/arj-89/worldref vendor/worldref && git -C vendor/worldref checkout v1.1.0
dotnet add reference vendor/worldref/csharp/WorldRef/WorldRef.csproj

# Option 2: download the v1.1.0 release zip, copy the csharp/WorldRef folder into your solution
dotnet add reference path/to/WorldRef/WorldRef.csproj
```

## Usage

```csharp
using WorldRef;

var sa = Dataset.Find("sa")!;                                   // case-insensitive
Console.WriteLine($"{sa.Flag} {sa.NameAr} / {sa.NameEn}");
var hits = Lookup.Search(Dataset.Countries, "السعودية", Lang.Ar); // best match first
var sorted = Lookup.SortCountries(Dataset.Countries, Lang.Ar, first: "SA");
var phone = Lookup.ParsePhone("0501234567", sa, Dataset.Countries);
Console.WriteLine($"{phone?.E164} valid={phone?.Valid} mobile={phone?.Mobile}");
Console.WriteLine(Lookup.IsValidMobile("+966501234567", sa, Dataset.Countries));
Console.WriteLine(Text.Normalize("المملكة العربية السعودية"));     // folded form used for matching
Console.WriteLine(Dataset.SubdivisionsOf("SA").Count);
```

Models are records (`Country`, `PhonePlan`, `Currency`, `Subdivision`, ...) with PascalCase properties mapped from the snake_case JSON fields, for example `NameAr`, `Geo.AreaKm2`, `Phone[0].MobilePattern`.

## Tests

```sh
cd csharp && dotnet test
```

The suite loads `tests/vectors.json` from the repository root, so run it from a full checkout.

using System.Reflection;
using System.Text.Json;

namespace WorldRef;

/// <summary>The bundled dataset: 242 countries and territories, and their subdivisions.</summary>
public static class Dataset
{
    static readonly JsonSerializerOptions Options = new() { PropertyNamingPolicy = JsonNamingPolicy.SnakeCaseLower };

    static readonly Lazy<IReadOnlyList<Country>> all = new(() => Load<Country>("WorldRef.Data.worldref.json"));
    static readonly Lazy<IReadOnlyList<Subdivision>> subdivisions = new(() => Load<Subdivision>("WorldRef.Data.subdivisions.json"));
    static readonly Lazy<Dictionary<string, Country>> byIso2 = new(() => all.Value.ToDictionary(c => c.Iso2, StringComparer.OrdinalIgnoreCase));
    static readonly Lazy<ILookup<string, Subdivision>> subsByCountry = new(() => subdivisions.Value.ToLookup(s => s.Iso2, StringComparer.OrdinalIgnoreCase));

    static IReadOnlyList<T> Load<T>(string name)
    {
        using var stream = typeof(Dataset).Assembly.GetManifestResourceStream(name)
            ?? throw new InvalidOperationException($"Missing embedded resource {name}");
        return JsonSerializer.Deserialize<List<T>>(stream, Options)!;
    }

    /// <summary>Every country and territory, in dataset order.</summary>
    public static IReadOnlyList<Country> Countries => all.Value;

    /// <summary>Every subdivision of every country.</summary>
    public static IReadOnlyList<Subdivision> Subdivisions => subdivisions.Value;

    /// <summary>The country with this ISO 3166-1 alpha-2 code (case-insensitive), or null.</summary>
    public static Country? Find(string iso2) => byIso2.Value.GetValueOrDefault(iso2);

    /// <summary>Subdivisions of one country (case-insensitive iso2); empty when there are none.</summary>
    public static IReadOnlyList<Subdivision> SubdivisionsOf(string iso2) => subsByCountry.Value[iso2].ToList();
}

using System.Text.Json;
using WorldRef;
using Xunit;

namespace WorldRef.Tests;

public class VectorTests
{
    static readonly JsonElement V = LoadVectors();

    static JsonElement LoadVectors()
    {
        var dir = new DirectoryInfo(AppContext.BaseDirectory);
        while (dir != null && !File.Exists(Path.Combine(dir.FullName, "tests", "vectors.json"))) dir = dir.Parent;
        if (dir == null) throw new FileNotFoundException("tests/vectors.json not found above " + AppContext.BaseDirectory);
        return JsonDocument.Parse(File.ReadAllText(Path.Combine(dir.FullName, "tests", "vectors.json"))).RootElement;
    }

    static Lang L(string s) => s == "ar" ? Lang.Ar : Lang.En;

    [Fact]
    public void WesternDigits()
    {
        foreach (var c in V.GetProperty("westernDigits").EnumerateArray())
            Assert.Equal(c[1].GetString(), Text.WesternDigits(c[0].GetString()!));
    }

    [Fact]
    public void Normalize()
    {
        foreach (var c in V.GetProperty("normalize").EnumerateArray())
            Assert.Equal(c[1].GetString(), Text.Normalize(c[0].GetString()!));
    }

    [Fact]
    public void Search()
    {
        foreach (var c in V.GetProperty("search").EnumerateArray())
        {
            var q = c.GetProperty("query").GetString()!;
            var hits = Lookup.Search(Dataset.Countries, q, L(c.GetProperty("lang").GetString()!));
            if (c.TryGetProperty("count", out var count)) Assert.True(count.GetInt32() == hits.Count, $"{q}: count {hits.Count}");
            if (c.TryGetProperty("first", out var first) && first.ValueKind == JsonValueKind.String)
                Assert.True(first.GetString() == hits.FirstOrDefault()?.Iso2, $"{q} -> {string.Join(",", hits.Take(3).Select(h => h.Iso2))}");
        }
    }

    [Fact]
    public void Sort()
    {
        foreach (var c in V.GetProperty("sort").EnumerateArray())
        {
            var head = c.GetProperty("head").EnumerateArray().Select(x => x.GetString()!).ToList();
            var pin = c.GetProperty("first").GetString();
            var got = Lookup.SortCountries(Dataset.Countries, L(c.GetProperty("lang").GetString()!), pin).Take(head.Count).Select(x => x.Iso2).ToList();
            Assert.Equal(head, got);
        }
    }

    [Fact]
    public void Phone()
    {
        foreach (var c in V.GetProperty("phone").EnumerateArray())
        {
            var input = c.GetProperty("input").GetString()!;
            var p = Lookup.ParsePhone(input, Dataset.Find(c.GetProperty("country").GetString()!)!, Dataset.Countries);
            Assert.NotNull(p);
            Assert.Equal(c.GetProperty("e164").GetString(), p.E164);
            Assert.Equal(c.GetProperty("iso2").GetString(), p.Iso2);
            Assert.Equal(c.GetProperty("valid").GetBoolean(), p.Valid);
            Assert.Equal(c.GetProperty("mobile").GetBoolean(), p.Mobile);
        }
    }

    [Fact]
    public void AbsentEntries()
    {
        foreach (var a in V.GetProperty("absent").EnumerateArray())
        {
            var s = a.GetString()!;
            Assert.Null(Dataset.Find(s));
            Assert.DoesNotContain(Dataset.Countries, c => c.Iso2 == s || c.Iso3 == s || c.NameEn == s || c.NameAr == s);
            if (s.Length > 3) Assert.Empty(Lookup.Search(Dataset.Countries, s)); // codes are checked by exact lookup above; short queries prefix-match other names
        }
    }

    [Fact]
    public void DatasetLoadsFully()
    {
        Assert.Equal(242, Dataset.Countries.Count);
        Assert.Equal("SA", Dataset.Find("sa")!.Iso2);
        Assert.NotEmpty(Dataset.Subdivisions);
        Assert.NotEmpty(Dataset.SubdivisionsOf("sa"));
        // Snake-case mapping reached every nested field.
        Assert.All(Dataset.Countries, c => Assert.False(string.IsNullOrEmpty(c.NameAr) || string.IsNullOrEmpty(c.SortEn) || string.IsNullOrEmpty(c.FlagSvg)));
        Assert.Contains(Dataset.Countries, c => c.Geo.AreaKm2 != null && c.Geo.PopulationYear != null && c.Geo.CapitalEn != null);
        Assert.Contains(Dataset.Countries, c => c.Phone.Any(p => p.MobileFormat != null && p.CallingCode.StartsWith('+')));
        Assert.Contains(Dataset.Countries, c => c.Travel.FrequencyHz != null && c.Travel.Emergency?.Police != null);
    }

    [Fact]
    public void FormatNational()
    {
        var plan = Dataset.Find("SA")!.Phone[0];
        var formatted = Lookup.FormatNational("512345678", plan);
        Assert.Equal(9, formatted.Count(char.IsDigit));
        Assert.Equal("123", Lookup.FormatNational("123", plan));
    }
}

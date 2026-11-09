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
        var cases = V.GetProperty("search").EnumerateArray().ToList();
        Assert.NotEmpty(cases);
        foreach (var c in cases)
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
    public void AddressForm()
    {
        var cases = V.GetProperty("addressForm").EnumerateArray().ToList();
        Assert.NotEmpty(cases);
        foreach (var c in cases)
        {
            var iso2 = c.GetProperty("iso2").GetString()!;
            var lang = c.GetProperty("lang").GetString()!;
            var want = c.GetProperty("lines").EnumerateArray()
                .Select(line => line.EnumerateArray().Select(f => (f[0].GetString(), f[1].GetString(), f[2].GetBoolean())).ToList()).ToList();
            var got = Lookup.AddressForm(Dataset.Find(iso2)!, L(lang))
                .Select(line => line.Select(f => ((string?)f.Field, f.Label, f.Required)).ToList()).ToList();
            Assert.True(want.Count == got.Count && want.Zip(got).All(p => p.First.SequenceEqual(p.Second)),
                $"{iso2} {lang}: {string.Join(" | ", got.Select(l => string.Join(", ", l)))}");
        }
    }

    [Fact]
    public void EditDistance()
    {
        var cases = V.GetProperty("editDistance").EnumerateArray().ToList();
        Assert.NotEmpty(cases);
        foreach (var c in cases)
        {
            var (a, b) = (c[0].GetString()!, c[1].GetString()!);
            Assert.True(c[3].GetInt32() == Lookup.EditDistance(a, b, c[2].GetInt32()), $"{a} {b}");
        }
    }

    [Fact]
    public void NewModelFields()
    {
        Assert.Contains(Dataset.Countries, c => c.Geo.TimezoneOffsets.Any(o => o.Zone.Length > 0 && o.Standard.Length > 0 && o.Dst != null));
        Assert.All(Dataset.Countries, c => Assert.NotNull(c.Address.RequiredFields));
        Assert.Contains(Dataset.Countries, c => c.Address.LocalityLabelEn != null && c.Address.PostalCodeLabelAr != null);
        Assert.Contains(Dataset.Subdivisions, s => s.TypeAr != null && s.TypeEn != null);
    }

    [Fact]
    public void OldConstructorsStillWork()
    {
        // The 1.1.x argument lists must keep compiling and give empty or null 1.2.0 fields.
        var geo = new Geo("الرياض", "Riyadh", 24.7, 46.7, 2149690, 35300280, 2024, ["Asia/Riyadh"], "right");
        Assert.Empty(geo.TimezoneOffsets);
        var (capitalAr, _, _, _, _, _, _, timezones, drivingSide) = geo;
        Assert.Equal(("الرياض", "Asia/Riyadh", "right"), (capitalAr, timezones[0], drivingSide));

        var address = new Address("NNNNN", "^\\d{5}$", "11564", "%N%n%A%n%C %Z", "منطقة", "province");
        Assert.Empty(address.RequiredFields);
        Assert.Null(address.LocalityLabelEn);
        var (format, _, _, _, _, regionEn) = address;
        Assert.Equal(("NNNNN", "province"), (format, regionEn));

        var sub = new Subdivision("SA", "SA-01", "الرياض", "Riyadh", null);
        Assert.Null(sub.TypeAr);
        Assert.Null(sub.TypeEn);
        var (iso2, code, _, nameEn, parent) = sub;
        Assert.Equal(("SA", "SA-01", "Riyadh", (string?)null), (iso2, code, nameEn, parent));

        // The full constructors take the new fields at the end.
        Assert.Single(new Geo(null, null, null, null, null, null, null, [], null, [new TimezoneOffset("Asia/Riyadh", "+03:00", null)]).TimezoneOffsets);
        Assert.Equal("parish", new Subdivision("AD", "AD-02", null, null, null, TypeEn: "parish").TypeEn);
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

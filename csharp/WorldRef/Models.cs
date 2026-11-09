using System.Text.Json.Serialization;

namespace WorldRef;

public record PhonePlan(
    string CallingCode,
    string? LeadingDigits,
    bool Primary,
    string? TrunkPrefix,
    string? Pattern,
    int[] Lengths,
    string? MobilePattern,
    int[] MobileLengths,
    string[] MobilePrefixes,
    bool MobileDistinguishable,
    string? MobileExample,
    string? MobileFormat);

public record Currency(string Code, string? NameAr, string? NameEn, string? Symbol, string? SymbolAr, string? SymbolFallback);

public record Nationality(string? NationalityArM, string? NationalityArF, string? NationalityEn, string? IcaoCode);

public record Language(string Code, string? NameAr, string? NameEn);

public record Geo
{
    /// <summary>Creates a Geo; the fields added in 1.2.0 are optional.</summary>
    [JsonConstructor]
    public Geo(
        string? CapitalAr,
        string? CapitalEn,
        double? Lat,
        double? Lng,
        double? AreaKm2,
        long? Population,
        int? PopulationYear,
        string[] Timezones,
        string? DrivingSide,
        TimezoneOffset[]? TimezoneOffsets = null)
    {
        this.CapitalAr = CapitalAr;
        this.CapitalEn = CapitalEn;
        this.Lat = Lat;
        this.Lng = Lng;
        this.AreaKm2 = AreaKm2;
        this.Population = Population;
        this.PopulationYear = PopulationYear;
        this.Timezones = Timezones;
        this.DrivingSide = DrivingSide;
        this.TimezoneOffsets = TimezoneOffsets ?? [];
    }

    /// <summary>The 1.1.x constructor, kept for source and binary compatibility.</summary>
    public Geo(string? CapitalAr, string? CapitalEn, double? Lat, double? Lng, double? AreaKm2, long? Population, int? PopulationYear, string[] Timezones, string? DrivingSide)
        : this(CapitalAr, CapitalEn, Lat, Lng, AreaKm2, Population, PopulationYear, Timezones, DrivingSide, TimezoneOffsets: null) { }

    public string? CapitalAr { get; init; }
    public string? CapitalEn { get; init; }
    public double? Lat { get; init; }
    public double? Lng { get; init; }
    public double? AreaKm2 { get; init; }
    public long? Population { get; init; }
    public int? PopulationYear { get; init; }
    public string[] Timezones { get; init; }
    public string? DrivingSide { get; init; }
    public TimezoneOffset[] TimezoneOffsets { get; init; }

    public void Deconstruct(out string? CapitalAr, out string? CapitalEn, out double? Lat, out double? Lng, out double? AreaKm2, out long? Population, out int? PopulationYear, out string[] Timezones, out string? DrivingSide, out TimezoneOffset[] TimezoneOffsets) { CapitalAr = this.CapitalAr; CapitalEn = this.CapitalEn; Lat = this.Lat; Lng = this.Lng; AreaKm2 = this.AreaKm2; Population = this.Population; PopulationYear = this.PopulationYear; Timezones = this.Timezones; DrivingSide = this.DrivingSide; TimezoneOffsets = this.TimezoneOffsets; }

    /// <summary>The 1.1.x deconstruction, kept for source and binary compatibility.</summary>
    public void Deconstruct(out string? CapitalAr, out string? CapitalEn, out double? Lat, out double? Lng, out double? AreaKm2, out long? Population, out int? PopulationYear, out string[] Timezones, out string? DrivingSide) { CapitalAr = this.CapitalAr; CapitalEn = this.CapitalEn; Lat = this.Lat; Lng = this.Lng; AreaKm2 = this.AreaKm2; Population = this.Population; PopulationYear = this.PopulationYear; Timezones = this.Timezones; DrivingSide = this.DrivingSide; }
}

/// <summary>A time zone's UTC offsets, for example "+03:00"; <c>Dst</c> is null where the zone keeps no daylight saving time.</summary>
public record TimezoneOffset(string Zone, string Standard, string? Dst);

public record LocaleInfo(Language[] Languages, string WeekStart, string[] Weekend, string[] Calendars, string Measurement);

public record Address
{
    /// <summary>Creates an Address; the fields added in 1.2.0 are optional.</summary>
    [JsonConstructor]
    public Address(
        string? PostalCodeFormat,
        string? PostalCodeRegex,
        string? PostalCodeExample,
        string? AddressFormat,
        string? RegionLabelAr,
        string? RegionLabelEn,
        string? LocalityLabelAr = null,
        string? LocalityLabelEn = null,
        string? SublocalityLabelAr = null,
        string? SublocalityLabelEn = null,
        string? PostalCodeLabelAr = null,
        string? PostalCodeLabelEn = null,
        string[]? RequiredFields = null)
    {
        this.PostalCodeFormat = PostalCodeFormat;
        this.PostalCodeRegex = PostalCodeRegex;
        this.PostalCodeExample = PostalCodeExample;
        this.AddressFormat = AddressFormat;
        this.RegionLabelAr = RegionLabelAr;
        this.RegionLabelEn = RegionLabelEn;
        this.LocalityLabelAr = LocalityLabelAr;
        this.LocalityLabelEn = LocalityLabelEn;
        this.SublocalityLabelAr = SublocalityLabelAr;
        this.SublocalityLabelEn = SublocalityLabelEn;
        this.PostalCodeLabelAr = PostalCodeLabelAr;
        this.PostalCodeLabelEn = PostalCodeLabelEn;
        this.RequiredFields = RequiredFields ?? [];
    }

    /// <summary>The 1.1.x constructor, kept for source and binary compatibility.</summary>
    public Address(string? PostalCodeFormat, string? PostalCodeRegex, string? PostalCodeExample, string? AddressFormat, string? RegionLabelAr, string? RegionLabelEn)
        : this(PostalCodeFormat, PostalCodeRegex, PostalCodeExample, AddressFormat, RegionLabelAr, RegionLabelEn, LocalityLabelAr: null, LocalityLabelEn: null, SublocalityLabelAr: null, SublocalityLabelEn: null, PostalCodeLabelAr: null, PostalCodeLabelEn: null, RequiredFields: null) { }

    public string? PostalCodeFormat { get; init; }
    public string? PostalCodeRegex { get; init; }
    public string? PostalCodeExample { get; init; }
    public string? AddressFormat { get; init; }
    public string? RegionLabelAr { get; init; }
    public string? RegionLabelEn { get; init; }
    public string? LocalityLabelAr { get; init; }
    public string? LocalityLabelEn { get; init; }
    public string? SublocalityLabelAr { get; init; }
    public string? SublocalityLabelEn { get; init; }
    public string? PostalCodeLabelAr { get; init; }
    public string? PostalCodeLabelEn { get; init; }
    public string[] RequiredFields { get; init; }

    public void Deconstruct(out string? PostalCodeFormat, out string? PostalCodeRegex, out string? PostalCodeExample, out string? AddressFormat, out string? RegionLabelAr, out string? RegionLabelEn, out string? LocalityLabelAr, out string? LocalityLabelEn, out string? SublocalityLabelAr, out string? SublocalityLabelEn, out string? PostalCodeLabelAr, out string? PostalCodeLabelEn, out string[] RequiredFields) { PostalCodeFormat = this.PostalCodeFormat; PostalCodeRegex = this.PostalCodeRegex; PostalCodeExample = this.PostalCodeExample; AddressFormat = this.AddressFormat; RegionLabelAr = this.RegionLabelAr; RegionLabelEn = this.RegionLabelEn; LocalityLabelAr = this.LocalityLabelAr; LocalityLabelEn = this.LocalityLabelEn; SublocalityLabelAr = this.SublocalityLabelAr; SublocalityLabelEn = this.SublocalityLabelEn; PostalCodeLabelAr = this.PostalCodeLabelAr; PostalCodeLabelEn = this.PostalCodeLabelEn; RequiredFields = this.RequiredFields; }

    /// <summary>The 1.1.x deconstruction, kept for source and binary compatibility.</summary>
    public void Deconstruct(out string? PostalCodeFormat, out string? PostalCodeRegex, out string? PostalCodeExample, out string? AddressFormat, out string? RegionLabelAr, out string? RegionLabelEn) { PostalCodeFormat = this.PostalCodeFormat; PostalCodeRegex = this.PostalCodeRegex; PostalCodeExample = this.PostalCodeExample; AddressFormat = this.AddressFormat; RegionLabelAr = this.RegionLabelAr; RegionLabelEn = this.RegionLabelEn; }
}

public record Emergency(string? Police, string? Ambulance, string? Fire, string? General);

public record Travel(Emergency? Emergency, string[] PlugTypes, double[] Voltage, double[]? FrequencyHz);

public record Sports(string? Fifa, string? Ioc);

public record Country(
    string Iso2,
    string? Iso3,
    string? IsoNumeric,
    string Kind,
    string NameAr,
    string NameEn,
    string? OfficialNameAr,
    string? OfficialNameEn,
    string[] AliasesAr,
    string[] AliasesEn,
    string Flag,
    string FlagSvg,
    string? Continent,
    string[] Groups,
    bool UnMember,
    string? Tld,
    string SortAr,
    string SortEn,
    Nationality Nationality,
    PhonePlan[] Phone,
    Currency[] Currencies,
    Geo Geo,
    LocaleInfo Locale,
    Address Address,
    Travel Travel,
    Sports Sports);

public record Subdivision
{
    /// <summary>Creates a Subdivision; the fields added in 1.2.0 are optional.</summary>
    [JsonConstructor]
    public Subdivision(
        string Iso2,
        string Code,
        string? NameAr,
        string? NameEn,
        string? Parent,
        string? TypeAr = null,
        string? TypeEn = null)
    {
        this.Iso2 = Iso2;
        this.Code = Code;
        this.NameAr = NameAr;
        this.NameEn = NameEn;
        this.Parent = Parent;
        this.TypeAr = TypeAr;
        this.TypeEn = TypeEn;
    }

    /// <summary>The 1.1.x constructor, kept for source and binary compatibility.</summary>
    public Subdivision(string Iso2, string Code, string? NameAr, string? NameEn, string? Parent)
        : this(Iso2, Code, NameAr, NameEn, Parent, TypeAr: null, TypeEn: null) { }

    public string Iso2 { get; init; }
    public string Code { get; init; }
    public string? NameAr { get; init; }
    public string? NameEn { get; init; }
    public string? Parent { get; init; }
    public string? TypeAr { get; init; }
    public string? TypeEn { get; init; }

    public void Deconstruct(out string Iso2, out string Code, out string? NameAr, out string? NameEn, out string? Parent, out string? TypeAr, out string? TypeEn) { Iso2 = this.Iso2; Code = this.Code; NameAr = this.NameAr; NameEn = this.NameEn; Parent = this.Parent; TypeAr = this.TypeAr; TypeEn = this.TypeEn; }

    /// <summary>The 1.1.x deconstruction, kept for source and binary compatibility.</summary>
    public void Deconstruct(out string Iso2, out string Code, out string? NameAr, out string? NameEn, out string? Parent) { Iso2 = this.Iso2; Code = this.Code; NameAr = this.NameAr; NameEn = this.NameEn; Parent = this.Parent; }
}

public record ParsedPhone(string E164, string Iso2, string CallingCode, string National, bool Valid, bool Mobile);

/// <summary>
/// One field of an address form. <c>Field</c> is one of "name", "organization", "street", "sublocality", "city",
/// "region", "postal_code", "sorting_code". <c>Label</c> is in the requested language, or null when the data has none.
/// </summary>
public record AddressFormField(string Field, string? Label, bool Required);

public enum Lang { En, Ar }

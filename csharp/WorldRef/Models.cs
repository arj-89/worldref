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

public record Geo(
    string? CapitalAr,
    string? CapitalEn,
    double? Lat,
    double? Lng,
    double? AreaKm2,
    long? Population,
    int? PopulationYear,
    string[] Timezones,
    string? DrivingSide);

public record LocaleInfo(Language[] Languages, string WeekStart, string[] Weekend, string[] Calendars, string Measurement);

public record Address(
    string? PostalCodeFormat,
    string? PostalCodeRegex,
    string? PostalCodeExample,
    string? AddressFormat,
    string? RegionLabelAr,
    string? RegionLabelEn);

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

public record Subdivision(string Iso2, string Code, string? NameAr, string? NameEn, string? Parent);

public record ParsedPhone(string E164, string Iso2, string CallingCode, string National, bool Valid, bool Mobile);

public enum Lang { En, Ar }

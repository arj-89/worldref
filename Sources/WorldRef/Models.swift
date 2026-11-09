import Foundation

public struct PhonePlan: Codable, Sendable, Equatable {
    public let callingCode: String
    public let leadingDigits: String?
    public let primary: Bool
    public let trunkPrefix: String?
    public let pattern: String?
    public let lengths: [Int]
    public let mobilePattern: String?
    public let mobileLengths: [Int]
    public let mobilePrefixes: [String]
    public let mobileDistinguishable: Bool
    public let mobileExample: String?
    public let mobileFormat: String?

    enum CodingKeys: String, CodingKey {
        case callingCode = "calling_code", leadingDigits = "leading_digits", primary
        case trunkPrefix = "trunk_prefix", pattern, lengths
        case mobilePattern = "mobile_pattern", mobileLengths = "mobile_lengths"
        case mobilePrefixes = "mobile_prefixes", mobileDistinguishable = "mobile_distinguishable"
        case mobileExample = "mobile_example", mobileFormat = "mobile_format"
    }
}

public struct Currency: Codable, Sendable, Equatable {
    public let code: String
    public let nameAr: String?
    public let nameEn: String?
    public let symbol: String?
    public let symbolAr: String?
    public let symbolFallback: String?

    enum CodingKeys: String, CodingKey {
        case code, symbol
        case nameAr = "name_ar", nameEn = "name_en", symbolAr = "symbol_ar", symbolFallback = "symbol_fallback"
    }
}

public struct Nationality: Codable, Sendable, Equatable {
    public let nationalityArM: String?
    public let nationalityArF: String?
    public let nationalityEn: String?
    public let icaoCode: String?

    enum CodingKeys: String, CodingKey {
        case nationalityArM = "nationality_ar_m", nationalityArF = "nationality_ar_f"
        case nationalityEn = "nationality_en", icaoCode = "icao_code"
    }
}

public struct TimezoneOffset: Codable, Sendable, Equatable {
    public let zone: String
    /// UTC offset outside daylight saving time, e.g. "+03:00".
    public let standard: String
    /// UTC offset during daylight saving time; nil where the zone does not observe it.
    public let dst: String?
}

public struct Geo: Codable, Sendable, Equatable {
    public let capitalAr: String?
    public let capitalEn: String?
    public let lat: Double?
    public let lng: Double?
    public let areaKm2: Double?
    public let population: Int?
    public let populationYear: Int?
    public let timezones: [String]
    public let drivingSide: String?
    /// Standard and daylight-saving UTC offsets per zone. Empty when decoding data older than 1.2.0.
    public let timezoneOffsets: [TimezoneOffset]

    enum CodingKeys: String, CodingKey {
        case lat, lng, population, timezones
        case capitalAr = "capital_ar", capitalEn = "capital_en", areaKm2 = "area_km2"
        case populationYear = "population_year", timezoneOffsets = "timezone_offsets", drivingSide = "driving_side"
    }
}

public struct Language: Codable, Sendable, Equatable {
    public let code: String
    public let nameAr: String?
    public let nameEn: String?

    enum CodingKeys: String, CodingKey {
        case code
        case nameAr = "name_ar", nameEn = "name_en"
    }
}

public struct Locale: Codable, Sendable, Equatable {
    public let languages: [Language]
    public let weekStart: String
    public let weekend: [String]
    public let calendars: [String]
    public let measurement: String

    enum CodingKeys: String, CodingKey {
        case languages, weekend, calendars, measurement
        case weekStart = "week_start"
    }
}

public struct Address: Codable, Sendable, Equatable {
    public let postalCodeFormat: String?
    public let postalCodeRegex: String?
    public let postalCodeExample: String?
    public let addressFormat: String?
    public let regionLabelAr: String?
    public let regionLabelEn: String?
    public let localityLabelAr: String?
    public let localityLabelEn: String?
    public let sublocalityLabelAr: String?
    public let sublocalityLabelEn: String?
    public let postalCodeLabelAr: String?
    public let postalCodeLabelEn: String?
    /// Address fields the postal service requires, as `AddressField` raw values ("street", "city", ...).
    /// Empty when decoding data older than 1.2.0.
    public let requiredFields: [String]

    enum CodingKeys: String, CodingKey {
        case postalCodeFormat = "postal_code_format", postalCodeRegex = "postal_code_regex"
        case postalCodeExample = "postal_code_example", addressFormat = "address_format"
        case regionLabelAr = "region_label_ar", regionLabelEn = "region_label_en"
        case localityLabelAr = "locality_label_ar", localityLabelEn = "locality_label_en"
        case sublocalityLabelAr = "sublocality_label_ar", sublocalityLabelEn = "sublocality_label_en"
        case postalCodeLabelAr = "postal_code_label_ar", postalCodeLabelEn = "postal_code_label_en"
        case requiredFields = "required_fields"
    }
}

// Fields added in 1.2.0 decode to [] when absent, so data written before 1.2.0 still loads.
// Declared in extensions so the structs keep their memberwise initialisers.
extension Geo {
    public init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)
        capitalAr = try c.decodeIfPresent(String.self, forKey: .capitalAr)
        capitalEn = try c.decodeIfPresent(String.self, forKey: .capitalEn)
        lat = try c.decodeIfPresent(Double.self, forKey: .lat)
        lng = try c.decodeIfPresent(Double.self, forKey: .lng)
        areaKm2 = try c.decodeIfPresent(Double.self, forKey: .areaKm2)
        population = try c.decodeIfPresent(Int.self, forKey: .population)
        populationYear = try c.decodeIfPresent(Int.self, forKey: .populationYear)
        timezones = try c.decode([String].self, forKey: .timezones)
        drivingSide = try c.decodeIfPresent(String.self, forKey: .drivingSide)
        timezoneOffsets = try c.decodeIfPresent([TimezoneOffset].self, forKey: .timezoneOffsets) ?? []
    }
}

extension Address {
    public init(from decoder: Decoder) throws {
        let c = try decoder.container(keyedBy: CodingKeys.self)
        postalCodeFormat = try c.decodeIfPresent(String.self, forKey: .postalCodeFormat)
        postalCodeRegex = try c.decodeIfPresent(String.self, forKey: .postalCodeRegex)
        postalCodeExample = try c.decodeIfPresent(String.self, forKey: .postalCodeExample)
        addressFormat = try c.decodeIfPresent(String.self, forKey: .addressFormat)
        regionLabelAr = try c.decodeIfPresent(String.self, forKey: .regionLabelAr)
        regionLabelEn = try c.decodeIfPresent(String.self, forKey: .regionLabelEn)
        localityLabelAr = try c.decodeIfPresent(String.self, forKey: .localityLabelAr)
        localityLabelEn = try c.decodeIfPresent(String.self, forKey: .localityLabelEn)
        sublocalityLabelAr = try c.decodeIfPresent(String.self, forKey: .sublocalityLabelAr)
        sublocalityLabelEn = try c.decodeIfPresent(String.self, forKey: .sublocalityLabelEn)
        postalCodeLabelAr = try c.decodeIfPresent(String.self, forKey: .postalCodeLabelAr)
        postalCodeLabelEn = try c.decodeIfPresent(String.self, forKey: .postalCodeLabelEn)
        requiredFields = try c.decodeIfPresent([String].self, forKey: .requiredFields) ?? []
    }
}

public struct Emergency: Codable, Sendable, Equatable {
    public let police: String?
    public let ambulance: String?
    public let fire: String?
    public let general: String?
}

public struct Travel: Codable, Sendable, Equatable {
    public let emergency: Emergency?
    public let plugTypes: [String]
    public let voltage: [Int]
    public let frequencyHz: [Int]?

    enum CodingKeys: String, CodingKey {
        case emergency, voltage
        case plugTypes = "plug_types", frequencyHz = "frequency_hz"
    }
}

public struct Sports: Codable, Sendable, Equatable {
    public let fifa: String?
    public let ioc: String?
}

public struct Country: Codable, Sendable, Equatable {
    public let iso2: String
    public let iso3: String?
    public let isoNumeric: String?
    /// "country" or "territory".
    public let kind: String
    public let nameAr: String
    public let nameEn: String
    public let officialNameAr: String?
    public let officialNameEn: String?
    public let aliasesAr: [String]
    public let aliasesEn: [String]
    public let flag: String
    public let flagSvg: String
    /// "africa", "americas", "asia", "europe", "oceania", or nil.
    public let continent: String?
    public let groups: [String]
    public let unMember: Bool
    public let tld: String?
    public let sortAr: String
    public let sortEn: String
    public let nationality: Nationality
    public let phone: [PhonePlan]
    public let currencies: [Currency]
    public let geo: Geo
    public let locale: Locale
    public let address: Address
    public let travel: Travel
    public let sports: Sports

    enum CodingKeys: String, CodingKey {
        case iso2, iso3, kind, flag, continent, groups, tld, nationality, phone, currencies, geo, locale, address, travel, sports
        case isoNumeric = "iso_numeric", nameAr = "name_ar", nameEn = "name_en"
        case officialNameAr = "official_name_ar", officialNameEn = "official_name_en"
        case aliasesAr = "aliases_ar", aliasesEn = "aliases_en", flagSvg = "flag_svg"
        case unMember = "un_member", sortAr = "sort_ar", sortEn = "sort_en"
    }
}

public struct Subdivision: Codable, Sendable, Equatable {
    public let iso2: String
    public let code: String
    public let nameAr: String?
    public let nameEn: String?
    public let parent: String?
    /// Subdivision type, e.g. "منطقة" / "region".
    public let typeAr: String?
    public let typeEn: String?

    enum CodingKeys: String, CodingKey {
        case iso2, code, parent
        case nameAr = "name_ar", nameEn = "name_en", typeAr = "type_ar", typeEn = "type_en"
    }
}

public enum Lang: String, Sendable {
    case ar, en
}

public struct ParsedPhone: Sendable, Equatable {
    /// International format, e.g. +966512345678. Store this together with `iso2`.
    public let e164: String
    public let iso2: String
    public let callingCode: String
    public let national: String
    public let valid: Bool
    public let mobile: Bool
}

public enum AddressField: String, Codable, Sendable, CaseIterable {
    case name, organization, street, sublocality, city, region
    case postalCode = "postal_code", sortingCode = "sorting_code"
}

public struct AddressFormField: Sendable, Equatable {
    public let field: AddressField
    /// In the requested language; nil when the data has no label in that language.
    public let label: String?
    public let required: Bool
}

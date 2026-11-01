// Typed, immutable records of the bilingual build. Field names are camelCase versions of the JSON keys.

List<String> _strings(Object? v) =>
    List.unmodifiable((v as List? ?? const []).cast<String>());
List<int> _ints(Object? v) =>
    List.unmodifiable((v as List? ?? const []).map((e) => (e as num).toInt()));
List<double> _doubles(Object? v) => List.unmodifiable(
    (v as List? ?? const []).map((e) => (e as num).toDouble()));
double? _double(Object? v) => (v as num?)?.toDouble();
int? _int(Object? v) => (v as num?)?.toInt();

class PhonePlan {
  final String callingCode;
  final String? leadingDigits;
  final bool primary;
  final String? trunkPrefix;
  final String? pattern;
  final List<int> lengths;
  final String? mobilePattern;
  final List<int> mobileLengths;
  final List<String> mobilePrefixes;
  final bool mobileDistinguishable;
  final String? mobileExample;
  final String? mobileFormat;

  const PhonePlan({
    required this.callingCode,
    this.leadingDigits,
    required this.primary,
    this.trunkPrefix,
    this.pattern,
    required this.lengths,
    this.mobilePattern,
    required this.mobileLengths,
    required this.mobilePrefixes,
    required this.mobileDistinguishable,
    this.mobileExample,
    this.mobileFormat,
  });

  factory PhonePlan.fromJson(Map<String, dynamic> j) => PhonePlan(
        callingCode: j['calling_code'] as String,
        leadingDigits: j['leading_digits'] as String?,
        primary: j['primary'] as bool,
        trunkPrefix: j['trunk_prefix'] as String?,
        pattern: j['pattern'] as String?,
        lengths: _ints(j['lengths']),
        mobilePattern: j['mobile_pattern'] as String?,
        mobileLengths: _ints(j['mobile_lengths']),
        mobilePrefixes: _strings(j['mobile_prefixes']),
        mobileDistinguishable: j['mobile_distinguishable'] as bool,
        mobileExample: j['mobile_example'] as String?,
        mobileFormat: j['mobile_format'] as String?,
      );
}

class Currency {
  final String code;
  final String? nameAr;
  final String? nameEn;
  final String? symbol;
  final String? symbolAr;
  final String? symbolFallback;

  const Currency(
      {required this.code,
      this.nameAr,
      this.nameEn,
      this.symbol,
      this.symbolAr,
      this.symbolFallback});

  factory Currency.fromJson(Map<String, dynamic> j) => Currency(
        code: j['code'] as String,
        nameAr: j['name_ar'] as String?,
        nameEn: j['name_en'] as String?,
        symbol: j['symbol'] as String?,
        symbolAr: j['symbol_ar'] as String?,
        symbolFallback: j['symbol_fallback'] as String?,
      );
}

class Nationality {
  final String? nationalityArM;
  final String? nationalityArF;
  final String? nationalityEn;
  final String? icaoCode;

  const Nationality(
      {this.nationalityArM,
      this.nationalityArF,
      this.nationalityEn,
      this.icaoCode});

  factory Nationality.fromJson(Map<String, dynamic> j) => Nationality(
        nationalityArM: j['nationality_ar_m'] as String?,
        nationalityArF: j['nationality_ar_f'] as String?,
        nationalityEn: j['nationality_en'] as String?,
        icaoCode: j['icao_code'] as String?,
      );
}

class Geo {
  final String? capitalAr;
  final String? capitalEn;
  final double? lat;
  final double? lng;
  final double? areaKm2;
  final int? population;
  final int? populationYear;
  final List<String> timezones;

  /// "left" or "right".
  final String? drivingSide;

  const Geo({
    this.capitalAr,
    this.capitalEn,
    this.lat,
    this.lng,
    this.areaKm2,
    this.population,
    this.populationYear,
    required this.timezones,
    this.drivingSide,
  });

  factory Geo.fromJson(Map<String, dynamic> j) => Geo(
        capitalAr: j['capital_ar'] as String?,
        capitalEn: j['capital_en'] as String?,
        lat: _double(j['lat']),
        lng: _double(j['lng']),
        areaKm2: _double(j['area_km2']),
        population: _int(j['population']),
        populationYear: _int(j['population_year']),
        timezones: _strings(j['timezones']),
        drivingSide: j['driving_side'] as String?,
      );
}

class Language {
  final String code;
  final String? nameAr;
  final String? nameEn;

  const Language({required this.code, this.nameAr, this.nameEn});

  factory Language.fromJson(Map<String, dynamic> j) => Language(
      code: j['code'] as String,
      nameAr: j['name_ar'] as String?,
      nameEn: j['name_en'] as String?);
}

class LocaleInfo {
  final List<Language> languages;
  final String weekStart;
  final List<String> weekend;
  final List<String> calendars;

  /// "metric", "us" or "uk".
  final String measurement;

  const LocaleInfo({
    required this.languages,
    required this.weekStart,
    required this.weekend,
    required this.calendars,
    required this.measurement,
  });

  factory LocaleInfo.fromJson(Map<String, dynamic> j) => LocaleInfo(
        languages: List.unmodifiable((j['languages'] as List)
            .map((e) => Language.fromJson(e as Map<String, dynamic>))),
        weekStart: j['week_start'] as String,
        weekend: _strings(j['weekend']),
        calendars: _strings(j['calendars']),
        measurement: j['measurement'] as String,
      );
}

class Address {
  final String? postalCodeFormat;
  final String? postalCodeRegex;
  final String? postalCodeExample;
  final String? addressFormat;
  final String? regionLabelAr;
  final String? regionLabelEn;

  const Address({
    this.postalCodeFormat,
    this.postalCodeRegex,
    this.postalCodeExample,
    this.addressFormat,
    this.regionLabelAr,
    this.regionLabelEn,
  });

  factory Address.fromJson(Map<String, dynamic> j) => Address(
        postalCodeFormat: j['postal_code_format'] as String?,
        postalCodeRegex: j['postal_code_regex'] as String?,
        postalCodeExample: j['postal_code_example'] as String?,
        addressFormat: j['address_format'] as String?,
        regionLabelAr: j['region_label_ar'] as String?,
        regionLabelEn: j['region_label_en'] as String?,
      );
}

class Emergency {
  final String? police;
  final String? ambulance;
  final String? fire;
  final String? general;

  const Emergency({this.police, this.ambulance, this.fire, this.general});

  factory Emergency.fromJson(Map<String, dynamic> j) => Emergency(
        police: j['police'] as String?,
        ambulance: j['ambulance'] as String?,
        fire: j['fire'] as String?,
        general: j['general'] as String?,
      );
}

class Travel {
  final Emergency? emergency;
  final List<String> plugTypes;
  final List<double> voltage;
  final List<double>? frequencyHz;

  const Travel(
      {this.emergency,
      required this.plugTypes,
      required this.voltage,
      this.frequencyHz});

  factory Travel.fromJson(Map<String, dynamic> j) => Travel(
        emergency: j['emergency'] == null
            ? null
            : Emergency.fromJson(j['emergency'] as Map<String, dynamic>),
        plugTypes: _strings(j['plug_types']),
        voltage: _doubles(j['voltage']),
        frequencyHz:
            j['frequency_hz'] == null ? null : _doubles(j['frequency_hz']),
      );
}

class Sports {
  final String? fifa;
  final String? ioc;

  const Sports({this.fifa, this.ioc});

  factory Sports.fromJson(Map<String, dynamic> j) =>
      Sports(fifa: j['fifa'] as String?, ioc: j['ioc'] as String?);
}

class Country {
  final String iso2;
  final String? iso3;
  final String? isoNumeric;

  /// "country" or "territory".
  final String kind;
  final String nameAr;
  final String nameEn;
  final String? officialNameAr;
  final String? officialNameEn;
  final List<String> aliasesAr;
  final List<String> aliasesEn;
  final String flag;
  final String flagSvg;

  /// "africa", "americas", "asia", "europe" or "oceania".
  final String? continent;
  final List<String> groups;
  final bool unMember;
  final String? tld;
  final String sortAr;
  final String sortEn;
  final Nationality nationality;
  final List<PhonePlan> phone;
  final List<Currency> currencies;
  final Geo geo;
  final LocaleInfo locale;
  final Address address;
  final Travel travel;
  final Sports sports;

  const Country({
    required this.iso2,
    this.iso3,
    this.isoNumeric,
    required this.kind,
    required this.nameAr,
    required this.nameEn,
    this.officialNameAr,
    this.officialNameEn,
    required this.aliasesAr,
    required this.aliasesEn,
    required this.flag,
    required this.flagSvg,
    this.continent,
    required this.groups,
    required this.unMember,
    this.tld,
    required this.sortAr,
    required this.sortEn,
    required this.nationality,
    required this.phone,
    required this.currencies,
    required this.geo,
    required this.locale,
    required this.address,
    required this.travel,
    required this.sports,
  });

  factory Country.fromJson(Map<String, dynamic> j) => Country(
        iso2: j['iso2'] as String,
        iso3: j['iso3'] as String?,
        isoNumeric: j['iso_numeric'] as String?,
        kind: j['kind'] as String,
        nameAr: j['name_ar'] as String,
        nameEn: j['name_en'] as String,
        officialNameAr: j['official_name_ar'] as String?,
        officialNameEn: j['official_name_en'] as String?,
        aliasesAr: _strings(j['aliases_ar']),
        aliasesEn: _strings(j['aliases_en']),
        flag: j['flag'] as String,
        flagSvg: j['flag_svg'] as String,
        continent: j['continent'] as String?,
        groups: _strings(j['groups']),
        unMember: j['un_member'] as bool,
        tld: j['tld'] as String?,
        sortAr: j['sort_ar'] as String,
        sortEn: j['sort_en'] as String,
        nationality:
            Nationality.fromJson(j['nationality'] as Map<String, dynamic>),
        phone: List.unmodifiable((j['phone'] as List)
            .map((e) => PhonePlan.fromJson(e as Map<String, dynamic>))),
        currencies: List.unmodifiable((j['currencies'] as List)
            .map((e) => Currency.fromJson(e as Map<String, dynamic>))),
        geo: Geo.fromJson(j['geo'] as Map<String, dynamic>),
        locale: LocaleInfo.fromJson(j['locale'] as Map<String, dynamic>),
        address: Address.fromJson(j['address'] as Map<String, dynamic>),
        travel: Travel.fromJson(j['travel'] as Map<String, dynamic>),
        sports: Sports.fromJson(j['sports'] as Map<String, dynamic>),
      );
}

class Subdivision {
  final String iso2;
  final String code;
  final String? nameAr;
  final String? nameEn;
  final String? parent;

  const Subdivision(
      {required this.iso2,
      required this.code,
      this.nameAr,
      this.nameEn,
      this.parent});

  factory Subdivision.fromJson(Map<String, dynamic> j) => Subdivision(
        iso2: j['iso2'] as String,
        code: j['code'] as String,
        nameAr: j['name_ar'] as String?,
        nameEn: j['name_en'] as String?,
        parent: j['parent'] as String?,
      );
}

/// Result of [parsePhone].
class ParsedPhone {
  /// International format, e.g. +966512345678. Store this together with [iso2].
  final String e164;
  final String iso2;
  final String callingCode;
  final String national;
  final bool valid;
  final bool mobile;

  const ParsedPhone({
    required this.e164,
    required this.iso2,
    required this.callingCode,
    required this.national,
    required this.valid,
    required this.mobile,
  });
}

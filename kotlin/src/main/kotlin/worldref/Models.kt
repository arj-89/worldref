package worldref

import kotlinx.serialization.SerialName
import kotlinx.serialization.Serializable

@Serializable
data class PhonePlan(
    @SerialName("calling_code") val callingCode: String,
    @SerialName("leading_digits") val leadingDigits: String? = null,
    val primary: Boolean,
    @SerialName("trunk_prefix") val trunkPrefix: String? = null,
    val pattern: String? = null,
    val lengths: List<Int> = emptyList(),
    @SerialName("mobile_pattern") val mobilePattern: String? = null,
    @SerialName("mobile_lengths") val mobileLengths: List<Int> = emptyList(),
    @SerialName("mobile_prefixes") val mobilePrefixes: List<String> = emptyList(),
    @SerialName("mobile_distinguishable") val mobileDistinguishable: Boolean = false,
    @SerialName("mobile_example") val mobileExample: String? = null,
    @SerialName("mobile_format") val mobileFormat: String? = null,
)

@Serializable
data class Currency(
    val code: String,
    @SerialName("name_ar") val nameAr: String? = null,
    @SerialName("name_en") val nameEn: String? = null,
    val symbol: String? = null,
    @SerialName("symbol_ar") val symbolAr: String? = null,
    @SerialName("symbol_fallback") val symbolFallback: String? = null,
)

@Serializable
data class Nationality(
    @SerialName("nationality_ar_m") val nationalityArM: String? = null,
    @SerialName("nationality_ar_f") val nationalityArF: String? = null,
    @SerialName("nationality_en") val nationalityEn: String? = null,
    @SerialName("icao_code") val icaoCode: String? = null,
)

@Serializable
data class TimezoneOffset(
    val zone: String,
    /** UTC offset outside daylight saving time, e.g. "+03:00". */
    val standard: String,
    /** UTC offset during daylight saving time; null when the zone has none. */
    val dst: String? = null,
)

@Serializable
data class Geo @JvmOverloads constructor(
    @SerialName("capital_ar") val capitalAr: String? = null,
    @SerialName("capital_en") val capitalEn: String? = null,
    val lat: Double? = null,
    val lng: Double? = null,
    @SerialName("area_km2") val areaKm2: Double? = null,
    val population: Long? = null,
    @SerialName("population_year") val populationYear: Int? = null,
    val timezones: List<String> = emptyList(),
    @SerialName("driving_side") val drivingSide: String? = null,
    @SerialName("timezone_offsets") val timezoneOffsets: List<TimezoneOffset> = emptyList(),
)

@Serializable
data class Language(
    val code: String,
    @SerialName("name_ar") val nameAr: String? = null,
    @SerialName("name_en") val nameEn: String? = null,
)

@Serializable
data class Locale(
    val languages: List<Language> = emptyList(),
    @SerialName("week_start") val weekStart: String,
    val weekend: List<String> = emptyList(),
    val calendars: List<String> = emptyList(),
    /** "metric", "us" or "uk". */
    val measurement: String,
)

@Serializable
data class Address @JvmOverloads constructor(
    @SerialName("postal_code_format") val postalCodeFormat: String? = null,
    @SerialName("postal_code_regex") val postalCodeRegex: String? = null,
    @SerialName("postal_code_example") val postalCodeExample: String? = null,
    @SerialName("address_format") val addressFormat: String? = null,
    @SerialName("region_label_ar") val regionLabelAr: String? = null,
    @SerialName("region_label_en") val regionLabelEn: String? = null,
    @SerialName("locality_label_ar") val localityLabelAr: String? = null,
    @SerialName("locality_label_en") val localityLabelEn: String? = null,
    @SerialName("sublocality_label_ar") val sublocalityLabelAr: String? = null,
    @SerialName("sublocality_label_en") val sublocalityLabelEn: String? = null,
    @SerialName("postal_code_label_ar") val postalCodeLabelAr: String? = null,
    @SerialName("postal_code_label_en") val postalCodeLabelEn: String? = null,
    /** Fields the postal service requires: "name", "organization", "street", "sublocality", "city", "region", "postal_code", "sorting_code". */
    @SerialName("required_fields") val requiredFields: List<String> = emptyList(),
)

@Serializable
data class Emergency(
    val police: String? = null,
    val ambulance: String? = null,
    val fire: String? = null,
    val general: String? = null,
)

@Serializable
data class Travel(
    val emergency: Emergency? = null,
    @SerialName("plug_types") val plugTypes: List<String> = emptyList(),
    val voltage: List<Int> = emptyList(),
    @SerialName("frequency_hz") val frequencyHz: List<Int>? = null,
)

@Serializable
data class Sports(val fifa: String? = null, val ioc: String? = null)

@Serializable
data class Country(
    val iso2: String,
    val iso3: String? = null,
    @SerialName("iso_numeric") val isoNumeric: String? = null,
    /** "country" or "territory". */
    val kind: String,
    @SerialName("name_ar") val nameAr: String,
    @SerialName("name_en") val nameEn: String,
    @SerialName("official_name_ar") val officialNameAr: String? = null,
    @SerialName("official_name_en") val officialNameEn: String? = null,
    @SerialName("aliases_ar") val aliasesAr: List<String> = emptyList(),
    @SerialName("aliases_en") val aliasesEn: List<String> = emptyList(),
    val flag: String,
    @SerialName("flag_svg") val flagSvg: String,
    /** "africa", "americas", "asia", "europe" or "oceania"; null when not on a continent. */
    val continent: String? = null,
    val groups: List<String> = emptyList(),
    @SerialName("un_member") val unMember: Boolean,
    val tld: String? = null,
    @SerialName("sort_ar") val sortAr: String,
    @SerialName("sort_en") val sortEn: String,
    val nationality: Nationality,
    val phone: List<PhonePlan> = emptyList(),
    val currencies: List<Currency> = emptyList(),
    val geo: Geo,
    val locale: Locale,
    val address: Address,
    val travel: Travel,
    val sports: Sports,
)

@Serializable
data class Subdivision @JvmOverloads constructor(
    val iso2: String,
    val code: String,
    @SerialName("name_ar") val nameAr: String? = null,
    @SerialName("name_en") val nameEn: String? = null,
    val parent: String? = null,
    @SerialName("type_ar") val typeAr: String? = null,
    @SerialName("type_en") val typeEn: String? = null,
)

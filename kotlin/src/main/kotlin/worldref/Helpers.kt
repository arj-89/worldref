package worldref

import kotlin.math.abs

enum class Lang { AR, EN }

private val DIAL = Regex("^(\\+|00)?\\d{1,4}$")
private val DIAL_PREFIX = Regex("^(\\+|00)")

/**
 * Countries matching a query, best first. Matches names and aliases in both languages (ignoring the Arabic
 * article, tashkeel, hamza forms, case, accents, spaces and punctuation), ISO codes, and dial codes with or
 * without + or 00. When nothing matches, a second pass forgives small typos ("Kuwiat"): 1 edit for 4 to 7
 * letters, 2 from 8.
 */
fun search(countries: List<Country>, query: String, lang: Lang = Lang.EN): List<Country> {
    val q = normalize(query)
    if (q.isEmpty()) return emptyList()
    val qc = q.replace(" ", "")
    val digits = westernDigits(query).replace(Regex("[\\s()-]"), "")
    val dial = if (DIAL.matches(digits)) digits.replace(DIAL_PREFIX, "") else null
    val upper = query.trim().uppercase(java.util.Locale.ROOT)
    val ar = lang == Lang.AR
    val scored = ArrayList<Pair<Country, Double>>()
    for (c in countries) {
        val own = normalize(if (ar) c.nameAr else c.nameEn)
        val other = normalize(if (ar) c.nameEn else c.nameAr)
        // Tiers: exact (50s), name starts with the query (40s), a word starts with it (30s), contains it (10s).
        // Within a tier: the UI-language name, then the other language, then aliases.
        fun rank(name: String, place: Int): Double {
            val nc = name.replace(" ", "")
            return when {
                name == q || nc == qc -> 50.0 - place
                name.startsWith(q) || (qc.length >= 3 && nc.startsWith(qc)) -> 40.0 - place
                name.split(" ").any { it.startsWith(q) } -> 30.0 - place
                q.length >= 3 && name.contains(q) -> 10.0 - place
                else -> 0.0
            }
        }
        var score = maxOf(rank(own, 0), rank(other, 1), (c.aliasesAr + c.aliasesEn).maxOfOrNull { rank(normalize(it), 2) } ?: 0.0)
        if (upper == c.iso2 || upper == c.iso3) score = maxOf(score, 49.5)
        if (dial != null) {
            val codes = c.phone.map { it.callingCode.substring(1) to it.primary }
            if (codes.any { it.first == dial }) score = maxOf(score, if (codes.any { it.first == dial && it.second }) 46.0 else 45.0)
            else if (codes.any { it.first.startsWith(dial) }) score = maxOf(score, 5.0)
        }
        if (score != 0.0) scored.add(c to score)
    }
    if (scored.isEmpty() && qc.length >= 4 && !qc.all { it in '0'..'9' }) {
        // Typo pass: edit distance between the query and whole names, spaces ignored.
        val limit = if (qc.length >= 8) 2 else 1
        for (c in countries) {
            val names = listOf(if (ar) c.nameAr else c.nameEn, if (ar) c.nameEn else c.nameAr) + c.aliasesAr + c.aliasesEn
            var best = 0.0
            names.map { normalize(it).replace(" ", "") }.forEachIndexed { i, n ->
                val d = editDistance(qc, n, limit)
                if (d <= limit) best = maxOf(best, 3.0 - d - minOf(i, 2) * 0.25)
            }
            if (best != 0.0) scored.add(c to best)
        }
    }
    return scored.sortedWith(
        compareByDescending<Pair<Country, Double>> { it.second }.thenBy { if (ar) it.first.sortAr else it.first.sortEn },
    ).map { it.first }
}

/**
 * Optimal string alignment distance (insertions, deletions, substitutions, adjacent swaps), compared by
 * UTF-16 code unit. Returns limit + 1 as soon as the distance must exceed [limit].
 */
fun editDistance(a: String, b: String, limit: Int): Int {
    if (abs(a.length - b.length) > limit) return limit + 1
    var prev2 = IntArray(0)
    var prev = IntArray(b.length + 1) { it }
    for (i in 1..a.length) {
        val cur = IntArray(b.length + 1)
        cur[0] = i
        var low = i
        for (j in 1..b.length) {
            val cost = if (a[i - 1] == b[j - 1]) 0 else 1
            var v = minOf(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost)
            if (i > 1 && j > 1 && a[i - 1] == b[j - 2] && a[i - 2] == b[j - 1]) v = minOf(v, prev2[j - 2] + 1)
            cur[j] = v
            low = minOf(low, v)
        }
        if (low > limit) return limit + 1
        prev2 = prev
        prev = cur
    }
    return prev[b.length]
}

/** Alphabetical (code point order) in the UI language, with the user's country (if given) first. Returns a new list. */
fun sortCountries(countries: List<Country>, lang: Lang = Lang.EN, first: String? = null): List<Country> {
    val pin = first?.uppercase(java.util.Locale.ROOT)
    return countries.sortedWith { a, b ->
        when {
            a.iso2 == pin -> -1
            b.iso2 == pin -> 1
            lang == Lang.AR -> a.sortAr.compareTo(b.sortAr)
            else -> a.sortEn.compareTo(b.sortEn)
        }
    }
}

data class ParsedPhone(
    /** International format, e.g. +966512345678. Store this together with [iso2]. */
    val e164: String,
    val iso2: String,
    val callingCode: String,
    val national: String,
    val valid: Boolean,
    val mobile: Boolean,
)

private fun fullMatch(pattern: String?, s: String) = !pattern.isNullOrEmpty() && Regex("^(?:$pattern)$").matches(s)

private data class Candidate(val iso2: String, val plan: PhonePlan, val rest: String)

/**
 * Reads what a user typed into a phone field. [country] is the one picked in the field; numbers typed with
 * + or 00 are matched against [all] (or [country] alone if [all] is not given).
 */
fun parsePhone(input: String, country: Country, all: List<Country>? = null): ParsedPhone? {
    var s = westernDigits(input).replace(Regex("[^\\d+]"), "")
    if (s.isEmpty()) return null
    val plans = ArrayList<Candidate>()
    if (s.startsWith("+") || s.startsWith("00")) {
        s = s.replace(DIAL_PREFIX, "")
        for (c in all ?: listOf(country)) for (plan in c.phone) {
            val cc = plan.callingCode.substring(1)
            if (!s.startsWith(cc)) continue
            val rest = s.substring(cc.length)
            if (!plan.leadingDigits.isNullOrEmpty() && !Regex("^(?:${plan.leadingDigits})").containsMatchIn(rest)) continue
            plans.add(Candidate(c.iso2, plan, rest))
        }
        // Shared codes (+1, +7, +44...): the picked country first, then a plan whose leading digits matched,
        // then one whose mobile pattern fits, then a secondary plan whose own pattern fits, then the main country.
        fun weight(p: Candidate) =
            (if (p.iso2 == country.iso2) 16 else 0) +
                (if (!p.plan.leadingDigits.isNullOrEmpty()) 8 else 0) +
                (if (fullMatch(p.plan.mobilePattern, p.rest)) 4 else 0) +
                (if (!p.plan.primary && fullMatch(p.plan.pattern, p.rest)) 2 else 0) +
                (if (p.plan.primary) 1 else 0)
        plans.sortByDescending { weight(it) }
    } else {
        for (plan in country.phone) {
            val trunk = plan.trunkPrefix
            val rest = if (!trunk.isNullOrEmpty() && s.startsWith(trunk) && !fullMatch(plan.pattern, s)) s.substring(trunk.length) else s
            plans.add(Candidate(country.iso2, plan, rest))
        }
    }
    if (plans.isEmpty()) return null
    val pick = plans.firstOrNull { fullMatch(it.plan.pattern, it.rest) } ?: plans[0]
    return ParsedPhone(
        e164 = pick.plan.callingCode + pick.rest,
        iso2 = pick.iso2,
        callingCode = pick.plan.callingCode,
        national = pick.rest,
        valid = fullMatch(pick.plan.pattern, pick.rest),
        mobile = fullMatch(pick.plan.mobilePattern, pick.rest),
    )
}

/** True when the input is a valid mobile number for the country. */
fun isValidMobile(input: String, country: Country, all: List<Country>? = null): Boolean {
    val p = parsePhone(input, country, all) ?: return false
    return p.valid && p.mobile && (all == null || p.iso2 == country.iso2)
}

/** Groups national digits with the plan's mobile_format mask ("### ####" style); returns the digits as-is when the mask does not fit. */
fun formatNational(national: String, plan: PhonePlan): String {
    val mask = plan.mobileFormat
    if (mask == null || mask.count { it == '#' } != national.length) return national
    var i = 0
    return mask.map { if (it == '#') national[i++] else it }.joinToString("")
}

/** A field of a postal address form; [key] is the name used in the data (required_fields) and in other packages. */
enum class AddressField(val key: String) {
    NAME("name"),
    ORGANIZATION("organization"),
    STREET("street"),
    SUBLOCALITY("sublocality"),
    CITY("city"),
    REGION("region"),
    POSTAL_CODE("postal_code"),
    SORTING_CODE("sorting_code"),
}

data class AddressFormField(
    val field: AddressField,
    /** In the requested language; null when the data has no label in that language. */
    val label: String?,
    val required: Boolean,
)

private val ADDRESS_TOKEN = Regex("%([A-Z])")
private val ADDRESS_TOKENS = mapOf(
    'N' to AddressField.NAME, 'O' to AddressField.ORGANIZATION, 'A' to AddressField.STREET,
    'D' to AddressField.SUBLOCALITY, 'C' to AddressField.CITY, 'S' to AddressField.REGION,
    'Z' to AddressField.POSTAL_CODE, 'X' to AddressField.SORTING_CODE,
)

/**
 * The address form of a country: its fields line by line, in the country's order, with labels in [lang] and
 * whether the postal service requires each one. Tokens the format uses beyond Google's nine are skipped.
 */
fun addressForm(country: Country, lang: Lang = Lang.EN): List<List<AddressFormField>> {
    val a = country.address
    val ar = lang == Lang.AR
    fun pick(arLabel: String?, enLabel: String?) = if (ar) arLabel else enLabel
    fun cap(s: String?) =
        if (s == null || s.isEmpty() || ar) s else s.substring(0, 1).uppercase(java.util.Locale.ROOT) + s.substring(1)
    fun labelOf(f: AddressField): String? = when (f) {
        AddressField.NAME -> if (ar) "الاسم" else "Name"
        AddressField.ORGANIZATION -> if (ar) "المنشأة" else "Organization"
        AddressField.STREET -> if (ar) "العنوان" else "Street address"
        AddressField.SORTING_CODE -> if (ar) "رمز الفرز" else "Sorting code"
        AddressField.CITY -> pick(a.localityLabelAr, a.localityLabelEn)
        AddressField.SUBLOCALITY -> pick(a.sublocalityLabelAr, a.sublocalityLabelEn)
        AddressField.REGION -> cap(pick(a.regionLabelAr, a.regionLabelEn))
        AddressField.POSTAL_CODE -> pick(a.postalCodeLabelAr, a.postalCodeLabelEn)
    }
    val seen = HashSet<AddressField>()
    return (a.addressFormat ?: "%N%n%O%n%A%n%C").split("%n")
        .map { line ->
            ADDRESS_TOKEN.findAll(line)
                .mapNotNull { ADDRESS_TOKENS[it.groupValues[1][0]] }
                .filter { seen.add(it) }
                .map { AddressFormField(it, labelOf(it), it.key in a.requiredFields) }
                .toList()
        }
        .filter { it.isNotEmpty() }
}

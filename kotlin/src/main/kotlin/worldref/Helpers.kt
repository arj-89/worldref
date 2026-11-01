package worldref

enum class Lang { AR, EN }

private val DIAL = Regex("^(\\+|00)?\\d{1,4}$")
private val DIAL_PREFIX = Regex("^(\\+|00)")

/**
 * Countries matching a query, best first. Matches names and aliases in both languages (ignoring the Arabic
 * article, tashkeel, hamza forms, case and accents), ISO codes, and dial codes with or without + or 00.
 */
fun search(countries: List<Country>, query: String, lang: Lang = Lang.EN): List<Country> {
    val q = normalize(query)
    if (q.isEmpty()) return emptyList()
    val digits = westernDigits(query).replace(Regex("[\\s()-]"), "")
    val dial = if (DIAL.matches(digits)) digits.replace(DIAL_PREFIX, "") else null
    val upper = query.trim().uppercase(java.util.Locale.ROOT)
    val ar = lang == Lang.AR
    val scored = ArrayList<Pair<Country, Double>>()
    for (c in countries) {
        val own = normalize(if (ar) c.nameAr else c.nameEn)
        val other = normalize(if (ar) c.nameEn else c.nameAr)
        // Tiers: exact (50s), name starts with the query (40s), a word starts with it (30s), contains it (10s).
        fun rank(name: String, place: Int): Double = when {
            name == q -> 50.0 - place
            name.startsWith(q) -> 40.0 - place
            name.split(" ").any { it.startsWith(q) } -> 30.0 - place
            q.length >= 3 && name.contains(q) -> 10.0 - place
            else -> 0.0
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
    return scored.sortedWith(
        compareByDescending<Pair<Country, Double>> { it.second }.thenBy { if (ar) it.first.sortAr else it.first.sortEn },
    ).map { it.first }
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

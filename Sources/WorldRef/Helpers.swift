import Foundation

private let regexLock = NSLock()
nonisolated(unsafe) private var regexCache: [String: NSRegularExpression] = [:]

private func regex(_ pattern: String) -> NSRegularExpression? {
    regexLock.lock()
    defer { regexLock.unlock() }
    if let r = regexCache[pattern] { return r }
    guard let r = try? NSRegularExpression(pattern: pattern) else { return nil }
    regexCache[pattern] = r
    return r
}

private func matches(_ pattern: String, _ s: String) -> Bool {
    guard let r = regex(pattern) else { return false }
    return r.firstMatch(in: s, range: NSRange(s.startIndex..., in: s)) != nil
}

private func fullMatch(_ pattern: String?, _ s: String) -> Bool {
    guard let p = pattern, !p.isEmpty else { return false }
    return matches("^(?:\(p))$", s)
}

/// Plain code point comparison, like the reference's string comparison.
private func less(_ a: String, _ b: String) -> Bool {
    a.unicodeScalars.lexicographicallyPrecedes(b.unicodeScalars) { $0.value < $1.value }
}

private func stripPlus(_ s: String) -> String {
    if s.hasPrefix("+") { return String(s.dropFirst()) }
    if s.hasPrefix("00") { return String(s.dropFirst(2)) }
    return s
}

/// Countries matching a query, best first. Matches names and aliases in both languages, ISO codes,
/// and dial codes with or without "+" or "00".
public func search(_ countries: [Country], _ query: String, lang: Lang = .en) -> [Country] {
    let q = normalize(query)
    if q.isEmpty { return [] }
    let digits = westernDigits(query).filter { !" \t\n\r()-".contains($0) }
    let dialShape = matches("^(\\+|00)?\\d{1,4}$", digits)
    let dial: String? = dialShape ? stripPlus(digits) : nil
    let upper = query.trimmingCharacters(in: .whitespacesAndNewlines).uppercased()
    var scored: [(c: Country, score: Double, idx: Int)] = []

    func rank(_ name: String, _ place: Double) -> Double {
        if name == q { return 50 - place }
        if name.hasPrefix(q) { return 40 - place }
        if name.split(separator: " ", omittingEmptySubsequences: false).contains(where: { $0.hasPrefix(q) }) { return 30 - place }
        if q.count >= 3 && name.contains(q) { return 10 - place }
        return 0
    }

    for (idx, c) in countries.enumerated() {
        let own = normalize(lang == .ar ? c.nameAr : c.nameEn)
        let other = normalize(lang == .ar ? c.nameEn : c.nameAr)
        var score = max(rank(own, 0), rank(other, 1))
        for a in c.aliasesAr + c.aliasesEn { score = max(score, rank(normalize(a), 2)) }
        if upper == c.iso2 || upper == c.iso3 { score = max(score, 49.5) }
        if let dial {
            let codes = c.phone.map { (cc: String($0.callingCode.dropFirst()), primary: $0.primary) }
            if codes.contains(where: { $0.cc == dial }) {
                score = max(score, codes.contains(where: { $0.cc == dial && $0.primary }) ? 46 : 45)
            } else if codes.contains(where: { $0.cc.hasPrefix(dial) }) {
                score = max(score, 5)
            }
        }
        if score > 0 { scored.append((c, score, idx)) }
    }
    let key: (Country) -> String = lang == .ar ? { $0.sortAr } : { $0.sortEn }
    return scored.sorted { a, b in
        if a.score != b.score { return a.score > b.score }
        let ka = key(a.c), kb = key(b.c)
        if ka != kb { return less(ka, kb) }
        return a.idx < b.idx
    }.map(\.c)
}

/// Alphabetical in the UI language, with the user's country (if given) first. Returns a new array.
public func sortCountries(_ countries: [Country], lang: Lang = .en, first: String? = nil) -> [Country] {
    let key: (Country) -> String = lang == .ar ? { $0.sortAr } : { $0.sortEn }
    let pin = first?.uppercased()
    return countries.enumerated().sorted { a, b in
        if let pin {
            if a.element.iso2 == pin { return b.element.iso2 != pin }
            if b.element.iso2 == pin { return false }
        }
        let ka = key(a.element), kb = key(b.element)
        if ka != kb { return less(ka, kb) }
        return a.offset < b.offset
    }.map(\.element)
}

/// Reads what a user typed into a phone field. `country` is the one picked in the field; numbers typed with
/// "+" or "00" are matched against `all` (or `country` alone if `all` is not given).
public func parsePhone(_ input: String, country: Country, all: [Country]? = nil) -> ParsedPhone? {
    var s = westernDigits(input).filter { $0 == "+" || ("0"..."9").contains($0) }
    if s.isEmpty { return nil }
    var plans: [(iso2: String, plan: PhonePlan, rest: String)] = []
    if s.hasPrefix("+") || s.hasPrefix("00") {
        s = stripPlus(s)
        for c in all ?? [country] {
            for plan in c.phone {
                let cc = String(plan.callingCode.dropFirst())
                guard s.hasPrefix(cc) else { continue }
                let rest = String(s.dropFirst(cc.count))
                if let ld = plan.leadingDigits, !matches("^(?:\(ld))", rest) { continue }
                plans.append((c.iso2, plan, rest))
            }
        }
        // Shared codes (+1, +7, +44...): the picked country first, then a plan whose leading digits matched,
        // then one whose mobile pattern fits, then a secondary plan whose own pattern fits, then the main country.
        func weight(_ p: (iso2: String, plan: PhonePlan, rest: String)) -> Int {
            (p.iso2 == country.iso2 ? 16 : 0)
                + (p.plan.leadingDigits != nil && p.plan.leadingDigits != "" ? 8 : 0)
                + (fullMatch(p.plan.mobilePattern, p.rest) ? 4 : 0)
                + (!p.plan.primary && fullMatch(p.plan.pattern, p.rest) ? 2 : 0)
                + (p.plan.primary ? 1 : 0)
        }
        plans = plans.enumerated().sorted { a, b in
            let wa = weight(a.element), wb = weight(b.element)
            return wa != wb ? wa > wb : a.offset < b.offset
        }.map(\.element)
    } else {
        for plan in country.phone {
            var rest = s
            if let t = plan.trunkPrefix, !t.isEmpty, s.hasPrefix(t), !fullMatch(plan.pattern, s) { rest = String(s.dropFirst(t.count)) }
            plans.append((country.iso2, plan, rest))
        }
    }
    guard let pick = plans.first(where: { fullMatch($0.plan.pattern, $0.rest) }) ?? plans.first else { return nil }
    return ParsedPhone(
        e164: pick.plan.callingCode + pick.rest,
        iso2: pick.iso2,
        callingCode: pick.plan.callingCode,
        national: pick.rest,
        valid: fullMatch(pick.plan.pattern, pick.rest),
        mobile: fullMatch(pick.plan.mobilePattern, pick.rest)
    )
}

/// True when the input is a valid mobile number for the country.
public func isValidMobile(_ input: String, country: Country, all: [Country]? = nil) -> Bool {
    guard let p = parsePhone(input, country: country, all: all) else { return false }
    return p.valid && p.mobile && (all == nil || p.iso2 == country.iso2)
}

/// Groups national digits with the plan's mobile_format mask (5 123 4567 style); returns the digits as-is when the mask does not fit.
public func formatNational(_ national: String, plan: PhonePlan) -> String {
    guard let mask = plan.mobileFormat, mask.filter({ $0 == "#" }).count == national.count else { return national }
    var digits = national.makeIterator()
    return String(mask.map { $0 == "#" ? digits.next()! : $0 })
}

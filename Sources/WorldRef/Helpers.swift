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

// Text comparisons below run on UTF-16 code units, like the reference's string methods, not on grapheme clusters.

private func same<A: StringProtocol, B: StringProtocol>(_ a: A, _ b: B) -> Bool { a.utf16.elementsEqual(b.utf16) }

private func starts<A: StringProtocol, B: StringProtocol>(_ s: A, with p: B) -> Bool { s.utf16.starts(with: p.utf16) }

private func includes(_ s: String, _ p: String) -> Bool {
    let h = Array(s.utf16), n = Array(p.utf16)
    if n.isEmpty { return true }
    if n.count > h.count { return false }
    for i in 0...(h.count - n.count) where h[i] == n[0] && h[i..<(i + n.count)].elementsEqual(n) { return true }
    return false
}

private func compact(_ s: String) -> String { String(String.UnicodeScalarView(s.unicodeScalars.filter { $0 != " " })) }

/// Countries matching a query, best first. Matches names and aliases in both languages (ignoring "al", tashkeel,
/// hamza forms, case, accents, spaces and punctuation), ISO codes, and dial codes with or without "+" or "00".
/// When nothing matches, a second pass forgives small typos ("Kuwiat"): 1 edit for 4 to 7 letters, 2 from 8.
public func search(_ countries: [Country], _ query: String, lang: Lang = .en) -> [Country] {
    let q = normalize(query)
    if q.isEmpty { return [] }
    let qc = compact(q)
    let qLen = q.utf16.count, qcLen = qc.utf16.count
    let digits = westernDigits(query).filter { !" \t\n\r()-".contains($0) }
    let dialShape = matches("^(\\+|00)?\\d{1,4}$", digits)
    let dial: String? = dialShape ? stripPlus(digits) : nil
    let upper = query.trimmingCharacters(in: .whitespacesAndNewlines).uppercased()
    var scored: [(c: Country, score: Double, idx: Int)] = []

    // Tiers: exact (50s), name starts with the query (40s), a word starts with it (30s), contains it (10s).
    // Within a tier: the UI-language name, then the other language, then aliases.
    func rank(_ name: String, _ place: Double) -> Double {
        let nc = compact(name)
        if same(name, q) || same(nc, qc) { return 50 - place }
        if starts(name, with: q) || (qcLen >= 3 && starts(nc, with: qc)) { return 40 - place }
        if name.split(separator: " ", omittingEmptySubsequences: false).contains(where: { starts($0, with: q) }) { return 30 - place }
        if qLen >= 3 && includes(name, q) { return 10 - place }
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
    if scored.isEmpty && qcLen >= 4 && !qc.utf16.allSatisfy({ (0x30...0x39).contains($0) }) {
        // Typo pass: edit distance between the query and whole names, spaces ignored.
        let limit = qcLen >= 8 ? 2 : 1
        for (idx, c) in countries.enumerated() {
            let names = [lang == .ar ? c.nameAr : c.nameEn, lang == .ar ? c.nameEn : c.nameAr]
            var best = 0.0
            for (i, n) in (names + c.aliasesAr + c.aliasesEn).enumerated() {
                let d = editDistance(qc, compact(normalize(n)), limit: limit)
                if d <= limit { best = max(best, 3 - Double(d) - Double(min(i, 2)) * 0.25) }
            }
            if best > 0 { scored.append((c, best, idx)) }
        }
    }
    let key: (Country) -> String = lang == .ar ? { $0.sortAr } : { $0.sortEn }
    return scored.sorted { a, b in
        if a.score != b.score { return a.score > b.score }
        let ka = key(a.c), kb = key(b.c)
        if ka != kb { return less(ka, kb) }
        return a.idx < b.idx
    }.map(\.c)
}

/// Optimal string alignment distance (insertions, deletions, substitutions, adjacent swaps), compared by
/// UTF-16 code unit. Returns limit + 1 as soon as the distance must exceed `limit`.
public func editDistance(_ a: String, _ b: String, limit: Int) -> Int {
    let a = Array(a.utf16), b = Array(b.utf16)
    if abs(a.count - b.count) > limit { return limit + 1 }
    var prev2: [Int] = []
    var prev = Array(0...b.count)
    if a.isEmpty { return prev[b.count] }
    for i in 1...a.count {
        var cur = [Int](repeating: 0, count: b.count + 1)
        cur[0] = i
        var low = i
        if !b.isEmpty {
            for j in 1...b.count {
                let cost = a[i - 1] == b[j - 1] ? 0 : 1
                var v = min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost)
                if i > 1 && j > 1 && a[i - 1] == b[j - 2] && a[i - 2] == b[j - 1] { v = min(v, prev2[j - 2] + 1) }
                cur[j] = v
                low = min(low, v)
            }
        }
        if low > limit { return limit + 1 }
        prev2 = prev
        prev = cur
    }
    return prev[b.count]
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

private let addressTokens: [Unicode.Scalar: AddressField] = [
    "N": .name, "O": .organization, "A": .street, "D": .sublocality,
    "C": .city, "S": .region, "Z": .postalCode, "X": .sortingCode,
]

private let fixedLabels: [AddressField: (ar: String, en: String)] = [
    .name: ("الاسم", "Name"),
    .organization: ("المنشأة", "Organization"),
    .street: ("العنوان", "Street address"),
    .sortingCode: ("رمز الفرز", "Sorting code"),
]

/// The address form of a country: its fields line by line, in the country's order, with labels in `lang` and
/// whether the postal service requires each one. Tokens the format uses beyond Google's nine are skipped.
public func addressForm(_ country: Country, lang: Lang = .en) -> [[AddressFormField]] {
    let a = country.address
    func pick(_ ar: String?, _ en: String?) -> String? { lang == .ar ? ar : en }
    func cap(_ s: String?) -> String? {
        guard let s, !s.isEmpty, lang == .en else { return s }
        return s.prefix(1).uppercased() + s.dropFirst()
    }
    func labelOf(_ f: AddressField) -> String? {
        if let fixed = fixedLabels[f] { return lang == .ar ? fixed.ar : fixed.en }
        switch f {
        case .city: return pick(a.localityLabelAr, a.localityLabelEn)
        case .sublocality: return pick(a.sublocalityLabelAr, a.sublocalityLabelEn)
        case .region: return cap(pick(a.regionLabelAr, a.regionLabelEn))
        default: return pick(a.postalCodeLabelAr, a.postalCodeLabelEn)
        }
    }
    var seen = Set<AddressField>()
    return (a.addressFormat ?? "%N%n%O%n%A%n%C")
        .components(separatedBy: "%n")
        .map { line -> [AddressFormField] in
            var fields: [AddressFormField] = []
            let chars = Array(line.unicodeScalars)
            for i in chars.indices.dropLast() where chars[i] == "%" {
                guard let f = addressTokens[chars[i + 1]], !seen.contains(f) else { continue }
                seen.insert(f)
                fields.append(AddressFormField(field: f, label: labelOf(f), required: a.requiredFields.contains(f.rawValue)))
            }
            return fields
        }
        .filter { !$0.isEmpty }
}

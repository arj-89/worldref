import Foundation

private let letterMap: [UInt32: UInt32] = [
    0x623: 0x627, 0x625: 0x627, 0x622: 0x627, 0x671: 0x627,
    0x629: 0x647, 0x649: 0x64A, 0x624: 0x648, 0x626: 0x64A,
]

/// Arabic-Indic and Persian digits to Western (0-9). Nothing else changes.
public func westernDigits(_ text: String) -> String {
    var out = String.UnicodeScalarView()
    for s in text.unicodeScalars {
        switch s.value {
        case 0x660...0x669: out.append(Unicode.Scalar(0x30 + s.value - 0x660)!)
        case 0x6F0...0x6F9: out.append(Unicode.Scalar(0x30 + s.value - 0x6F0)!)
        default: out.append(s)
        }
    }
    return String(out)
}

/// Folds a name or a query for matching: case, accents, Arabic letter variants, tashkeel, tatweel, the "al" prefix, punctuation.
public func normalize(_ text: String) -> String {
    let folded = westernDigits(text).decomposedStringWithCanonicalMapping.lowercased()
    var scalars = String.UnicodeScalarView()
    var pendingSpace = false
    for s in folded.unicodeScalars {
        var v = s.value
        if (0x300...0x36F).contains(v) || (0x64B...0x65F).contains(v) || v == 0x670 || v == 0x640 { continue }
        v = letterMap[v] ?? v
        let u = Unicode.Scalar(v)!
        switch u.properties.generalCategory {
        case .uppercaseLetter, .lowercaseLetter, .titlecaseLetter, .modifierLetter, .otherLetter,
             .decimalNumber, .letterNumber, .otherNumber:
            if pendingSpace && !scalars.isEmpty { scalars.append(" ") }
            pendingSpace = false
            scalars.append(u)
        default:
            pendingSpace = true
        }
    }
    return String(scalars).split(separator: " ").map { w -> String in
        w.unicodeScalars.starts(with: "ال".unicodeScalars) && w.utf16.count > 3 ? String(w.dropFirst(2)) : String(w)
    }.joined(separator: " ")
}

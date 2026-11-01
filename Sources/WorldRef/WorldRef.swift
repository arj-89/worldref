import Foundation

/// Bundled dataset: 242 countries and territories in Arabic and English.
public enum WorldRef {
    private static func load<T: Decodable>(_ name: String) -> [T] {
        guard let url = Bundle.module.url(forResource: name, withExtension: "json", subdirectory: "Resources")
            ?? Bundle.module.url(forResource: name, withExtension: "json"),
            let data = try? Data(contentsOf: url),
            let rows = try? JSONDecoder().decode([T].self, from: data)
        else { fatalError("WorldRef: cannot load \(name).json") }
        return rows
    }

    /// All countries, in data order.
    public static let countries: [Country] = load("worldref")

    /// All subdivisions.
    public static let subdivisions: [Subdivision] = load("subdivisions")

    private static let byIso2: [String: Country] = Dictionary(uniqueKeysWithValues: countries.map { ($0.iso2, $0) })

    /// Country by ISO 3166-1 alpha-2 code, case-insensitive.
    public static func country(iso2: String) -> Country? {
        byIso2[iso2.uppercased()]
    }

    /// Subdivisions of one country, by its alpha-2 code (case-insensitive).
    public static func subdivisions(iso2: String) -> [Subdivision] {
        let code = iso2.uppercased()
        return subdivisions.filter { $0.iso2 == code }
    }
}

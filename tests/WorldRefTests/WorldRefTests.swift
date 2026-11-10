import XCTest
@testable import WorldRef

final class WorldRefTests: XCTestCase {
    private lazy var vectors: [String: Any] = {
        let url = URL(fileURLWithPath: #filePath)
            .deletingLastPathComponent().deletingLastPathComponent().deletingLastPathComponent()
            .appendingPathComponent("tests/vectors.json")
        return try! JSONSerialization.jsonObject(with: Data(contentsOf: url)) as! [String: Any]
    }()
    private let all = WorldRef.countries

    func testDataLoads() {
        XCTAssertEqual(all.count, 242)
        XCTAssertEqual(WorldRef.country(iso2: "sa")?.nameEn, "Saudi Arabia")
        XCTAssertFalse(WorldRef.subdivisions.isEmpty)
        XCTAssertFalse(WorldRef.subdivisions(iso2: "SA").isEmpty)
    }

    func testWesternDigits() {
        for pair in vectors["westernDigits"] as! [[String]] { XCTAssertEqual(westernDigits(pair[0]), pair[1], pair[0]) }
    }

    func testNormalize() {
        for pair in vectors["normalize"] as! [[String]] { XCTAssertEqual(normalize(pair[0]), pair[1], pair[0]) }
    }

    func testSearch() {
        for c in vectors["search"] as! [[String: Any]] {
            let q = c["query"] as! String
            let hits = search(all, q, lang: Lang(rawValue: c["lang"] as! String)!)
            if let n = c["count"] as? Int { XCTAssertEqual(hits.count, n, q) }
            if let f = c["first"] as? String { XCTAssertEqual(hits.first?.iso2, f, q) }
        }
    }

    func testSearchCoversVectors() {
        XCTAssertFalse((vectors["search"] as! [[String: Any]]).isEmpty)
    }

    func testAddressForm() {
        for c in vectors["addressForm"] as! [[String: Any]] {
            let iso2 = c["iso2"] as! String, lang = c["lang"] as! String
            let got = addressForm(WorldRef.country(iso2: iso2)!, lang: Lang(rawValue: lang)!)
            let want = c["lines"] as! [[[Any]]]
            XCTAssertEqual(got.count, want.count, "\(iso2) \(lang) lines")
            for (g, w) in zip(got, want) {
                XCTAssertEqual(g.count, w.count, "\(iso2) \(lang) fields")
                for (f, e) in zip(g, w) {
                    XCTAssertEqual(f.field.rawValue, e[0] as? String, "\(iso2) \(lang)")
                    XCTAssertEqual(f.label, e[1] as? String, "\(iso2) \(lang) \(f.field.rawValue)")
                    XCTAssertEqual(f.required, e[2] as? Bool, "\(iso2) \(lang) \(f.field.rawValue)")
                }
            }
        }
    }

    func testEditDistance() {
        for c in vectors["editDistance"] as! [[Any]] {
            let a = c[0] as! String, b = c[1] as! String
            XCTAssertEqual(editDistance(a, b, limit: c[2] as! Int), c[3] as? Int, "\(a) \(b)")
        }
    }

    func testNewFieldsDecode() {
        let us = WorldRef.country(iso2: "US")!
        XCTAssertFalse(us.geo.timezoneOffsets.isEmpty)
        XCTAssertTrue(us.address.requiredFields.contains("postal_code"))
        XCTAssertEqual(us.address.postalCodeLabelEn, "ZIP code")
        XCTAssertTrue(WorldRef.subdivisions(iso2: "AD").contains { $0.typeEn != nil })
    }

    func testDecodesPre120Data() throws {
        let geo = try JSONDecoder().decode(Geo.self, from: Data("""
            {"capital_ar":null,"capital_en":"X","lat":1,"lng":2,"area_km2":3,"population":4,"population_year":2020,
             "timezones":["Asia/Riyadh"],"driving_side":"right"}
            """.utf8))
        XCTAssertEqual(geo.timezoneOffsets, [])
        XCTAssertEqual(geo.timezones, ["Asia/Riyadh"])
        XCTAssertEqual(geo.drivingSide, "right")
        let address = try JSONDecoder().decode(Address.self, from: Data("""
            {"postal_code_format":"#####","postal_code_regex":null,"postal_code_example":"12345",
             "address_format":"%N%n%A%n%C %Z","region_label_ar":null,"region_label_en":"province"}
            """.utf8))
        XCTAssertEqual(address.requiredFields, [])
        XCTAssertNil(address.localityLabelEn)
        XCTAssertEqual(address.regionLabelEn, "province")
        let sub = try JSONDecoder().decode(Subdivision.self, from: Data("""
            {"iso2":"SA","code":"SA-01","name_ar":"الرياض","name_en":"Riyadh","parent":null}
            """.utf8))
        XCTAssertNil(sub.typeEn)
        // Every field of a re-encoded record survives the custom decoders.
        let us = WorldRef.country(iso2: "US")!
        XCTAssertEqual(try JSONDecoder().decode(Country.self, from: JSONEncoder().encode(us)), us)
    }

    func testSort() {
        for c in vectors["sort"] as! [[String: Any]] {
            let head = c["head"] as! [String]
            let got = sortCountries(all, lang: Lang(rawValue: c["lang"] as! String)!, first: c["first"] as? String)
                .prefix(head.count).map(\.iso2)
            XCTAssertEqual(Array(got), head, "\(c)")
        }
    }

    func testPhone() throws {
        for c in vectors["phone"] as! [[String: Any]] {
            let input = c["input"] as! String
            let p = try XCTUnwrap(parsePhone(input, country: WorldRef.country(iso2: c["country"] as! String)!, all: all), input)
            XCTAssertEqual(p.e164, c["e164"] as? String, input)
            XCTAssertEqual(p.iso2, c["iso2"] as? String, input)
            XCTAssertEqual(p.valid, c["valid"] as? Bool, input)
            XCTAssertEqual(p.mobile, c["mobile"] as? Bool, input)
        }
    }

    func testAbsent() {
        for a in vectors["absent"] as! [String] {
            XCTAssertNil(WorldRef.country(iso2: a), a)
            XCTAssertFalse(all.contains { $0.iso2 == a || $0.iso3 == a }, a)
        }
    }

    func testFormatAndMobile() {
        let sa = WorldRef.country(iso2: "SA")!
        XCTAssertTrue(isValidMobile("0501234567", country: sa))
        XCTAssertEqual(formatNational("501234567", plan: sa.phone[0]).replacingOccurrences(of: " ", with: "").count, 9)
    }
}

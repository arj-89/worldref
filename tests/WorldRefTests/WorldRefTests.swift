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

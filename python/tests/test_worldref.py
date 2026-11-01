import json
import unittest
from pathlib import Path

import worldref
from worldref import (
    by_iso2, countries, normalize, parse_phone, search, sort_countries, subdivisions, western_digits,
)

V = json.loads((Path(__file__).resolve().parent / ".." / ".." / "tests" / "vectors.json").read_text(encoding="utf-8"))


class Vectors(unittest.TestCase):
    def test_western_digits(self) -> None:
        for i, o in V["westernDigits"]:
            self.assertEqual(western_digits(i), o, i)

    def test_normalize(self) -> None:
        for i, o in V["normalize"]:
            self.assertEqual(normalize(i), o, i)

    def test_search(self) -> None:
        for c in V["search"]:
            hits = search(countries(), c["query"], c["lang"])
            if "count" in c:
                self.assertEqual(len(hits), c["count"], c["query"])
            if c.get("first"):
                self.assertTrue(hits, c["query"])
                self.assertEqual(hits[0].iso2, c["first"], f'{c["query"]} -> {[h.iso2 for h in hits[:3]]}')

    def test_sort(self) -> None:
        for c in V["sort"]:
            n = len(c["head"])
            head = [x.iso2 for x in sort_countries(countries(), c["lang"], c["first"])[:n]]
            self.assertEqual(head, c["head"], f'{c["lang"]} {c["first"]}')

    def test_phone(self) -> None:
        for c in V["phone"]:
            country = by_iso2(c["country"])
            assert country is not None
            p = parse_phone(c["input"], country, countries())
            self.assertIsNotNone(p, c["input"])
            assert p is not None
            got = (p.e164, p.iso2, p.valid, p.mobile)
            self.assertEqual(got, (c["e164"], c["iso2"], c["valid"], c["mobile"]), c["input"])

    def test_absent(self) -> None:
        for token in V["absent"]:
            self.assertIsNone(by_iso2(token), token)
            self.assertFalse(any(token in (c.iso2, c.iso3, c.name_en, c.name_ar) for c in countries()), token)
            self.assertFalse([c for c in search(countries(), token, "en") if c.iso2 == token], token)


class Data(unittest.TestCase):
    def test_shape(self) -> None:
        self.assertEqual(len(countries()), 242)
        sa = by_iso2("sa")
        assert sa is not None
        self.assertEqual(sa.iso2, "SA")
        self.assertEqual(sa.phone[0].calling_code, "+966")
        self.assertIsNone(by_iso2("ZZ"))

    def test_subdivisions(self) -> None:
        self.assertEqual(len(subdivisions()), 5012)
        sa = subdivisions("sa")
        self.assertTrue(sa and all(s.iso2 == "SA" for s in sa))

    def test_every_pattern_compiles(self) -> None:
        for c in countries():
            for p in c.phone:
                for pat in (p.pattern, p.mobile_pattern, p.leading_digits):
                    if pat:
                        worldref.helpers._regex(pat)

    def test_format_national(self) -> None:
        sa = by_iso2("SA")
        assert sa is not None
        plan = sa.phone[0]
        self.assertTrue(worldref.is_valid_mobile("0501234567", sa))
        self.assertEqual(worldref.format_national("12", plan), "12")


if __name__ == "__main__":
    unittest.main()

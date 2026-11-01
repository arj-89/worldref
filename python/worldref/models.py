"""Typed records for the bilingual build. Nullable fields are Optional, as in the JSON schema."""
from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Dict, List, Optional, Tuple

Json = Dict[str, Any]


@dataclass(frozen=True)
class PhonePlan:
    calling_code: str
    leading_digits: Optional[str]
    primary: bool
    trunk_prefix: Optional[str]
    pattern: Optional[str]
    lengths: Tuple[int, ...]
    mobile_pattern: Optional[str]
    mobile_lengths: Tuple[int, ...]
    mobile_prefixes: Tuple[str, ...]
    mobile_distinguishable: bool
    mobile_example: Optional[str]
    mobile_format: Optional[str]

    @classmethod
    def from_dict(cls, d: Json) -> "PhonePlan":
        return cls(
            d["calling_code"], d["leading_digits"], d["primary"], d["trunk_prefix"], d["pattern"],
            tuple(d["lengths"]), d["mobile_pattern"], tuple(d["mobile_lengths"]), tuple(d["mobile_prefixes"]),
            d["mobile_distinguishable"], d["mobile_example"], d["mobile_format"],
        )


@dataclass(frozen=True)
class Currency:
    code: str
    name_ar: Optional[str]
    name_en: Optional[str]
    symbol: Optional[str]
    symbol_ar: Optional[str]
    symbol_fallback: Optional[str]

    @classmethod
    def from_dict(cls, d: Json) -> "Currency":
        return cls(d["code"], d["name_ar"], d["name_en"], d["symbol"], d["symbol_ar"], d["symbol_fallback"])


@dataclass(frozen=True)
class Nationality:
    nationality_ar_m: Optional[str]
    nationality_ar_f: Optional[str]
    nationality_en: Optional[str]
    icao_code: Optional[str]

    @classmethod
    def from_dict(cls, d: Json) -> "Nationality":
        return cls(d["nationality_ar_m"], d["nationality_ar_f"], d["nationality_en"], d["icao_code"])


@dataclass(frozen=True)
class Geo:
    capital_ar: Optional[str]
    capital_en: Optional[str]
    lat: Optional[float]
    lng: Optional[float]
    area_km2: Optional[float]
    population: Optional[int]
    population_year: Optional[int]
    timezones: Tuple[str, ...]
    driving_side: Optional[str]  # "left" | "right"

    @classmethod
    def from_dict(cls, d: Json) -> "Geo":
        return cls(
            d["capital_ar"], d["capital_en"], d["lat"], d["lng"], d["area_km2"], d["population"],
            d["population_year"], tuple(d["timezones"]), d["driving_side"],
        )


@dataclass(frozen=True)
class Language:
    code: str
    name_ar: Optional[str]
    name_en: Optional[str]


@dataclass(frozen=True)
class Locale:
    languages: Tuple[Language, ...]
    week_start: str
    weekend: Tuple[str, ...]
    calendars: Tuple[str, ...]
    measurement: str  # "metric" | "us" | "uk"

    @classmethod
    def from_dict(cls, d: Json) -> "Locale":
        langs = tuple(Language(x["code"], x["name_ar"], x["name_en"]) for x in d["languages"])
        return cls(langs, d["week_start"], tuple(d["weekend"]), tuple(d["calendars"]), d["measurement"])


@dataclass(frozen=True)
class Address:
    postal_code_format: Optional[str]
    postal_code_regex: Optional[str]
    postal_code_example: Optional[str]
    address_format: Optional[str]
    region_label_ar: Optional[str]
    region_label_en: Optional[str]

    @classmethod
    def from_dict(cls, d: Json) -> "Address":
        return cls(
            d["postal_code_format"], d["postal_code_regex"], d["postal_code_example"],
            d["address_format"], d["region_label_ar"], d["region_label_en"],
        )


@dataclass(frozen=True)
class Emergency:
    police: Optional[str]
    ambulance: Optional[str]
    fire: Optional[str]
    general: Optional[str]


@dataclass(frozen=True)
class Travel:
    emergency: Optional[Emergency]
    plug_types: Tuple[str, ...]
    voltage: Tuple[int, ...]
    frequency_hz: Optional[Tuple[int, ...]]

    @classmethod
    def from_dict(cls, d: Json) -> "Travel":
        e = d["emergency"]
        freq = d["frequency_hz"]
        return cls(
            Emergency(e["police"], e["ambulance"], e["fire"], e["general"]) if e is not None else None,
            tuple(d["plug_types"]), tuple(d["voltage"]), tuple(freq) if freq is not None else None,
        )


@dataclass(frozen=True)
class Sports:
    fifa: Optional[str]
    ioc: Optional[str]


@dataclass(frozen=True)
class Country:
    iso2: str
    iso3: Optional[str]
    iso_numeric: Optional[str]
    kind: str  # "country" | "territory"
    name_ar: str
    name_en: str
    official_name_ar: Optional[str]
    official_name_en: Optional[str]
    aliases_ar: Tuple[str, ...]
    aliases_en: Tuple[str, ...]
    flag: str
    flag_svg: str
    continent: Optional[str]  # africa | americas | asia | europe | oceania
    groups: Tuple[str, ...]
    un_member: bool
    tld: Optional[str]
    sort_ar: str
    sort_en: str
    nationality: Nationality
    phone: Tuple[PhonePlan, ...]
    currencies: Tuple[Currency, ...]
    geo: Geo
    locale: Locale
    address: Address
    travel: Travel
    sports: Sports

    @classmethod
    def from_dict(cls, d: Json) -> "Country":
        return cls(
            d["iso2"], d["iso3"], d["iso_numeric"], d["kind"], d["name_ar"], d["name_en"],
            d["official_name_ar"], d["official_name_en"], tuple(d["aliases_ar"]), tuple(d["aliases_en"]),
            d["flag"], d["flag_svg"], d["continent"], tuple(d["groups"]), d["un_member"], d["tld"],
            d["sort_ar"], d["sort_en"], Nationality.from_dict(d["nationality"]),
            tuple(PhonePlan.from_dict(p) for p in d["phone"]),
            tuple(Currency.from_dict(c) for c in d["currencies"]),
            Geo.from_dict(d["geo"]), Locale.from_dict(d["locale"]), Address.from_dict(d["address"]),
            Travel.from_dict(d["travel"]), Sports(d["sports"]["fifa"], d["sports"]["ioc"]),
        )


@dataclass(frozen=True)
class Subdivision:
    iso2: str
    code: str
    name_ar: Optional[str]
    name_en: Optional[str]
    parent: Optional[str]

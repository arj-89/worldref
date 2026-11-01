"""Search, sorting and phone parsing. Mirrors src/helpers.ts, including ranking weights and tie-breaks."""
import re
from dataclasses import dataclass
from functools import lru_cache
from typing import Optional, Pattern, Protocol, Sequence, Tuple, TypeVar

from .models import Country, PhonePlan
from .text import normalize, western_digits


class Searchable(Protocol):
    @property
    def iso2(self) -> str: ...
    @property
    def iso3(self) -> Optional[str]: ...
    @property
    def name_ar(self) -> str: ...
    @property
    def name_en(self) -> str: ...
    @property
    def aliases_ar(self) -> Sequence[str]: ...
    @property
    def aliases_en(self) -> Sequence[str]: ...
    @property
    def sort_ar(self) -> str: ...
    @property
    def sort_en(self) -> str: ...
    @property
    def phone(self) -> Sequence[PhonePlan]: ...


T = TypeVar("T", bound=Searchable)

_DIAL = re.compile(r"(\+|00)?[0-9]{1,4}")
_DIAL_PREFIX = re.compile(r"^(\+|00)")
_SPACING = re.compile(r"[\s()\-﻿]")


@lru_cache(maxsize=None)
def _regex(pattern: str) -> Pattern[str]:
    return re.compile(f"(?:{pattern})")


def _full_match(pattern: Optional[str], s: str) -> bool:
    return bool(pattern) and _regex(pattern).fullmatch(s) is not None  # type: ignore[arg-type]


def _rank(name: str, q: str, place: int) -> int:
    # Tiers: exact (50s), name starts with the query (40s), a word starts with it (30s), contains it (10s).
    if name == q:
        return 50 - place
    if name.startswith(q):
        return 40 - place
    if any(w.startswith(q) for w in name.split(" ")):
        return 30 - place
    if len(q) >= 3 and q in name:
        return 10 - place
    return 0


def search(countries: Sequence[T], query: str, lang: str = "en") -> list:
    """Countries matching a query, best first. Matches names and aliases in both languages, ISO codes, and dial codes."""
    q = normalize(query)
    if not q:
        return []
    digits = _SPACING.sub("", western_digits(query))
    dial = _DIAL_PREFIX.sub("", digits) if _DIAL.fullmatch(digits) else None
    upper = query.strip().upper()
    ar = lang == "ar"
    scored = []
    for c in countries:
        own = normalize(c.name_ar if ar else c.name_en)
        other = normalize(c.name_en if ar else c.name_ar)
        aliases = [normalize(a) for a in (*c.aliases_ar, *c.aliases_en)]
        score = max(_rank(own, q, 0), _rank(other, q, 1), *(_rank(a, q, 2) for a in aliases))
        score = float(score)
        if upper == c.iso2 or upper == c.iso3:
            score = max(score, 49.5)
        codes = [(p.calling_code[1:], p.primary) for p in c.phone]
        if dial is not None and any(cc == dial for cc, _ in codes):
            score = max(score, 46 if any(cc == dial and primary for cc, primary in codes) else 45)
        elif dial is not None and any(cc.startswith(dial) for cc, _ in codes):
            score = max(score, 5)
        if score:
            scored.append((score, c))
    scored.sort(key=lambda sc: (-sc[0], sc[1].sort_ar if ar else sc[1].sort_en))
    return [c for _, c in scored]


def sort_countries(countries: Sequence[T], lang: str = "en", first: Optional[str] = None) -> list:
    """Alphabetical in the UI language (code point order), with the user's country (if given) first. Returns a new list."""
    pin = first.upper() if first else None
    key = (lambda c: c.sort_ar) if lang == "ar" else (lambda c: c.sort_en)
    return sorted(countries, key=lambda c: (c.iso2 != pin, key(c)))


@dataclass(frozen=True)
class ParsedPhone:
    e164: str  # international format; store together with iso2
    iso2: str
    calling_code: str
    national: str
    valid: bool
    mobile: bool


class _Phoned(Protocol):
    @property
    def iso2(self) -> str: ...
    @property
    def phone(self) -> Sequence[PhonePlan]: ...


def parse_phone(input: str, country: _Phoned, all: Optional[Sequence[_Phoned]] = None) -> Optional[ParsedPhone]:
    """Reads what a user typed into a phone field. Numbers typed with + or 00 are matched against `all` (or `country` alone)."""
    s = re.sub(r"[^0-9+]", "", western_digits(input))
    if not s:
        return None
    plans: list = []  # (iso2, plan, rest)
    if s.startswith("+") or s.startswith("00"):
        s = _DIAL_PREFIX.sub("", s)
        for c in (all if all is not None else [country]):
            for plan in c.phone:
                cc = plan.calling_code[1:]
                if not s.startswith(cc):
                    continue
                rest = s[len(cc):]
                if plan.leading_digits and _regex(plan.leading_digits).match(rest) is None:
                    continue
                plans.append((c.iso2, plan, rest))

        # Shared codes (+1, +7, +44...): the picked country first, then a plan whose leading digits matched,
        # then one whose mobile pattern fits, then a secondary plan whose own pattern fits, then the main country.
        def weight(p: Tuple[str, PhonePlan, str]) -> int:
            iso2, plan, rest = p
            return (
                (16 if iso2 == country.iso2 else 0)
                + (8 if plan.leading_digits else 0)
                + (4 if _full_match(plan.mobile_pattern, rest) else 0)
                + (2 if not plan.primary and _full_match(plan.pattern, rest) else 0)
                + (1 if plan.primary else 0)
            )

        plans.sort(key=lambda p: -weight(p))
    else:
        for plan in country.phone:
            trunk = plan.trunk_prefix
            rest = s[len(trunk):] if trunk and s.startswith(trunk) and not _full_match(plan.pattern, s) else s
            plans.append((country.iso2, plan, rest))
    if not plans:
        return None
    iso2, plan, rest = next((p for p in plans if _full_match(p[1].pattern, p[2])), plans[0])
    return ParsedPhone(
        e164=f"{plan.calling_code}{rest}",
        iso2=iso2,
        calling_code=plan.calling_code,
        national=rest,
        valid=_full_match(plan.pattern, rest),
        mobile=_full_match(plan.mobile_pattern, rest),
    )


def is_valid_mobile(input: str, country: _Phoned, all: Optional[Sequence[_Phoned]] = None) -> bool:
    """True when the input is a valid mobile number for the country."""
    p = parse_phone(input, country, all)
    return p is not None and p.valid and p.mobile and (all is None or p.iso2 == country.iso2)


def format_national(national: str, plan: PhonePlan) -> str:
    """Groups national digits with the plan's mobile_format mask; returns the digits as-is when the mask does not fit."""
    mask = plan.mobile_format
    if not mask or mask.count("#") != len(national):
        return national
    it = iter(national)
    return "".join(next(it) if ch == "#" else ch for ch in mask)

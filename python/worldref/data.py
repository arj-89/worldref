"""Loads the bundled JSON once and exposes typed records."""
import json
from functools import lru_cache
from pathlib import Path
from typing import List, Optional, Tuple

from .models import Country, Subdivision

_DIR = Path(__file__).parent / "data"


def _load(name: str) -> list:
    with open(_DIR / name, encoding="utf-8") as f:
        return json.load(f)


@lru_cache(maxsize=None)
def countries() -> Tuple[Country, ...]:
    """Every country and territory, in file order."""
    return tuple(Country.from_dict(d) for d in _load("worldref.json"))


@lru_cache(maxsize=None)
def _by_iso2() -> dict:
    return {c.iso2: c for c in countries()}


def by_iso2(iso2: str) -> Optional[Country]:
    """Lookup by ISO 3166-1 alpha-2 code, case-insensitive. None when absent."""
    return _by_iso2().get(iso2.strip().upper())


@lru_cache(maxsize=None)
def _subdivisions() -> Tuple[Subdivision, ...]:
    return tuple(Subdivision(d["iso2"], d["code"], d["name_ar"], d["name_en"], d["parent"]) for d in _load("subdivisions.json"))


def subdivisions(iso2: Optional[str] = None) -> List[Subdivision]:
    """All subdivisions, or those of one country (case-insensitive iso2)."""
    if iso2 is None:
        return list(_subdivisions())
    code = iso2.strip().upper()
    return [s for s in _subdivisions() if s.iso2 == code]

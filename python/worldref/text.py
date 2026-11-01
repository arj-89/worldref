"""Text folding shared by search and sorting. Mirrors the reference implementation in src/text.ts."""
import re
import unicodedata

_DIGITS = re.compile("[٠-٩۰-۹]")
_MARKS = re.compile("[ً-ٰٟـ]")
_LETTERS = str.maketrans({"أ": "ا", "إ": "ا", "آ": "ا", "ٱ": "ا", "ة": "ه", "ى": "ي", "ؤ": "و", "ئ": "ي"})


def western_digits(text: str) -> str:
    """Arabic-Indic and Persian digits to Western (0-9). Nothing else changes."""
    return _DIGITS.sub(lambda m: str(ord(m.group()) & 0xF), text)


def normalize(text: str) -> str:
    """Folds a name or a query for matching: case, accents, Arabic letter variants, tashkeel, tatweel, "ال", punctuation."""
    s = unicodedata.normalize("NFD", western_digits(text))
    s = "".join(ch for ch in s if not "̀" <= ch <= "ͯ").lower()
    s = _MARKS.sub("", s).translate(_LETTERS)
    s = "".join(ch if unicodedata.category(ch)[0] in "LN" else " " for ch in s)
    words = s.split()
    return " ".join(w[2:] if w.startswith("ال") and len(w) > 3 else w for w in words)

// The reference text normalisation. Every language package implements exactly this, and the shared test
// cases in tests/vectors.json hold them to it.

const DIGITS = /[٠-٩۰-۹]/g;
const MARKS = /[ً-ٰٟـ]/g; // tashkeel, superscript alef, tatweel
const LETTERS = { "أ": "ا", "إ": "ا", "آ": "ا", "ٱ": "ا", "ة": "ه", "ى": "ي", "ؤ": "و", "ئ": "ي" };

/** Arabic-Indic (٠-٩) and Persian (۰-۹) digits to Western (0-9). Nothing else changes. */
export const westernDigits = (s) => s.replace(DIGITS, (d) => String((d.charCodeAt(0) & 0xf) % 10));

/** Folds a name or a query for matching: case, accents, Arabic letter variants, tashkeel, «ال», punctuation. */
export function normalize(s) {
    return westernDigits(s)
        .normalize("NFD")
        .replace(/[̀-ͯ]/g, "")
        .toLowerCase()
        .replace(MARKS, "")
        .replace(/[أإآٱةىؤئ]/g, (c) => LETTERS[c])
        .replace(/[^\p{L}\p{N}]+/gu, " ")
        .trim()
        .split(" ")
        .map((w) => (w.startsWith("ال") && w.length > 3 ? w.slice(2) : w))
        .join(" ");
}

/** Sort key: the normalised name. Unicode order of the folded Arabic letters is the Arabic alphabetical order. */
export const sortKey = (s) => normalize(s);

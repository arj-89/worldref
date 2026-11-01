// Text folding shared by search and sorting. Mirrors scripts/lib/text.mjs; tests/vectors.json keeps every
// language package identical to it.

const DIGITS = /[٠-٩۰-۹]/g;
const MARKS = /[ً-ٰٟـ]/g;
const LETTERS: Record<string, string> = { "أ": "ا", "إ": "ا", "آ": "ا", "ٱ": "ا", "ة": "ه", "ى": "ي", "ؤ": "و", "ئ": "ي" };

/** Arabic-Indic (٠-٩) and Persian (۰-۹) digits to Western (0-9). Nothing else changes. */
export function westernDigits(text: string): string {
    return text.replace(DIGITS, (d) => String(d.charCodeAt(0) & 0xf));
}

/** Folds a name or a query for matching: case, accents, Arabic letter variants, tashkeel, tatweel, «ال», punctuation. */
export function normalize(text: string): string {
    return westernDigits(text)
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

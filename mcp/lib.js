// Re-exports the package API for the CLI, plus single-language views of a record.
export { countries, byIso2, search, parsePhone } from "../dist/index.js";

/** `x_ar` becomes `x` and `x_en` is dropped (or the reverse), recursively. Same rule as the .ar/.en builds. */
export function localizeRecord(value, lang) {
    if (Array.isArray(value)) return value.map((v) => localizeRecord(v, lang));
    if (!value || typeof value !== "object") return value;
    const other = lang === "ar" ? "en" : "ar";
    const out = {};
    for (const [k, v] of Object.entries(value)) {
        const m = k.match(/^(.*)_(ar|en)(_[mf])?$/);
        if (m && m[2] === other) continue;
        out[m ? m[1] + (m[3] ?? "") : k] = localizeRecord(v, lang);
    }
    return out;
}

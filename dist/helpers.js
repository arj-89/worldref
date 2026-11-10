import { normalize, westernDigits } from "./text.js";
/**
 * Countries matching a query, best first. Matches names and aliases in both languages (ignoring «ال», tashkeel,
 * hamza forms, case, accents, spaces and punctuation), ISO codes, and dial codes with or without «+» or «00».
 * When nothing matches, a second pass forgives small typos ("Kuwiat"): 1 edit for 4 to 7 letters, 2 from 8.
 */
export function search(countries, query, lang = "en") {
    const q = normalize(query);
    if (!q)
        return [];
    const qc = q.replace(/ /g, "");
    const digits = westernDigits(query).replace(/[\s()-]/g, "");
    const dial = /^(\+|00)?\d{1,4}$/.test(digits) ? digits.replace(/^(\+|00)/, "") : null;
    const scored = [];
    for (const c of countries) {
        const own = normalize(lang === "ar" ? c.name_ar : c.name_en);
        const other = normalize(lang === "ar" ? c.name_en : c.name_ar);
        const aliases = [...c.aliases_ar, ...c.aliases_en].map(normalize);
        // Tiers: exact (50s), name starts with the query (40s), a word starts with it (30s), contains it (10s).
        // Within a tier: the UI-language name, then the other language, then aliases.
        const rank = (name, place) => {
            const nc = name.replace(/ /g, "");
            if (name === q || nc === qc)
                return 50 - place;
            if (name.startsWith(q) || (qc.length >= 3 && nc.startsWith(qc)))
                return 40 - place;
            if (name.split(" ").some((w) => w.startsWith(q)))
                return 30 - place;
            if (q.length >= 3 && name.includes(q))
                return 10 - place;
            return 0;
        };
        let score = Math.max(rank(own, 0), rank(other, 1), ...aliases.map((a) => rank(a, 2)));
        const upper = query.trim().toUpperCase();
        if (upper === c.iso2 || upper === c.iso3)
            score = Math.max(score, 49.5);
        const codes = (c.phone ?? []).map((p) => ({ cc: p.calling_code.slice(1), primary: p.primary }));
        if (dial && codes.some((p) => p.cc === dial))
            score = Math.max(score, codes.some((p) => p.cc === dial && p.primary) ? 46 : 45);
        else if (dial && codes.some((p) => p.cc.startsWith(dial)))
            score = Math.max(score, 5);
        if (score)
            scored.push({ c, score });
    }
    if (!scored.length && qc.length >= 4 && !/^\d+$/.test(qc)) {
        // Typo pass: edit distance between the query and whole names, spaces ignored.
        const limit = qc.length >= 8 ? 2 : 1;
        for (const c of countries) {
            const names = [lang === "ar" ? c.name_ar : c.name_en, lang === "ar" ? c.name_en : c.name_ar];
            const all = [...names, ...c.aliases_ar, ...c.aliases_en].map((n) => normalize(n).replace(/ /g, ""));
            let best = 0;
            all.forEach((n, i) => {
                const d = editDistance(qc, n, limit);
                if (d <= limit)
                    best = Math.max(best, 3 - d - Math.min(i, 2) * 0.25);
            });
            if (best)
                scored.push({ c, score: best });
        }
    }
    const key = lang === "ar" ? "sort_ar" : "sort_en";
    return scored.sort((a, b) => b.score - a.score || cmp(a.c[key], b.c[key])).map((s) => s.c);
}
/**
 * Optimal string alignment distance (insertions, deletions, substitutions, adjacent swaps), compared by
 * UTF-16 code unit. Returns limit + 1 as soon as the distance must exceed `limit`.
 */
export function editDistance(a, b, limit) {
    if (Math.abs(a.length - b.length) > limit)
        return limit + 1;
    let prev2 = [];
    let prev = Array.from({ length: b.length + 1 }, (_, j) => j);
    for (let i = 1; i <= a.length; i++) {
        const cur = [i];
        let low = i;
        for (let j = 1; j <= b.length; j++) {
            const cost = a[i - 1] === b[j - 1] ? 0 : 1;
            let v = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + cost);
            if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1])
                v = Math.min(v, prev2[j - 2] + 1);
            cur[j] = v;
            low = Math.min(low, v);
        }
        if (low > limit)
            return limit + 1;
        prev2 = prev;
        prev = cur;
    }
    return prev[b.length];
}
const cmp = (a, b) => (a < b ? -1 : a > b ? 1 : 0);
/** Alphabetical in the UI language, with the user's country (if given) first. Returns a new array. */
export function sortCountries(countries, lang = "en", first) {
    const key = lang === "ar" ? "sort_ar" : "sort_en";
    const pin = first?.toUpperCase();
    return [...countries].sort((a, b) => (a.iso2 === pin ? -1 : b.iso2 === pin ? 1 : cmp(a[key], b[key])));
}
const fullMatch = (pattern, s) => !!pattern && new RegExp(`^(?:${pattern})$`).test(s);
/**
 * Reads what a user typed into a phone field. `country` is the one picked in the field; numbers typed with
 * «+» or «00» are matched against `all` (or `country` alone if `all` is not given).
 */
export function parsePhone(input, country, all) {
    let s = westernDigits(input).replace(/[^\d+]/g, "");
    if (!s)
        return null;
    let plans = [];
    if (s.startsWith("+") || s.startsWith("00")) {
        s = s.replace(/^(\+|00)/, "");
        for (const c of all ?? [country])
            for (const plan of c.phone) {
                const cc = plan.calling_code.slice(1);
                if (!s.startsWith(cc))
                    continue;
                const rest = s.slice(cc.length);
                if (plan.leading_digits && !new RegExp(`^(?:${plan.leading_digits})`).test(rest))
                    continue;
                plans.push({ iso2: c.iso2, plan, rest });
            }
        // Shared codes (+1, +7, +44...): the picked country first, then a plan whose leading digits matched,
        // then one whose mobile pattern fits, then a secondary plan whose own pattern fits, then the main country.
        const weight = (p) => (p.iso2 === country.iso2 ? 16 : 0) +
            (p.plan.leading_digits ? 8 : 0) +
            (fullMatch(p.plan.mobile_pattern, p.rest) ? 4 : 0) +
            (!p.plan.primary && fullMatch(p.plan.pattern, p.rest) ? 2 : 0) +
            (p.plan.primary ? 1 : 0);
        plans.sort((a, b) => weight(b) - weight(a));
    }
    else {
        for (const plan of country.phone) {
            const rest = plan.trunk_prefix && s.startsWith(plan.trunk_prefix) && !fullMatch(plan.pattern, s) ? s.slice(plan.trunk_prefix.length) : s;
            plans.push({ iso2: country.iso2, plan, rest });
        }
    }
    if (!plans.length)
        return null;
    const pick = plans.find((p) => fullMatch(p.plan.pattern, p.rest)) ?? plans[0];
    const mobile = fullMatch(pick.plan.mobile_pattern, pick.rest);
    return {
        e164: `${pick.plan.calling_code}${pick.rest}`,
        iso2: pick.iso2,
        calling_code: pick.plan.calling_code,
        national: pick.rest,
        valid: fullMatch(pick.plan.pattern, pick.rest),
        mobile,
    };
}
/** True when the input is a valid mobile number for the country. */
export function isValidMobile(input, country, all) {
    const p = parsePhone(input, country, all);
    return !!p && p.valid && p.mobile && (!all || p.iso2 === country.iso2);
}
/** Groups national digits with the plan's mobile_format mask (5 123 4567 style); returns the digits as-is when the mask does not fit. */
export function formatNational(national, plan) {
    const mask = plan.mobile_format;
    if (!mask || mask.replace(/[^#]/g, "").length !== national.length)
        return national;
    let i = 0;
    return mask.replace(/#/g, () => national[i++]);
}
const ADDRESS_TOKENS = { N: "name", O: "organization", A: "street", D: "sublocality", C: "city", S: "region", Z: "postal_code", X: "sorting_code" };
const FIXED_LABELS = {
    name: { ar: "الاسم", en: "Name" },
    organization: { ar: "المنشأة", en: "Organization" },
    street: { ar: "العنوان", en: "Street address" },
    sorting_code: { ar: "رمز الفرز", en: "Sorting code" },
};
/**
 * The address form of a country: its fields line by line, in the country's order, with labels in `lang` and
 * whether the postal service requires each one. Tokens the format uses beyond Google's nine are skipped.
 */
export function addressForm(country, lang = "en") {
    const a = country.address;
    const pick = (ar, en) => (lang === "ar" ? ar : en);
    const cap = (s) => (s && lang === "en" ? s[0].toUpperCase() + s.slice(1) : s);
    const labelOf = (f) => {
        const fixed = FIXED_LABELS[f];
        if (fixed)
            return fixed[lang];
        if (f === "city")
            return pick(a.locality_label_ar, a.locality_label_en);
        if (f === "sublocality")
            return pick(a.sublocality_label_ar, a.sublocality_label_en);
        if (f === "region")
            return cap(pick(a.region_label_ar, a.region_label_en));
        return pick(a.postal_code_label_ar, a.postal_code_label_en);
    };
    const seen = new Set();
    return (a.address_format ?? "%N%n%O%n%A%n%C")
        .split("%n")
        .map((line) => [...line.matchAll(/%([A-Z])/g)]
        .map((m) => ADDRESS_TOKENS[m[1]])
        .filter((f) => !!f && !seen.has(f) && !!seen.add(f))
        .map((field) => ({ field, label: labelOf(field), required: a.required_fields.includes(field) })))
        .filter((line) => line.length);
}

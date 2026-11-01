import { normalize, westernDigits } from "./text.js";
import type { PhonePlan, Searchable } from "./types.js";

export type Lang = "ar" | "en";

/**
 * Countries matching a query, best first. Matches names and aliases in both languages (ignoring «ال», tashkeel,
 * hamza forms, case and accents), ISO codes, and dial codes with or without «+» or «00».
 */
export function search<T extends Searchable>(countries: readonly T[], query: string, lang: Lang = "en"): T[] {
    const q = normalize(query);
    if (!q) return [];
    const digits = westernDigits(query).replace(/[\s()-]/g, "");
    const dial = /^(\+|00)?\d{1,4}$/.test(digits) ? digits.replace(/^(\+|00)/, "") : null;
    const scored: { c: T; score: number }[] = [];
    for (const c of countries) {
        const own = normalize(lang === "ar" ? c.name_ar : c.name_en);
        const other = normalize(lang === "ar" ? c.name_en : c.name_ar);
        const aliases = [...c.aliases_ar, ...c.aliases_en].map(normalize);
        // Tiers: exact (50s), name starts with the query (40s), a word starts with it (30s), contains it (10s).
        // Within a tier: the UI-language name, then the other language, then aliases.
        const rank = (name: string, place: number) => {
            if (name === q) return 50 - place;
            if (name.startsWith(q)) return 40 - place;
            if (name.split(" ").some((w) => w.startsWith(q))) return 30 - place;
            if (q.length >= 3 && name.includes(q)) return 10 - place;
            return 0;
        };
        let score = Math.max(rank(own, 0), rank(other, 1), ...aliases.map((a) => rank(a, 2)));
        const upper = query.trim().toUpperCase();
        if (upper === c.iso2 || upper === c.iso3) score = Math.max(score, 49.5);
        const codes = (c.phone ?? []).map((p) => ({ cc: p.calling_code.slice(1), primary: p.primary }));
        if (dial && codes.some((p) => p.cc === dial)) score = Math.max(score, codes.some((p) => p.cc === dial && p.primary) ? 46 : 45);
        else if (dial && codes.some((p) => p.cc.startsWith(dial))) score = Math.max(score, 5);
        if (score) scored.push({ c, score });
    }
    const key = lang === "ar" ? "sort_ar" : "sort_en";
    return scored.sort((a, b) => b.score - a.score || cmp(a.c[key], b.c[key])).map((s) => s.c);
}

const cmp = (a: string, b: string) => (a < b ? -1 : a > b ? 1 : 0);

/** Alphabetical in the UI language, with the user's country (if given) first. Returns a new array. */
export function sortCountries<T extends Searchable>(countries: readonly T[], lang: Lang = "en", first?: string | null): T[] {
    const key = lang === "ar" ? "sort_ar" : "sort_en";
    const pin = first?.toUpperCase();
    return [...countries].sort((a, b) => (a.iso2 === pin ? -1 : b.iso2 === pin ? 1 : cmp(a[key], b[key])));
}

export interface ParsedPhone {
    /** International format, e.g. +966512345678. Store this together with `iso2`. */
    e164: string;
    iso2: string;
    calling_code: string;
    national: string;
    valid: boolean;
    mobile: boolean;
}

type WithPhone = Pick<Searchable, "iso2"> & { phone: PhonePlan[] };

const fullMatch = (pattern: string | null, s: string) => !!pattern && new RegExp(`^(?:${pattern})$`).test(s);

/**
 * Reads what a user typed into a phone field. `country` is the one picked in the field; numbers typed with
 * «+» or «00» are matched against `all` (or `country` alone if `all` is not given).
 */
export function parsePhone(input: string, country: WithPhone, all?: readonly WithPhone[]): ParsedPhone | null {
    let s = westernDigits(input).replace(/[^\d+]/g, "");
    if (!s) return null;
    let plans: { iso2: string; plan: PhonePlan; rest: string }[] = [];
    if (s.startsWith("+") || s.startsWith("00")) {
        s = s.replace(/^(\+|00)/, "");
        for (const c of all ?? [country])
            for (const plan of c.phone) {
                const cc = plan.calling_code.slice(1);
                if (!s.startsWith(cc)) continue;
                const rest = s.slice(cc.length);
                if (plan.leading_digits && !new RegExp(`^(?:${plan.leading_digits})`).test(rest)) continue;
                plans.push({ iso2: c.iso2, plan, rest });
            }
        // Shared codes (+1, +7, +44...): the picked country first, then a plan whose leading digits matched,
        // then one whose mobile pattern fits, then a secondary plan whose own pattern fits, then the main country.
        const weight = (p: (typeof plans)[number]) =>
            (p.iso2 === country.iso2 ? 16 : 0) +
            (p.plan.leading_digits ? 8 : 0) +
            (fullMatch(p.plan.mobile_pattern, p.rest) ? 4 : 0) +
            (!p.plan.primary && fullMatch(p.plan.pattern, p.rest) ? 2 : 0) +
            (p.plan.primary ? 1 : 0);
        plans.sort((a, b) => weight(b) - weight(a));
    } else {
        for (const plan of country.phone) {
            const rest = plan.trunk_prefix && s.startsWith(plan.trunk_prefix) && !fullMatch(plan.pattern, s) ? s.slice(plan.trunk_prefix.length) : s;
            plans.push({ iso2: country.iso2, plan, rest });
        }
    }
    if (!plans.length) return null;
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
export function isValidMobile(input: string, country: WithPhone, all?: readonly WithPhone[]): boolean {
    const p = parsePhone(input, country, all);
    return !!p && p.valid && p.mobile && (!all || p.iso2 === country.iso2);
}

/** Groups national digits with the plan's mobile_format mask (5 123 4567 style); returns the digits as-is when the mask does not fit. */
export function formatNational(national: string, plan: PhonePlan): string {
    const mask = plan.mobile_format;
    if (!mask || mask.replace(/[^#]/g, "").length !== national.length) return national;
    let i = 0;
    return mask.replace(/#/g, () => national[i++]);
}

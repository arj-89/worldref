import type { PhonePlan, Searchable } from "./types.js";
export type Lang = "ar" | "en";
/**
 * Countries matching a query, best first. Matches names and aliases in both languages (ignoring «ال», tashkeel,
 * hamza forms, case and accents), ISO codes, and dial codes with or without «+» or «00».
 */
export declare function search<T extends Searchable>(countries: readonly T[], query: string, lang?: Lang): T[];
/** Alphabetical in the UI language, with the user's country (if given) first. Returns a new array. */
export declare function sortCountries<T extends Searchable>(countries: readonly T[], lang?: Lang, first?: string | null): T[];
export interface ParsedPhone {
    /** International format, e.g. +966512345678. Store this together with `iso2`. */
    e164: string;
    iso2: string;
    calling_code: string;
    national: string;
    valid: boolean;
    mobile: boolean;
}
type WithPhone = Pick<Searchable, "iso2"> & {
    phone: PhonePlan[];
};
/**
 * Reads what a user typed into a phone field. `country` is the one picked in the field; numbers typed with
 * «+» or «00» are matched against `all` (or `country` alone if `all` is not given).
 */
export declare function parsePhone(input: string, country: WithPhone, all?: readonly WithPhone[]): ParsedPhone | null;
/** True when the input is a valid mobile number for the country. */
export declare function isValidMobile(input: string, country: WithPhone, all?: readonly WithPhone[]): boolean;
/** Groups national digits with the plan's mobile_format mask (5 123 4567 style); returns the digits as-is when the mask does not fit. */
export declare function formatNational(national: string, plan: PhonePlan): string;
export {};

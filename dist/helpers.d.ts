import type { Country, PhonePlan, Searchable } from "./types.js";
export type Lang = "ar" | "en";
/**
 * Countries matching a query, best first. Matches names and aliases in both languages (ignoring «ال», tashkeel,
 * hamza forms, case, accents, spaces and punctuation), ISO codes, and dial codes with or without «+» or «00».
 * When nothing matches, a second pass forgives small typos ("Kuwiat"): 1 edit for 4 to 7 letters, 2 from 8.
 */
export declare function search<T extends Searchable>(countries: readonly T[], query: string, lang?: Lang): T[];
/**
 * Optimal string alignment distance (insertions, deletions, substitutions, adjacent swaps), compared by
 * UTF-16 code unit. Returns limit + 1 as soon as the distance must exceed `limit`.
 */
export declare function editDistance(a: string, b: string, limit: number): number;
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
export type AddressFieldKey = "name" | "organization" | "street" | "sublocality" | "city" | "region" | "postal_code" | "sorting_code";
export interface AddressFormField {
    field: AddressFieldKey;
    /** In the requested language; null when the data has no label in that language. */
    label: string | null;
    required: boolean;
}
/**
 * The address form of a country: its fields line by line, in the country's order, with labels in `lang` and
 * whether the postal service requires each one. Tokens the format uses beyond Google's nine are skipped.
 */
export declare function addressForm(country: Pick<Country, "address">, lang?: Lang): AddressFormField[][];
export {};

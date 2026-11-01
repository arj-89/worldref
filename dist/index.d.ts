import type { Country } from "./types.js";
export declare const countries: Country[];
/** Looks a country up by ISO alpha-2 code (case-insensitive). */
export declare function byIso2(iso2: string): Country | undefined;
export * from "./helpers.js";
export * from "./text.js";
export type * from "./types.js";

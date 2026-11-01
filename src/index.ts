// worldref: every country in Arabic, English, or both.
//
//   import { countries, search, parsePhone } from "worldref";          // everything, bilingual
//   import phone from "worldref/data/modules/phone.json" with { type: "json" }; // one module only
import data from "../data/worldref.json" with { type: "json" };
import type { Country } from "./types.js";

export const countries = data as Country[];

/** Looks a country up by ISO alpha-2 code (case-insensitive). */
export function byIso2(iso2: string): Country | undefined {
    const code = iso2.toUpperCase();
    return countries.find((c) => c.iso2 === code);
}

export * from "./helpers.js";
export * from "./text.js";
export type * from "./types.js";

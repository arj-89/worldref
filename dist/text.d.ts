/** Arabic-Indic (٠-٩) and Persian (۰-۹) digits to Western (0-9). Nothing else changes. */
export declare function westernDigits(text: string): string;
/** Folds a name or a query for matching: case, accents, Arabic letter variants, tashkeel, tatweel, «ال», punctuation. */
export declare function normalize(text: string): string;

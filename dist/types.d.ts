export interface PhonePlan {
    calling_code: string;
    leading_digits: string | null;
    primary: boolean;
    trunk_prefix: string | null;
    pattern: string | null;
    lengths: number[];
    mobile_pattern: string | null;
    mobile_lengths: number[];
    mobile_prefixes: string[];
    mobile_distinguishable: boolean;
    mobile_example: string | null;
    mobile_format: string | null;
}
export interface Currency {
    code: string;
    name_ar: string | null;
    name_en: string | null;
    symbol: string | null;
    symbol_ar: string | null;
    symbol_fallback: string | null;
}
export interface Country {
    iso2: string;
    iso3: string | null;
    iso_numeric: string | null;
    kind: "country" | "territory";
    name_ar: string;
    name_en: string;
    official_name_ar: string | null;
    official_name_en: string | null;
    aliases_ar: string[];
    aliases_en: string[];
    flag: string;
    flag_svg: string;
    continent: "africa" | "americas" | "asia" | "europe" | "oceania" | null;
    groups: string[];
    un_member: boolean;
    tld: string | null;
    sort_ar: string;
    sort_en: string;
    nationality: {
        nationality_ar_m: string | null;
        nationality_ar_f: string | null;
        nationality_en: string | null;
        icao_code: string | null;
    };
    phone: PhonePlan[];
    currencies: Currency[];
    geo: {
        capital_ar: string | null;
        capital_en: string | null;
        lat: number | null;
        lng: number | null;
        area_km2: number | null;
        population: number | null;
        population_year: number | null;
        timezones: string[];
        driving_side: "left" | "right" | null;
    };
    locale: {
        languages: {
            code: string;
            name_ar: string | null;
            name_en: string | null;
        }[];
        week_start: string;
        weekend: string[];
        calendars: string[];
        measurement: "metric" | "us" | "uk";
    };
    address: {
        postal_code_format: string | null;
        postal_code_regex: string | null;
        postal_code_example: string | null;
        address_format: string | null;
        region_label_ar: string | null;
        region_label_en: string | null;
    };
    travel: {
        emergency: {
            police: string | null;
            ambulance: string | null;
            fire: string | null;
            general: string | null;
        } | null;
        plug_types: string[];
        voltage: number[];
        frequency_hz: number[] | null;
    };
    sports: {
        fifa: string | null;
        ioc: string | null;
    };
}
export interface Subdivision {
    iso2: string;
    code: string;
    name_ar: string | null;
    name_en: string | null;
    parent: string | null;
}
/** The fields search and sorting need; the full record and the `core` module both have them. */
export type Searchable = Pick<Country, "iso2" | "name_ar" | "name_en" | "aliases_ar" | "aliases_en" | "sort_ar" | "sort_en"> & Partial<Pick<Country, "iso3" | "phone">>;

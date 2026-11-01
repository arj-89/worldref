// Every value here is a decision, not a fetched fact. Each one says why, and the build copies the reason
// into sources.json, so a reader can tell sourced values from editorial ones.

/** The policy rows (owner decisions, 01/11/2026). */
export const POLICY = {
    PS: {
        name_ar: "فلسطين",
        name_en: "Palestine",
        official_name_ar: "دولة فلسطين",
        official_name_en: "State of Palestine",
        capital_ar: "القدس",
        capital_en: "Jerusalem",
        // ILS is listed because it is in daily use, under a name that does not carry the excluded state's name.
        currencies: ["JOD", "ILS"],
        currency_names: { ILS: { ar: "شيكل", en: "Shekel" } },
        extra_timezones: ["Asia/Jerusalem"],
        // +972 numbers (Jerusalem and the 1948 lines) are Palestinian numbers in this dataset.
        extra_calling_territories: ["IL"],
    },
};

/** Short common names where CLDR's standard form is the long official one (the official form stays in official_name). */
export const SHORT_NAMES = {
    SA: { ar: "السعودية", why: "Common short name; CLDR's standard Arabic form is the official long name" },
    AE: { ar: "الإمارات", why: "Common short name; CLDR's standard Arabic form is the official long name" },
};

/** Countries with several capitals: the one this dataset reports. */
export const CAPITAL_CHOICE = {
    BO: { en: "Sucre", why: "Constitutional capital (La Paz is the seat of government)" },
    LK: { en: "Sri Jayawardenepura Kotte", why: "Official capital (Colombo is the commercial capital)" },
    MS: { en: "Plymouth", why: "De jure capital (Brades is the de facto seat)" },
    SZ: { en: "Mbabane", why: "Administrative capital (Lobamba is the royal and legislative capital)" },
    YE: { en: "Sanaa", why: "Constitutional capital" },
    YT: { en: "Mamoudzou", why: "Seat of the prefecture" },
    ZA: { en: "Pretoria", why: "Executive capital (Cape Town legislative, Bloemfontein judicial)" },
};

/** Capitals Wikidata does not state on the territory item. Labels are the Wikidata labels of the city items. */
export const CAPITAL_FILL = {
    BQ: { qid: "Q331584", ar: "كراليندايك", en: "Kralendijk", why: "Seat of the Caribbean Netherlands public body (Wikidata Q331584)" },
    SJ: { qid: "Q25923", ar: "لونغييربين", en: "Longyearbyen", why: "Administrative centre of Svalbard (Wikidata Q25923)" },
};

/** Kosovo is not in the IANA zone table (it lists ISO codes only); it keeps Serbia's zone. */
export const TIMEZONE_FILL = { XK: ["Europe/Belgrade"] };

/** Wikidata plug items mapped to IEC letter types. */
export const PLUG_TYPES = {
    "NEMA 1-15": ["A"],
    "NEMA 5-15": ["B"],
    Europlug: ["C"],
    "AC power plugs and sockets: British and related types": ["D"],
    "BS 546": ["D", "M"],
    "Type E": ["E"],
    Schuko: ["F"],
    "BS 1363": ["G"],
    "Type H": ["H"],
    "AS/NZS 3112": ["I"],
    "SN 441011": ["J"],
    "Type K": ["K"],
    "Type L": ["L"],
    "IEC 60906-1": ["N"],
};

/** ICAO Doc 9303 nationality codes that differ from ISO alpha-3. */
export const ICAO_EXCEPTIONS = { DE: "D", XK: "RKS" };

/** Official member lists. GCC: gcc-sg.org. Arab League: las.int (22 members). */
export const GROUPS = {
    gcc: ["AE", "BH", "KW", "OM", "QA", "SA"],
    arab_league: ["AE", "BH", "DJ", "DZ", "EG", "IQ", "JO", "KM", "KW", "LB", "LY", "MA", "MR", "OM", "PS", "QA", "SA", "SD", "SO", "SY", "TN", "YE"],
};

/** UN member states that Wikidata's membership statements miss (checked against un.org/en/about-us/member-states). */
export const UN_MEMBERS_FILL = ["DK"];

/** Sovereign states that are not UN members. */
export const NON_UN_COUNTRIES = ["PS", "VA", "XK"];

/** Territories that still get a nationality (they issue their own passports). */
export const NATIONALITY_TERRITORIES = ["HK", "MO", "TW"];

/**
 * Arabic masculine nationality where Wikidata has none or has a wrong form. Standard forms used by Arab foreign ministries and the
 * Arabic press; the feminine is generated from these by the Arabic rule. Countries without an established
 * Arabic form are left out (null).
 */
export const NATIONALITY_AR = {
    // Corrections: Wikidata's form is wrong (another country, an ethnic rather than civic term, or misspelt).
    BF: "بوركيني", QA: "قطري", KZ: "كازاخستاني", XK: "كوسوفي", UZ: "أوزبكستاني", ZW: "زيمبابوي", RW: "رواندي",
    MZ: "موزمبيقي", CM: "كاميروني", MM: "ميانماري", MD: "مولدوفي", ER: "إريتري", GD: "غرينادي", PY: "باراغوائي",
    UY: "أوروغوائي", LK: "سريلانكي",
    // Fills: Wikidata has no Arabic form.
    BA: "بوسني", CD: "كونغولي", CG: "كونغولي", DK: "دنماركي", DM: "دومينيكي", DO: "دومينيكاني",
    FM: "ميكرونيزي", GH: "غاني", GQ: "غيني استوائي", GW: "غيني بيساوي", HK: "هونغ كونغي", IS: "آيسلندي",
    MH: "مارشالي", MO: "ماكاوي", SM: "سان ماريني", SS: "جنوب سوداني", TT: "ترينيدادي", TW: "تايواني",
    UA: "أوكراني", VA: "فاتيكاني", ZA: "جنوب أفريقي",
};

/** English nationality where the Factbook form is not a usable adjective. */
export const NATIONALITY_EN = {
    KP: "North Korean",
    KR: "South Korean",
    PH: "Filipino",
    SG: "Singaporean",
    LI: "Liechtensteiner",
    LU: "Luxembourgish",
    KI: "I-Kiribati",
    TW: "Taiwanese",
    HK: "Hong Konger",
    MO: "Macanese",
    PS: "Palestinian",
    XK: "Kosovar",
    CD: "Congolese",
    CG: "Congolese",
    BA: "Bosnian",
};

/** Arabic labels for Google's administrative-area types. */
export const REGION_LABEL_AR = {
    area: "منطقة",
    county: "مقاطعة",
    department: "إقليم",
    district: "منطقة",
    do_si: "مقاطعة",
    emirate: "إمارة",
    island: "جزيرة",
    oblast: "إقليم",
    parish: "أبرشية",
    prefecture: "محافظة",
    province: "مقاطعة",
    state: "ولاية",
};

/** Search aliases in wide use that Wikidata lacks. */
export const ALIAS_ADD = { SA: { en: ["KSA"] } };

/** Aliases dropped because they are disparaging or political, not names people search with. */
export const ALIAS_BLOCK = { SA: ["دولة آل سعود"] };

/** CLDR has no week data for Palestine; it follows the neighbouring Arab practice (as CLDR records for Jordan). */
export const WEEK_FILL = { PS: { week_start: "sat", weekend: ["fri", "sat"] } };

/** Row names in the Electric Current Worldwide table that differ from ours. The grid of the excluded row is Palestine's grid. */
export const ECW_NAMES = {
    "Bosnia-Herzegovina": "BA", Burma: "MM", "Cocos Island": "CC", "Congo (Brazzaville)": "CG", "Congo (Kinshasa)": "CD",
    "Cook Island": "CK", "Gambia, The": "GM", Kazakstan: "KZ", "Korea, North": "KP", "Korea, South": "KR", Miquelon: "PM",
    "North Mariana Island": "MP", "Pitcairn Island": "PN", "Saint Kitts-Nevis": "KN", "Sao Tome and Principe": "ST",
    "St. Vincent and  the Grenadines": "VC", Svalbard: "SJ", Israel: "PS",
};

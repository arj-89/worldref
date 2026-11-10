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
    // Western Sahara is part of Morocco (Saudi official position); its IANA zone belongs to Morocco's row.
    MA: {
        extra_timezones: ["Africa/El_Aaiun"],
        why_timezones: "Western Sahara is part of Morocco (Saudi official position); IANA lists its zone under EH",
        why_timezones_ar: "الصحراء الغربية جزء من المغرب (الموقف الرسمي السعودي)، وتدرج IANA منطقتها الزمنية تحت الرمز EH",
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

/**
 * Subdivision types. English: the head term of the subdivision's Wikidata class ("governorate of Egypt" gives
 * governorate), from this list only. Arabic: this glossary, which an Arab country's own official term overrides
 * (SUBDIVISION_TYPE_AR_COUNTRY). A term outside the list, or a class that names no type, leaves the type null.
 */
export const SUBDIVISION_TYPE_AR = {
    "administrative region": "منطقة إدارية",
    area: "منطقة",
    atoll: "جزيرة مرجانية",
    "autonomous city": "مدينة ذاتية الحكم",
    "autonomous community": "منطقة حكم ذاتي",
    "autonomous district": "مقاطعة ذاتية الحكم",
    "autonomous okrug": "مقاطعة ذاتية الحكم",
    "autonomous province": "مقاطعة ذاتية الحكم",
    "autonomous region": "منطقة ذاتية الحكم",
    "autonomous republic": "جمهورية ذاتية الحكم",
    borough: "بلدية",
    canton: "كانتون",
    "capital city": "مدينة عاصمة",
    "capital district": "منطقة العاصمة",
    "capital territory": "إقليم العاصمة",
    city: "مدينة",
    commune: "بلدية",
    "constituent country": "بلد",
    "council area": "منطقة مجلس",
    county: "مقاطعة",
    department: "إقليم",
    dependency: "إقليم تابع",
    district: "منطقة",
    division: "قسم",
    emirate: "إمارة",
    entity: "كيان",
    "federal dependency": "إقليم تابع",
    "federal district": "مقاطعة اتحادية",
    "federal territory": "إقليم اتحادي",
    governorate: "محافظة",
    island: "جزيرة",
    krai: "كراي",
    "local council": "مجلس محلي",
    "london borough": "حي",
    "metropolitan city": "مدينة حضرية",
    municipality: "بلدية",
    oblast: "أوبلاست",
    parish: "أبرشية",
    prefecture: "محافظة",
    "principal area": "منطقة رئيسية",
    province: "مقاطعة",
    quarter: "حي",
    region: "منطقة",
    republic: "جمهورية",
    sector: "قطاع",
    "special administrative region": "منطقة إدارية خاصة",
    "special municipality": "بلدية خاصة",
    "special self-governing province": "مقاطعة خاصة ذاتية الحكم",
    state: "ولاية",
    "statistical region": "منطقة إحصائية",
    territory: "إقليم",
    "union territory": "إقليم اتحادي",
    "unitary authority": "سلطة محلية موحدة",
    voivodeship: "محافظة",
};

/** Class labels that name no administrative type; never used as a type. */
export const SUBDIVISION_TYPE_IGNORE = /administrative territorial entity|administrative division|big city|port city|largest city|city or town|human settlement|capital of |unparished area|lieutenancy area|registration county|ceremonial county/i;

/** Arab countries' own Arabic terms, where they differ from the glossary. */
export const SUBDIVISION_TYPE_AR_COUNTRY = {
    DZ: { province: "ولاية", why: "Algeria's official Arabic term for its provinces is ولاية", why_ar: "المصطلح العربي الرسمي في الجزائر لتقسيماتها هو ولاية" },
    TN: { governorate: "ولاية", why: "Tunisia's official Arabic term for its governorates is ولاية", why_ar: "المصطلح العربي الرسمي في تونس لتقسيماتها هو ولاية" },
    MA: { region: "جهة", prefecture: "عمالة", province: "إقليم", why: "Morocco's official Arabic terms: جهة (region), عمالة (prefecture), إقليم (province)", why_ar: "المصطلحات العربية الرسمية في المغرب: جهة، وعمالة، وإقليم" },
    MR: { region: "ولاية", why: "Mauritania's official Arabic term for its regions is ولاية", why_ar: "المصطلح العربي الرسمي في موريتانيا لتقسيماتها هو ولاية" },
    SD: { state: "ولاية", why: "Sudan's official Arabic term for its states is ولاية", why_ar: "المصطلح العربي الرسمي في السودان لتقسيماتها هو ولاية" },
    SO: { region: "إقليم", why: "Somalia's Arabic term for its regions is إقليم", why_ar: "المصطلح العربي لأقاليم الصومال هو إقليم" },
    DJ: { region: "إقليم", why: "Djibouti's Arabic term for its regions is إقليم", why_ar: "المصطلح العربي لأقاليم جيبوتي هو إقليم" },
    LY: { district: "شعبية", why: "Libya's official Arabic term for its districts is شعبية", why_ar: "المصطلح العربي الرسمي في ليبيا لتقسيماتها هو شعبية" },
    TR: { province: "ولاية", why: "Turkey's provinces are ولايات in Arabic usage (ولايات تركيا)", why_ar: "تُسمّى تقسيمات تركيا بالعربية ولايات (ولايات تركيا)" },
    IR: { province: "محافظة", why: "Iran's provinces are محافظات in Arabic usage (محافظات إيران)", why_ar: "تُسمّى تقسيمات إيران بالعربية محافظات (محافظات إيران)" },
};

/** Countries where Wikidata gives no usable class: one type for every subdivision, from the official term. */
export const SUBDIVISION_TYPE_COUNTRY = {
    SA: { en: "region", ar: "منطقة", why: "Saudi Arabia's 13 regions (Law of Regions, نظام المناطق)", why_ar: "مناطق السعودية الثلاث عشرة (نظام المناطق)" },
    QA: { en: "municipality", ar: "بلدية", why: "Qatar's 8 municipalities (بلديات)", why_ar: "بلديات قطر الثماني" },
    LY: { en: "district", ar: "شعبية", why: "Libya's 22 districts (شعبيات), one category in ISO 3166-2:LY", why_ar: "شعبيات ليبيا الاثنتان والعشرون، وهي فئة واحدة في ISO 3166-2:LY" },
};

/** Countries whose untyped subdivisions all share one ISO 3166-2 category; fills nulls only. */
export const SUBDIVISION_TYPE_DEFAULT = {
    EE: { en: "municipality", why: "ISO 3166-2:EE: the subdivisions under the counties are rural or urban municipalities", why_ar: "وفق ISO 3166-2:EE: التقسيمات التابعة للمقاطعات بلديات ريفية أو حضرية" },
    MT: { en: "local council", why: "ISO 3166-2:MT: local councils", why_ar: "وفق ISO 3166-2:MT: مجالس محلية" },
    IS: { en: "municipality", why: "ISO 3166-2:IS: the subdivisions under the regions are municipalities", why_ar: "وفق ISO 3166-2:IS: التقسيمات التابعة للمناطق بلديات" },
    CV: { en: "municipality", why: "ISO 3166-2:CV: the subdivisions under the island groups are municipalities", why_ar: "وفق ISO 3166-2:CV: التقسيمات التابعة لمجموعات الجزر بلديات" },
    BI: { en: "province", why: "ISO 3166-2:BI: provinces", why_ar: "وفق ISO 3166-2:BI: مقاطعات" },
};

/** Where Wikidata gives a subdivision several types: the order to pick from (statutory type first). */
export const SUBDIVISION_TYPE_PRIORITY = {
    GB: {
        order: ["constituent country", "unitary authority", "principal area", "council area", "county", "london borough", "borough", "district"],
        why: "UK local government: the statutory type (unitary authority, Welsh principal area, Scottish council area) before honorific ones (city status)",
        why_ar: "في الحكم المحلي البريطاني يُقدَّم النوع القانوني (سلطة محلية موحدة، ومنطقة رئيسية في ويلز، ومنطقة مجلس في اسكتلندا) على الألقاب الشرفية مثل لقب المدينة",
    },
};

/** Single subdivisions without a usable class. */
export const SUBDIVISION_TYPE_CODE = {
    "IQ-KR": { en: "region", ar: "إقليم", why: "Kurdistan Region (إقليم كردستان), its official name", why_ar: "إقليم كردستان، اسمه الرسمي، وفق ISO 3166-2:IQ" },
    "YE-SA": { en: "municipality", ar: "أمانة", why: "Amanat Al Asimah (أمانة العاصمة), Sanaa's capital municipality, ISO 3166-2:YE", why_ar: "أمانة العاصمة صنعاء، وفق ISO 3166-2:YE" },
    "SD-GK": { en: "state", why: "West Kordofan is one of Sudan's 18 states, ISO 3166-2:SD", why_ar: "غرب كردفان، إحدى ولايات السودان الثماني عشرة، وفق ISO 3166-2:SD" },
    "NG-FC": { en: "capital territory", why: "Federal Capital Territory, ISO 3166-2:NG", why_ar: "إقليم العاصمة الاتحادية، وفق ISO 3166-2:NG" },
    "CN-HK": { en: "special administrative region", why: "Special administrative region, ISO 3166-2:CN", why_ar: "منطقة إدارية خاصة، وفق ISO 3166-2:CN" },
    "CN-MO": { en: "special administrative region", why: "Special administrative region, ISO 3166-2:CN", why_ar: "منطقة إدارية خاصة، وفق ISO 3166-2:CN" },
    "CN-BJ": { en: "municipality", why: "One of China's four municipalities, ISO 3166-2:CN", why_ar: "إحدى البلديات الأربع في الصين، وفق ISO 3166-2:CN" },
    "CN-SH": { en: "municipality", why: "One of China's four municipalities, ISO 3166-2:CN", why_ar: "إحدى البلديات الأربع في الصين، وفق ISO 3166-2:CN" },
    "CN-TJ": { en: "municipality", why: "One of China's four municipalities, ISO 3166-2:CN", why_ar: "إحدى البلديات الأربع في الصين، وفق ISO 3166-2:CN" },
    "CN-CQ": { en: "municipality", why: "One of China's four municipalities, ISO 3166-2:CN", why_ar: "إحدى البلديات الأربع في الصين، وفق ISO 3166-2:CN" },
    "GB-LND": { en: "city corporation", ar: null, why: "City of London Corporation, ISO 3166-2:GB; no established Arabic term", why_ar: "مؤسسة مدينة لندن، ولا مصطلح عربي مستقر لها، وفق ISO 3166-2:GB" },
    "GB-CMA": { en: "county", why: "Cumbria, a two-tier county in ISO 3166-2:GB", why_ar: "كمبريا، مقاطعة ذات مستويين، وفق ISO 3166-2:GB" },
    "UA-43": { en: "autonomous republic", why: "Autonomous Republic of Crimea, ISO 3166-2:UA", why_ar: "جمهورية القرم ذاتية الحكم، وفق ISO 3166-2:UA" },
    "LT-TA": { en: "county", why: "Tauragė County, ISO 3166-2:LT", why_ar: "مقاطعة تاوراغي، وفق ISO 3166-2:LT" },
    "IT-82": { en: "autonomous region", why: "Sicily, a region with special statute, ISO 3166-2:IT", why_ar: "صقلية، منطقة ذات نظام خاص، وفق ISO 3166-2:IT" },
    "ES-CE": { en: "autonomous city", why: "ISO 3166-2:ES", why_ar: "مدينة ذاتية الحكم، وفق ISO 3166-2:ES" },
    "ES-ML": { en: "autonomous city", why: "ISO 3166-2:ES", why_ar: "مدينة ذاتية الحكم، وفق ISO 3166-2:ES" },
    "ES-NC": { en: "autonomous community", why: "Navarra, ISO 3166-2:ES", why_ar: "نافارا، منطقة حكم ذاتي، وفق ISO 3166-2:ES" },
    "ES-PM": { en: "province", why: "Balearic Islands province, ISO 3166-2:ES", why_ar: "مقاطعة جزر البليار، وفق ISO 3166-2:ES" },
    "ES-LO": { en: "province", why: "La Rioja province, ISO 3166-2:ES", why_ar: "مقاطعة لا ريوخا، وفق ISO 3166-2:ES" },
    "KR-29": { en: "metropolitan city", why: "Gwangju, ISO 3166-2:KR", why_ar: "غوانغجو، مدينة حضرية، وفق ISO 3166-2:KR" },
    "KR-46": { en: "province", why: "South Jeolla, ISO 3166-2:KR", why_ar: "جولا الجنوبية، مقاطعة، وفق ISO 3166-2:KR" },
    "KR-42": { en: "special self-governing province", why: "Gangwon, ISO 3166-2:KR", why_ar: "غانغوون، مقاطعة خاصة ذاتية الحكم، وفق ISO 3166-2:KR" },
    "KR-49": { en: "special self-governing province", why: "Jeju, ISO 3166-2:KR", why_ar: "جيجو، مقاطعة خاصة ذاتية الحكم، وفق ISO 3166-2:KR" },
    "NL-BQ1": { en: "special municipality", why: "Bonaire, ISO 3166-2:NL", why_ar: "بونير، بلدية خاصة، وفق ISO 3166-2:NL" },
    "NL-BQ2": { en: "special municipality", why: "Saba, ISO 3166-2:NL", why_ar: "سابا، بلدية خاصة، وفق ISO 3166-2:NL" },
    "NL-BQ3": { en: "special municipality", why: "Sint Eustatius, ISO 3166-2:NL", why_ar: "سينت أوستاتيوس، بلدية خاصة، وفق ISO 3166-2:NL" },
    "BQ-BO": { en: "special municipality", why: "Bonaire, ISO 3166-2:BQ", why_ar: "بونير، بلدية خاصة، وفق ISO 3166-2:BQ" },
    "BQ-SA": { en: "special municipality", why: "Saba, ISO 3166-2:BQ", why_ar: "سابا، بلدية خاصة، وفق ISO 3166-2:BQ" },
    "BQ-SE": { en: "special municipality", why: "Sint Eustatius, ISO 3166-2:BQ", why_ar: "سينت أوستاتيوس، بلدية خاصة، وفق ISO 3166-2:BQ" },
    "PK-IS": { en: "capital territory", why: "Islamabad Capital Territory, ISO 3166-2:PK", why_ar: "إقليم العاصمة إسلام آباد، وفق ISO 3166-2:PK" },
    "PH-14": { en: "autonomous region", why: "Bangsamoro Autonomous Region, ISO 3166-2:PH", why_ar: "منطقة بانجسامورو ذاتية الحكم، وفق ISO 3166-2:PH" },
    "GB-NNH": { en: "unitary authority", why: "North Northamptonshire, a unitary authority since 2021, ISO 3166-2:GB", why_ar: "نورثامبتونشير الشمالية، سلطة محلية موحدة منذ 2021، وفق ISO 3166-2:GB" },
    "GB-WNH": { en: "unitary authority", why: "West Northamptonshire, a unitary authority since 2021, ISO 3166-2:GB", why_ar: "نورثامبتونشير الغربية، سلطة محلية موحدة منذ 2021، وفق ISO 3166-2:GB" },
    "VE-W": { en: "federal dependency", why: "Federal Dependencies, ISO 3166-2:VE", why_ar: "التوابع الاتحادية، وفق ISO 3166-2:VE" },
    ...Object.fromEntries(["GB-ABC", "GB-AND", "GB-ANN", "GB-BFS", "GB-CCG", "GB-DRS", "GB-FMO", "GB-LBC", "GB-MEA", "GB-MUL", "GB-NMD"].map((c) => [c, { en: "district", why: "One of Northern Ireland's 11 districts, ISO 3166-2:GB", why_ar: "إحدى المناطق الإحدى عشرة في أيرلندا الشمالية، وفق ISO 3166-2:GB" }])),
};

/** Subdivision names corrected where CLDR is out of date or wrong (reasons in SUBDIVISION_NAME_WHY). */
export const SUBDIVISION_NAME = {
    "MA-01": { ar: "طنجة تطوان الحسيمة", en: "Tanger-Tétouan-Al Hoceïma" },
    "MA-02": { ar: "الشرق", en: "L'Oriental" },
    "MA-03": { ar: "فاس مكناس", en: "Fès-Meknès" },
    "MA-04": { ar: "الرباط سلا القنيطرة", en: "Rabat-Salé-Kénitra" },
    "MA-05": { ar: "بني ملال خنيفرة", en: "Béni Mellal-Khénifra" },
    "MA-06": { ar: "الدار البيضاء سطات", en: "Casablanca-Settat" },
    "MA-07": { ar: "مراكش آسفي", en: "Marrakech-Safi" },
    "MA-08": { ar: "درعة تافيلالت", en: "Drâa-Tafilalet" },
    "MA-09": { ar: "سوس ماسة", en: "Souss-Massa" },
    "MA-10": { ar: "كلميم واد نون", en: "Guelmim-Oued Noun" },
    "MA-11": { ar: "العيون الساقية الحمراء", en: "Laâyoune-Sakia El Hamra" },
    "MA-12": { ar: "الداخلة وادي الذهب", en: "Dakhla-Oued Ed-Dahab" },
    "YE-SA": { ar: "أمانة العاصمة" },
    "IQ-KR": { ar: "إقليم كردستان", en: "Kurdistan Region" },
    "PK-IS": { ar: "إسلام آباد" },
    "IR-19": { ar: "جيلان" },
    "GB-BFS": { ar: "بلفاست" },
    "GB-LND": { en: "City of London", ar: "مدينة لندن" },
    "AE-DU": { ar: "إمارة دبي" },
    "BH-14": { ar: "المحافظة الجنوبية" },
    "BH-17": { ar: "المحافظة الشمالية" },
    "PH-14": { ar: "منطقة بانجسامورو ذاتية الحكم", en: "Bangsamoro" },
    "GB-PTE": { en: "Peterborough" },
};
export const SUBDIVISION_NAME_WHY_AR = {
    MA: "جهات المغرب الاثنتا عشرة منذ 2015 (المرسوم 2.15.40)، وما زالت CLDR تحمل الأسماء الستة عشر السابقة تحت رموز أعادت ISO توزيعها",
    "YE-SA": "أمانة العاصمة (ISO 3166-2:YE)، وتكرر CLDR اسم محافظة صنعاء",
    "IQ-KR": "إقليم كردستان، ولا اسم عربيًا له في CLDR",
    "PK-IS": "إسلام آباد، والنص العربي في CLDR مكتوب بالفارسية",
    "IR-19": "محافظة جيلان، والنص في CLDR مكتوب بالفارسية",
    "GB-BFS": "بلفاست، ولا اسم عربيًا لها في CLDR",
    "GB-LND": "تسمّي ISO 3166-2:GB هذا الرمز مدينة لندن، لا لندن الكبرى",
    "AE-DU": "إضافة همزة سقطت في CLDR",
    "BH-14": "الاسم الرسمي للمحافظة الجنوبية، وفي CLDR صفة مجردة",
    "BH-17": "الاسم الرسمي للمحافظة الشمالية، وفي CLDR صفة مجردة",
    "PH-14": "حلّت منطقة بانجسامورو ذاتية الحكم محل منطقة الحكم الذاتي في مينداناو المسلمة عام 2019، وفي CLDR الاسم القديم",
    "GB-PTE": "اسم بيتربرة بالإنجليزية مقطوع في CLDR",
};
export const SUBDIVISION_NAME_WHY = {
    MA: "Morocco's 12 regions since 2015 (Decree 2.15.40); CLDR still has the 16 pre-2015 names, under codes ISO reassigned",
    "YE-SA": "Amanat Al Asimah (ISO 3166-2:YE); CLDR repeats Sanaa governorate's name",
    "IQ-KR": "Kurdistan Region; CLDR has no Arabic name",
    "PK-IS": "Islamabad; CLDR's Arabic entry is Persian text",
    "IR-19": "Gilan province, جيلان in Arabic usage; CLDR's entry is Persian text",
    "GB-BFS": "Belfast; CLDR has no Arabic name",
    "GB-LND": "ISO 3166-2:GB names this code the City of London, not Greater London",
    "AE-DU": "Missing hamza in CLDR",
    "BH-14": "Southern Governorate, its official name; CLDR has a bare adjective",
    "BH-17": "Northern Governorate, its official name; CLDR has a bare adjective",
    "GB-PTE": "CLDR's English name is truncated to Peter",
    "PH-14": "Bangsamoro Autonomous Region in Muslim Mindanao replaced the ARMM in 2019; CLDR has the old name",
};

/** Countries whose addresses name a level below the ISO top level; their region label stays Google's. */
export const REGION_LABEL_KEEP_GOOGLE = {
    PH: "Philippine addresses name the province, which sits below the ISO top-level regions",
};
export const REGION_LABEL_KEEP_GOOGLE_AR = {
    PH: "تذكر العناوين في الفلبين المقاطعة، وهي دون المناطق في المستوى الأعلى من ISO",
};

/** Address-form labels. English: Google libaddressinput's own labels (Apache-2.0). */
export const ADDRESS_LABEL_EN = {
    locality: { city: "City", district: "District", post_town: "Post town", suburb: "Suburb" },
    sublocality: { suburb: "Suburb", district: "District", neighborhood: "Neighborhood", village_township: "Village / Township", townland: "Townland" },
    postal_code: { postal: "Postal code", zip: "ZIP code", pin: "PIN code", eircode: "Eircode" },
};

/** Arabic address-form labels: no published Arabic translation exists, so this is worldref's glossary. */
export const ADDRESS_LABEL_AR = {
    locality: { city: "المدينة", district: "المنطقة", post_town: "المدينة البريدية", suburb: "الضاحية" },
    sublocality: { suburb: "الضاحية", district: "المنطقة", neighborhood: "الحي", village_township: "القرية أو البلدة", townland: "المنطقة الريفية" },
    postal_code: { postal: "الرمز البريدي", zip: "الرمز البريدي", pin: "الرمز البريدي", eircode: "الرمز البريدي" },
};

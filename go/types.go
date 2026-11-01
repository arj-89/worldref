package worldref

// Lang selects the UI language for ranking and sorting.
type Lang string

const (
	AR Lang = "ar"
	EN Lang = "en"
)

// PhonePlan is one numbering plan of a country.
type PhonePlan struct {
	CallingCode           string   `json:"calling_code"`
	LeadingDigits         *string  `json:"leading_digits"`
	Primary               bool     `json:"primary"`
	TrunkPrefix           *string  `json:"trunk_prefix"`
	Pattern               *string  `json:"pattern"`
	Lengths               []int    `json:"lengths"`
	MobilePattern         *string  `json:"mobile_pattern"`
	MobileLengths         []int    `json:"mobile_lengths"`
	MobilePrefixes        []string `json:"mobile_prefixes"`
	MobileDistinguishable bool     `json:"mobile_distinguishable"`
	MobileExample         *string  `json:"mobile_example"`
	MobileFormat          *string  `json:"mobile_format"`
}

// Currency is a currency used in a country.
type Currency struct {
	Code           string  `json:"code"`
	NameAR         *string `json:"name_ar"`
	NameEN         *string `json:"name_en"`
	Symbol         *string `json:"symbol"`
	SymbolAR       *string `json:"symbol_ar"`
	SymbolFallback *string `json:"symbol_fallback"`
}

// Nationality holds the demonym forms and the ICAO code.
type Nationality struct {
	NationalityARM *string `json:"nationality_ar_m"`
	NationalityARF *string `json:"nationality_ar_f"`
	NationalityEN  *string `json:"nationality_en"`
	ICAOCode       *string `json:"icao_code"`
}

// Language is a language spoken in a country.
type Language struct {
	Code   string  `json:"code"`
	NameAR *string `json:"name_ar"`
	NameEN *string `json:"name_en"`
}

// Geo holds capital, coordinates, size and time zones.
type Geo struct {
	CapitalAR      *string  `json:"capital_ar"`
	CapitalEN      *string  `json:"capital_en"`
	Lat            *float64 `json:"lat"`
	Lng            *float64 `json:"lng"`
	AreaKm2        *float64 `json:"area_km2"`
	Population     *int64   `json:"population"`
	PopulationYear *int     `json:"population_year"`
	Timezones      []string `json:"timezones"`
	DrivingSide    *string  `json:"driving_side"`
}

// Locale holds languages, week layout, calendars and measurement system.
type Locale struct {
	Languages   []Language `json:"languages"`
	WeekStart   string     `json:"week_start"`
	Weekend     []string   `json:"weekend"`
	Calendars   []string   `json:"calendars"`
	Measurement string     `json:"measurement"`
}

// Address holds the postal code and address conventions.
type Address struct {
	PostalCodeFormat  *string `json:"postal_code_format"`
	PostalCodeRegex   *string `json:"postal_code_regex"`
	PostalCodeExample *string `json:"postal_code_example"`
	AddressFormat     *string `json:"address_format"`
	RegionLabelAR     *string `json:"region_label_ar"`
	RegionLabelEN     *string `json:"region_label_en"`
}

// Emergency holds emergency numbers.
type Emergency struct {
	Police    *string `json:"police"`
	Ambulance *string `json:"ambulance"`
	Fire      *string `json:"fire"`
	General   *string `json:"general"`
}

// Travel holds emergency numbers, plug types, voltage and frequency.
type Travel struct {
	Emergency   *Emergency `json:"emergency"`
	PlugTypes   []string   `json:"plug_types"`
	Voltage     []int      `json:"voltage"`
	FrequencyHz []int      `json:"frequency_hz"`
}

// Sports holds the FIFA and IOC codes.
type Sports struct {
	FIFA *string `json:"fifa"`
	IOC  *string `json:"ioc"`
}

// Country is one record of the dataset. Kind is "country" or "territory";
// Continent is one of africa, americas, asia, europe, oceania (or nil).
type Country struct {
	ISO2           string      `json:"iso2"`
	ISO3           *string     `json:"iso3"`
	ISONumeric     *string     `json:"iso_numeric"`
	Kind           string      `json:"kind"`
	NameAR         string      `json:"name_ar"`
	NameEN         string      `json:"name_en"`
	OfficialNameAR *string     `json:"official_name_ar"`
	OfficialNameEN *string     `json:"official_name_en"`
	AliasesAR      []string    `json:"aliases_ar"`
	AliasesEN      []string    `json:"aliases_en"`
	Flag           string      `json:"flag"`
	FlagSVG        string      `json:"flag_svg"`
	Continent      *string     `json:"continent"`
	Groups         []string    `json:"groups"`
	UNMember       bool        `json:"un_member"`
	TLD            *string     `json:"tld"`
	SortAR         string      `json:"sort_ar"`
	SortEN         string      `json:"sort_en"`
	Nationality    Nationality `json:"nationality"`
	Phone          []PhonePlan `json:"phone"`
	Currencies     []Currency  `json:"currencies"`
	Geo            Geo         `json:"geo"`
	Locale         Locale      `json:"locale"`
	Address        Address     `json:"address"`
	Travel         Travel      `json:"travel"`
	Sports         Sports      `json:"sports"`
}

// Subdivision is an ISO 3166-2 subdivision.
type Subdivision struct {
	ISO2   string  `json:"iso2"`
	Code   string  `json:"code"`
	NameAR *string `json:"name_ar"`
	NameEN *string `json:"name_en"`
	Parent *string `json:"parent"`
}

// ParsedPhone is the result of ParsePhone.
type ParsedPhone struct {
	// E164 is the international format, e.g. +966512345678. Store it together with ISO2.
	E164        string
	ISO2        string
	CallingCode string
	National    string
	Valid       bool
	Mobile      bool
}

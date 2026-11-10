<?php

declare(strict_types=1);

namespace WorldRef;

/** Entry point: the dataset, search, sorting, phone and address helpers. */
final class WorldRef
{
    /** @var list<Country>|null */
    private static ?array $countries = null;
    /** @var array<string, Country> */
    private static array $byIso2 = [];
    /** @var list<Subdivision>|null */
    private static ?array $subdivisions = null;

    /** @return array<mixed> */
    private static function load(string $file): array
    {
        $path = __DIR__ . '/../../data/' . $file;
        return json_decode(file_get_contents($path), true, 512, JSON_THROW_ON_ERROR);
    }

    /** @return list<Country> */
    public static function countries(): array
    {
        if (self::$countries === null) {
            self::$countries = array_map(Country::fromArray(...), self::load('worldref.json'));
            foreach (self::$countries as $c) {
                self::$byIso2[$c->iso2] = $c;
            }
        }
        return self::$countries;
    }

    /** Case-insensitive lookup by ISO 3166-1 alpha-2 code. */
    public static function byIso2(string $iso2): ?Country
    {
        self::countries();
        return self::$byIso2[strtoupper($iso2)] ?? null;
    }

    /**
     * All subdivisions, or those of one country.
     * @return list<Subdivision>
     */
    public static function subdivisions(?string $iso2 = null): array
    {
        self::$subdivisions ??= array_map(Subdivision::fromArray(...), self::load('subdivisions.json'));
        if ($iso2 === null) {
            return self::$subdivisions;
        }
        $iso2 = strtoupper($iso2);
        return array_values(array_filter(self::$subdivisions, static fn (Subdivision $s): bool => $s->iso2 === $iso2));
    }

    public static function normalize(string $text): string
    {
        return Text::normalize($text);
    }

    public static function westernDigits(string $text): string
    {
        return Text::westernDigits($text);
    }

    /**
     * Countries matching a query, best first. Matches names and aliases in both languages (ignoring "ال", tashkeel,
     * hamza forms, case, accents, spaces and punctuation), ISO codes, and dial codes with or without "+" or "00".
     * When nothing matches, a second pass forgives small typos ("Kuwiat"): 1 edit for 4 to 7 letters, 2 from 8.
     * @param iterable<Country> $countries
     * @return list<Country>
     */
    public static function search(iterable $countries, string $query, string $lang = 'en'): array
    {
        $q = Text::normalize($query);
        if ($q === '') {
            return [];
        }
        $qc = str_replace(' ', '', $q);
        $digits = preg_replace('/[\s()-]/u', '', Text::westernDigits($query));
        $dial = preg_match('/^(\+|00)?\d{1,4}$/', $digits) ? preg_replace('/^(\+|00)/', '', $digits) : null;
        $upper = mb_strtoupper(trim($query), 'UTF-8');
        $ar = $lang === 'ar';
        // Tiers: exact (50s), name starts with the query (40s), a word starts with it (30s), contains it (10s).
        // Within a tier: the UI-language name, then the other language, then aliases.
        $rank = static function (string $name, int $place) use ($q, $qc): int {
            $nc = str_replace(' ', '', $name);
            if ($name === $q || $nc === $qc) {
                return 50 - $place;
            }
            if (str_starts_with($name, $q) || (mb_strlen($qc, 'UTF-8') >= 3 && str_starts_with($nc, $qc))) {
                return 40 - $place;
            }
            foreach (explode(' ', $name) as $w) {
                if (str_starts_with($w, $q)) {
                    return 30 - $place;
                }
            }
            if (mb_strlen($q, 'UTF-8') >= 3 && str_contains($name, $q)) {
                return 10 - $place;
            }
            return 0;
        };
        $scored = [];
        foreach ($countries as $c) {
            $own = Text::normalize($ar ? $c->name_ar : $c->name_en);
            $other = Text::normalize($ar ? $c->name_en : $c->name_ar);
            $score = max($rank($own, 0), $rank($other, 1));
            foreach ([...$c->aliases_ar, ...$c->aliases_en] as $alias) {
                $score = max($score, $rank(Text::normalize($alias), 2));
            }
            if ($upper === $c->iso2 || $upper === $c->iso3) {
                $score = max($score, 49.5);
            }
            if ($dial !== null) {
                $exact = false;
                $primary = false;
                $prefix = false;
                foreach ($c->phone as $p) {
                    $cc = substr($p->calling_code, 1);
                    if ($cc === $dial) {
                        $exact = true;
                        $primary = $primary || $p->primary;
                    } elseif (str_starts_with($cc, $dial)) {
                        $prefix = true;
                    }
                }
                if ($exact) {
                    $score = max($score, $primary ? 46 : 45);
                } elseif ($prefix) {
                    $score = max($score, 5);
                }
            }
            if ($score > 0) {
                $scored[] = [$c, $score];
            }
        }
        if (!$scored && mb_strlen($qc, 'UTF-8') >= 4 && preg_match('/^\d+$/', $qc) !== 1) {
            // Typo pass: edit distance between the query and whole names, spaces ignored.
            $limit = mb_strlen($qc, 'UTF-8') >= 8 ? 2 : 1;
            foreach ($countries as $c) {
                $names = [$ar ? $c->name_ar : $c->name_en, $ar ? $c->name_en : $c->name_ar, ...$c->aliases_ar, ...$c->aliases_en];
                $best = 0;
                foreach ($names as $i => $n) {
                    $d = self::editDistance($qc, str_replace(' ', '', Text::normalize($n)), $limit);
                    if ($d <= $limit) {
                        $best = max($best, 3 - $d - min($i, 2) * 0.25);
                    }
                }
                if ($best > 0) {
                    $scored[] = [$c, $best];
                }
            }
        }
        $key = $ar ? 'sort_ar' : 'sort_en';
        usort($scored, static fn (array $a, array $b): int => $b[1] <=> $a[1] ?: strcmp($a[0]->$key, $b[0]->$key));
        return array_map(static fn (array $s): Country => $s[0], $scored);
    }

    /**
     * Optimal string alignment distance (insertions, deletions, substitutions, adjacent swaps), compared by
     * Unicode character. Returns $limit + 1 as soon as the distance must exceed $limit.
     */
    public static function editDistance(string $a, string $b, int $limit): int
    {
        $a = mb_str_split($a, 1, 'UTF-8');
        $b = mb_str_split($b, 1, 'UTF-8');
        $la = count($a);
        $lb = count($b);
        if (abs($la - $lb) > $limit) {
            return $limit + 1;
        }
        $prev2 = [];
        $prev = range(0, $lb);
        for ($i = 1; $i <= $la; $i++) {
            $cur = [$i];
            $low = $i;
            for ($j = 1; $j <= $lb; $j++) {
                $cost = $a[$i - 1] === $b[$j - 1] ? 0 : 1;
                $v = min($prev[$j] + 1, $cur[$j - 1] + 1, $prev[$j - 1] + $cost);
                if ($i > 1 && $j > 1 && $a[$i - 1] === $b[$j - 2] && $a[$i - 2] === $b[$j - 1]) {
                    $v = min($v, $prev2[$j - 2] + 1);
                }
                $cur[$j] = $v;
                $low = min($low, $v);
            }
            if ($low > $limit) {
                return $limit + 1;
            }
            $prev2 = $prev;
            $prev = $cur;
        }
        return $prev[$lb];
    }

    /**
     * Alphabetical in the UI language (code point order), with the user's country (if given) first.
     * @param iterable<Country> $countries
     * @return list<Country>
     */
    public static function sortCountries(iterable $countries, string $lang = 'en', ?string $first = null): array
    {
        $key = $lang === 'ar' ? 'sort_ar' : 'sort_en';
        $pin = $first === null ? null : strtoupper($first);
        $list = [...$countries];
        usort($list, static fn (Country $a, Country $b): int => $a->iso2 === $pin ? -1 : ($b->iso2 === $pin ? 1 : strcmp($a->$key, $b->$key)));
        return $list;
    }

    private static function fullMatch(?string $pattern, string $s): bool
    {
        return $pattern !== null && $pattern !== '' && preg_match('~^(?:' . str_replace('~', '\~', $pattern) . ')$~u', $s) === 1;
    }

    /**
     * Reads what a user typed into a phone field. `$country` is the one picked in the field; numbers typed with
     * "+" or "00" are matched against `$all` (or `$country` alone if `$all` is not given).
     * @param iterable<Country>|null $all
     */
    public static function parsePhone(string $input, Country $country, ?iterable $all = null): ?ParsedPhone
    {
        $s = preg_replace('/[^\d+]/', '', Text::westernDigits($input));
        if ($s === '') {
            return null;
        }
        /** @var list<array{iso2: string, plan: PhonePlan, rest: string, w: int}> $plans */
        $plans = [];
        if (str_starts_with($s, '+') || str_starts_with($s, '00')) {
            $s = preg_replace('/^(\+|00)/', '', $s);
            foreach ($all ?? [$country] as $c) {
                foreach ($c->phone as $plan) {
                    $cc = substr($plan->calling_code, 1);
                    if (!str_starts_with($s, $cc)) {
                        continue;
                    }
                    $rest = substr($s, strlen($cc));
                    if ($plan->leading_digits !== null && $plan->leading_digits !== ''
                        && preg_match('~^(?:' . str_replace('~', '\~', $plan->leading_digits) . ')~u', $rest) !== 1) {
                        continue;
                    }
                    $w = ($c->iso2 === $country->iso2 ? 16 : 0)
                        + ($plan->leading_digits ? 8 : 0)
                        + (self::fullMatch($plan->mobile_pattern, $rest) ? 4 : 0)
                        + (!$plan->primary && self::fullMatch($plan->pattern, $rest) ? 2 : 0)
                        + ($plan->primary ? 1 : 0);
                    $plans[] = ['iso2' => $c->iso2, 'plan' => $plan, 'rest' => $rest, 'w' => $w];
                }
            }
            // Stable sort by weight, descending (PHP 8 usort is stable).
            usort($plans, static fn (array $a, array $b): int => $b['w'] <=> $a['w']);
        } else {
            foreach ($country->phone as $plan) {
                $t = $plan->trunk_prefix;
                $rest = ($t !== null && $t !== '' && str_starts_with($s, $t) && !self::fullMatch($plan->pattern, $s)) ? substr($s, strlen($t)) : $s;
                $plans[] = ['iso2' => $country->iso2, 'plan' => $plan, 'rest' => $rest, 'w' => 0];
            }
        }
        if (!$plans) {
            return null;
        }
        $pick = $plans[0];
        foreach ($plans as $p) {
            if (self::fullMatch($p['plan']->pattern, $p['rest'])) {
                $pick = $p;
                break;
            }
        }
        return new ParsedPhone(
            $pick['plan']->calling_code . $pick['rest'],
            $pick['iso2'],
            $pick['plan']->calling_code,
            $pick['rest'],
            self::fullMatch($pick['plan']->pattern, $pick['rest']),
            self::fullMatch($pick['plan']->mobile_pattern, $pick['rest']),
        );
    }

    /**
     * True when the input is a valid mobile number for the country.
     * @param iterable<Country>|null $all
     */
    public static function isValidMobile(string $input, Country $country, ?iterable $all = null): bool
    {
        $p = self::parsePhone($input, $country, $all);
        return $p !== null && $p->valid && $p->mobile && ($all === null || $p->iso2 === $country->iso2);
    }

    /** Groups national digits with the plan's mobile_format mask (5 123 4567 style); returns the digits as-is when the mask does not fit. */
    public static function formatNational(string $national, PhonePlan $plan): string
    {
        $mask = $plan->mobile_format;
        if ($mask === null || $mask === '' || substr_count($mask, '#') !== strlen($national)) {
            return $national;
        }
        $i = 0;
        return preg_replace_callback('/#/', static function () use ($national, &$i): string {
            return $national[$i++];
        }, $mask);
    }

    private const ADDRESS_TOKENS = ['N' => 'name', 'O' => 'organization', 'A' => 'street', 'D' => 'sublocality', 'C' => 'city', 'S' => 'region', 'Z' => 'postal_code', 'X' => 'sorting_code'];
    private const FIXED_LABELS = [
        'name' => ['ar' => 'الاسم', 'en' => 'Name'],
        'organization' => ['ar' => 'المنشأة', 'en' => 'Organization'],
        'street' => ['ar' => 'العنوان', 'en' => 'Street address'],
        'sorting_code' => ['ar' => 'رمز الفرز', 'en' => 'Sorting code'],
    ];

    /**
     * The address form of a country: its fields line by line, in the country's order, with labels in `$lang` and
     * whether the postal service requires each one. Tokens the format uses beyond Google's nine are skipped.
     * Labels are null when the data has no label in that language.
     * @return list<list<array{field: string, label: ?string, required: bool}>>
     */
    public static function addressForm(Country $country, string $lang = 'en'): array
    {
        $a = $country->address;
        $ar = $lang === 'ar';
        $labelOf = static function (string $f) use ($a, $ar): ?string {
            if (isset(self::FIXED_LABELS[$f])) {
                return self::FIXED_LABELS[$f][$ar ? 'ar' : 'en'];
            }
            if ($f === 'city') {
                return $ar ? $a->locality_label_ar : $a->locality_label_en;
            }
            if ($f === 'sublocality') {
                return $ar ? $a->sublocality_label_ar : $a->sublocality_label_en;
            }
            if ($f === 'region') {
                $s = $ar ? $a->region_label_ar : $a->region_label_en;
                return ($s === null || $s === '' || $ar) ? $s : mb_strtoupper(mb_substr($s, 0, 1, 'UTF-8'), 'UTF-8') . mb_substr($s, 1, null, 'UTF-8');
            }
            return $ar ? $a->postal_code_label_ar : $a->postal_code_label_en;
        };
        $seen = [];
        $form = [];
        foreach (explode('%n', $a->address_format ?? '%N%n%O%n%A%n%C') as $line) {
            preg_match_all('/%([A-Z])/', $line, $m);
            $fields = [];
            foreach ($m[1] as $token) {
                $field = self::ADDRESS_TOKENS[$token] ?? null;
                if ($field === null || isset($seen[$field])) {
                    continue;
                }
                $seen[$field] = true;
                $fields[] = ['field' => $field, 'label' => $labelOf($field), 'required' => in_array($field, $a->required_fields, true)];
            }
            if ($fields) {
                $form[] = $fields;
            }
        }
        return $form;
    }
}

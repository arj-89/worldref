<?php

declare(strict_types=1);

namespace WorldRef;

/** Entry point: the dataset, search, sorting and phone helpers. */
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
     * Countries matching a query, best first. Matches names and aliases in both languages, ISO codes, and dial
     * codes with or without "+" or "00".
     * @param iterable<Country> $countries
     * @return list<Country>
     */
    public static function search(iterable $countries, string $query, string $lang = 'en'): array
    {
        $q = Text::normalize($query);
        if ($q === '') {
            return [];
        }
        $digits = preg_replace('/[\s()-]/u', '', Text::westernDigits($query));
        $dial = preg_match('/^(\+|00)?\d{1,4}$/', $digits) ? preg_replace('/^(\+|00)/', '', $digits) : null;
        $upper = mb_strtoupper(trim($query), 'UTF-8');
        $ar = $lang === 'ar';
        $rank = static function (string $name, int $place) use ($q): int {
            if ($name === $q) {
                return 50 - $place;
            }
            if (str_starts_with($name, $q)) {
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
        $key = $ar ? 'sort_ar' : 'sort_en';
        usort($scored, static fn (array $a, array $b): int => $b[1] <=> $a[1] ?: strcmp($a[0]->$key, $b[0]->$key));
        return array_map(static fn (array $s): Country => $s[0], $scored);
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
}

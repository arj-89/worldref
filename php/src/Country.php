<?php

declare(strict_types=1);

namespace WorldRef;

final class Country
{
    /**
     * @param list<string> $aliases_ar
     * @param list<string> $aliases_en
     * @param list<string> $groups
     * @param list<PhonePlan> $phone
     * @param list<Currency> $currencies
     */
    public function __construct(
        public readonly string $iso2,
        public readonly ?string $iso3,
        public readonly ?string $iso_numeric,
        public readonly string $kind,
        public readonly string $name_ar,
        public readonly string $name_en,
        public readonly ?string $official_name_ar,
        public readonly ?string $official_name_en,
        public readonly array $aliases_ar,
        public readonly array $aliases_en,
        public readonly string $flag,
        public readonly string $flag_svg,
        public readonly ?string $continent,
        public readonly array $groups,
        public readonly bool $un_member,
        public readonly ?string $tld,
        public readonly string $sort_ar,
        public readonly string $sort_en,
        public readonly Nationality $nationality,
        public readonly array $phone,
        public readonly array $currencies,
        public readonly Geo $geo,
        public readonly Locale $locale,
        public readonly Address $address,
        public readonly Travel $travel,
        public readonly Sports $sports,
    ) {
    }

    /** @param array<string, mixed> $r */
    public static function fromArray(array $r): self
    {
        return new self(
            $r['iso2'],
            $r['iso3'] ?? null,
            $r['iso_numeric'] ?? null,
            $r['kind'],
            $r['name_ar'],
            $r['name_en'],
            $r['official_name_ar'] ?? null,
            $r['official_name_en'] ?? null,
            $r['aliases_ar'] ?? [],
            $r['aliases_en'] ?? [],
            $r['flag'],
            $r['flag_svg'],
            $r['continent'] ?? null,
            $r['groups'] ?? [],
            $r['un_member'],
            $r['tld'] ?? null,
            $r['sort_ar'],
            $r['sort_en'],
            Nationality::fromArray($r['nationality']),
            array_map(PhonePlan::fromArray(...), $r['phone']),
            array_map(Currency::fromArray(...), $r['currencies']),
            Geo::fromArray($r['geo']),
            Locale::fromArray($r['locale']),
            Address::fromArray($r['address']),
            Travel::fromArray($r['travel']),
            Sports::fromArray($r['sports']),
        );
    }
}

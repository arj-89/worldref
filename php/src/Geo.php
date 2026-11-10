<?php

declare(strict_types=1);

namespace WorldRef;

final class Geo
{
    /**
     * @param list<string> $timezones
     * @param list<TimezoneOffset> $timezone_offsets
     */
    public function __construct(
        public readonly ?string $capital_ar,
        public readonly ?string $capital_en,
        public readonly ?float $lat,
        public readonly ?float $lng,
        public readonly int|float|null $area_km2,
        public readonly ?int $population,
        public readonly ?int $population_year,
        public readonly array $timezones,
        public readonly ?string $driving_side,
        public readonly array $timezone_offsets = [],
    ) {
    }

    /** @param array<string, mixed> $r */
    public static function fromArray(array $r): self
    {
        return new self(
            $r['capital_ar'] ?? null,
            $r['capital_en'] ?? null,
            $r['lat'] ?? null,
            $r['lng'] ?? null,
            $r['area_km2'] ?? null,
            $r['population'] ?? null,
            $r['population_year'] ?? null,
            $r['timezones'] ?? [],
            $r['driving_side'] ?? null,
            array_map(TimezoneOffset::fromArray(...), $r['timezone_offsets'] ?? []),
        );
    }
}

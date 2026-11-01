<?php

declare(strict_types=1);

namespace WorldRef;

final class Nationality
{
    public function __construct(
        public readonly ?string $nationality_ar_m,
        public readonly ?string $nationality_ar_f,
        public readonly ?string $nationality_en,
        public readonly ?string $icao_code,
    ) {
    }

    /** @param array<string, mixed> $r */
    public static function fromArray(array $r): self
    {
        return new self(
            $r['nationality_ar_m'] ?? null,
            $r['nationality_ar_f'] ?? null,
            $r['nationality_en'] ?? null,
            $r['icao_code'] ?? null,
        );
    }
}

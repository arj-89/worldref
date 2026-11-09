<?php

declare(strict_types=1);

namespace WorldRef;

/** A zone's UTC offset in standard time, and in daylight saving time when the zone observes it ("+05:30" style). */
final class TimezoneOffset
{
    public function __construct(
        public readonly string $zone,
        public readonly string $standard,
        public readonly ?string $dst,
    ) {
    }

    /** @param array<string, mixed> $r */
    public static function fromArray(array $r): self
    {
        return new self(
            $r['zone'],
            $r['standard'],
            $r['dst'] ?? null,
        );
    }
}

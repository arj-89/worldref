<?php

declare(strict_types=1);

namespace WorldRef;

final class Travel
{
    /**
     * @param list<string> $plug_types
     * @param list<int|float> $voltage
     * @param list<int|float>|null $frequency_hz
     */
    public function __construct(
        public readonly ?Emergency $emergency,
        public readonly array $plug_types,
        public readonly array $voltage,
        public readonly ?array $frequency_hz,
    ) {
    }

    /** @param array<string, mixed> $r */
    public static function fromArray(array $r): self
    {
        return new self(
            isset($r['emergency']) ? Emergency::fromArray($r['emergency']) : null,
            $r['plug_types'] ?? [],
            $r['voltage'] ?? [],
            $r['frequency_hz'] ?? null,
        );
    }
}

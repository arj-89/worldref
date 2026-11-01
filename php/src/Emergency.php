<?php

declare(strict_types=1);

namespace WorldRef;

final class Emergency
{
    public function __construct(
        public readonly ?string $police,
        public readonly ?string $ambulance,
        public readonly ?string $fire,
        public readonly ?string $general,
    ) {
    }

    /** @param array<string, mixed> $r */
    public static function fromArray(array $r): self
    {
        return new self(
            $r['police'] ?? null,
            $r['ambulance'] ?? null,
            $r['fire'] ?? null,
            $r['general'] ?? null,
        );
    }
}

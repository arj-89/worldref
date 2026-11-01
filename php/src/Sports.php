<?php

declare(strict_types=1);

namespace WorldRef;

final class Sports
{
    public function __construct(
        public readonly ?string $fifa,
        public readonly ?string $ioc,
    ) {
    }

    /** @param array<string, mixed> $r */
    public static function fromArray(array $r): self
    {
        return new self(
            $r['fifa'] ?? null,
            $r['ioc'] ?? null,
        );
    }
}

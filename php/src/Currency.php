<?php

declare(strict_types=1);

namespace WorldRef;

final class Currency
{
    public function __construct(
        public readonly string $code,
        public readonly ?string $name_ar,
        public readonly ?string $name_en,
        public readonly ?string $symbol,
        public readonly ?string $symbol_ar,
        public readonly ?string $symbol_fallback,
    ) {
    }

    /** @param array<string, mixed> $r */
    public static function fromArray(array $r): self
    {
        return new self(
            $r['code'],
            $r['name_ar'] ?? null,
            $r['name_en'] ?? null,
            $r['symbol'] ?? null,
            $r['symbol_ar'] ?? null,
            $r['symbol_fallback'] ?? null,
        );
    }
}

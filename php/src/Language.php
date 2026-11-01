<?php

declare(strict_types=1);

namespace WorldRef;

final class Language
{
    public function __construct(
        public readonly string $code,
        public readonly ?string $name_ar,
        public readonly ?string $name_en,
    ) {
    }

    /** @param array<string, mixed> $r */
    public static function fromArray(array $r): self
    {
        return new self(
            $r['code'],
            $r['name_ar'] ?? null,
            $r['name_en'] ?? null,
        );
    }
}
